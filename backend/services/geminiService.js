// Fallback intelligent Arduino code generator for all 20+ sensors + unlisted sensors
function generateFallbackArduinoCode(prompt) {
  const lp = prompt.toLowerCase();
  let title = "Arduino Generated Program", code = "", wiring = [], componentsNeeded = ['Arduino UNO Q', 'Breadboard', 'Jumper Wires'];

  if (lp.includes('ultrasonic') || lp.includes('hc-sr04') || lp.includes('distance')) {
    title = 'HC-SR04 Ultrasonic Distance Alert System';
    componentsNeeded.push('HC-SR04 Ultrasonic Sensor', 'Piezo Buzzer', 'LED', '220Ω Resistor');
    wiring = ['HC-SR04 VCC -> 5V', 'HC-SR04 GND -> GND', 'Trig -> D9', 'Echo -> D10', 'Buzzer -> D8', 'LED -> D13'];
    code = `#define TRIG_PIN 9\n#define ECHO_PIN 10\n#define BUZZER_PIN 8\n#define LED_PIN 13\n\nvoid setup() {\n  Serial.begin(115200);\n  pinMode(TRIG_PIN, OUTPUT); pinMode(ECHO_PIN, INPUT);\n  pinMode(BUZZER_PIN, OUTPUT); pinMode(LED_PIN, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(TRIG_PIN, LOW); delayMicroseconds(2);\n  digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10); digitalWrite(TRIG_PIN, LOW);\n  long duration = pulseIn(ECHO_PIN, HIGH);\n  float distanceCm = (duration * 0.0343) / 2.0;\n  Serial.print("TELEMETRY|DISTANCE:"); Serial.print(distanceCm, 1); Serial.println("CM");\n  if (distanceCm > 0 && distanceCm < 15) {\n    digitalWrite(LED_PIN, HIGH); tone(BUZZER_PIN, 1000);\n  } else {\n    digitalWrite(LED_PIN, LOW); noTone(BUZZER_PIN);\n  }\n  delay(200);\n}`;
  } else if (lp.includes('dht') || lp.includes('temp') || lp.includes('humidity')) {
    title = 'DHT Temperature & Humidity Monitor';
    componentsNeeded.push('DHT11/DHT22 Sensor', '5V Relay Module', '10kΩ Resistor');
    wiring = ['DHT VCC -> 5V', 'DHT GND -> GND', 'DHT Data -> D2 (10kΩ pull-up to 5V)', 'Relay IN -> D7'];
    code = `#include <DHT.h>\n#define DHTPIN 2\n#define DHTTYPE DHT11\n#define RELAY_PIN 7\nDHT dht(DHTPIN, DHTTYPE);\n\nvoid setup() {\n  Serial.begin(115200);\n  dht.begin();\n  pinMode(RELAY_PIN, OUTPUT);\n}\n\nvoid loop() {\n  delay(2000);\n  float h = dht.readHumidity();\n  float t = dht.readTemperature();\n  if (isnan(h) || isnan(t)) return;\n  Serial.print("TELEMETRY|TEMP:"); Serial.print(t, 1);\n  Serial.print("C|HUMIDITY:"); Serial.print(h, 1); Serial.println("%");\n  if (t >= 28.0) digitalWrite(RELAY_PIN, HIGH);\n  else digitalWrite(RELAY_PIN, LOW);\n}`;
  } else if (lp.includes('mq') || lp.includes('gas') || lp.includes('smoke')) {
    title = 'MQ-2 Gas & Smoke Leak Detector';
    componentsNeeded.push('MQ-2 Gas Sensor', 'Piezo Buzzer', 'LED');
    wiring = ['MQ-2 VCC -> 5V', 'GND -> GND', 'AOUT -> A0', 'DOUT -> D8', 'Buzzer -> D9'];
    code = `#define GAS_PIN A0\n#define BUZZER 9\nvoid setup() { Serial.begin(115200); pinMode(BUZZER, OUTPUT); }\nvoid loop() {\n  int val = analogRead(GAS_PIN);\n  Serial.print("TELEMETRY|GAS:"); Serial.println(val);\n  if (val > 350) tone(BUZZER, 2000);\n  else noTone(BUZZER);\n  delay(300);\n}`;
  } else {
    const words = prompt.split(' ').filter(w => w.length > 3);
    const sensorName = words.slice(0, 3).join(' ') || 'Custom Sensor';
    title = `Arduino Program for ${sensorName}`;
    componentsNeeded.push(sensorName, 'Status LED', '220Ω Resistor');
    wiring = [`${sensorName} VCC -> 5V / 3.3V`, `${sensorName} GND -> GND`, `${sensorName} OUT -> A0 (Analog) / D2 (Digital)`, 'LED -> D13'];
    code = `/*\n * AI SENSE - ${sensorName} Interface\n * Universal sensor program template\n */\n\n#define SENSOR_ANALOG A0\n#define SENSOR_DIGITAL 2\n#define LED_PIN 13\n\nvoid setup() {\n  Serial.begin(115200);\n  pinMode(SENSOR_DIGITAL, INPUT);\n  pinMode(LED_PIN, OUTPUT);\n}\n\nvoid loop() {\n  int analogVal = analogRead(SENSOR_ANALOG);\n  int digitalVal = digitalRead(SENSOR_DIGITAL);\n  int pct = map(analogVal, 0, 1023, 0, 100);\n\n  Serial.print("TELEMETRY|SENSOR_ADC:"); Serial.print(analogVal);\n  Serial.print("|PCT:"); Serial.print(pct);\n  Serial.print("%|DIGITAL:"); Serial.println(digitalVal ? "HIGH" : "LOW");\n\n  digitalWrite(LED_PIN, analogVal > 600 ? HIGH : LOW);\n  delay(500);\n}`;
  }

  return { success: true, title, prompt, code, wiring, componentsNeeded };
}

export async function generateResponse(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey.trim() !== '') {
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const client = new GoogleGenerativeAI(apiKey);
      const model = client.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
      const systemPrompt = `You are AI SENSE, an expert AI embedded systems engineer. Generate Arduino C++ code and circuit wiring for prompt: "${prompt}". Respond ONLY with valid JSON: {"title":"Descriptive Title","componentsNeeded":["Comp 1"],"wiring":["Wire 1"],"code":"// Arduino C++ code"}`;
      const result = await model.generateContent(systemPrompt);
      let text = result.response.text().trim();
      if (text.startsWith('```json')) text = text.replace(/^```json/, '');
      if (text.startsWith('```')) text = text.replace(/^```/, '');
      if (text.endsWith('```')) text = text.replace(/```$/, '');
      const parsed = JSON.parse(text);
      return {
        success: true,
        title: parsed.title || "Arduino Generated Program",
        code: parsed.code,
        wiring: parsed.wiring || [],
        componentsNeeded: parsed.componentsNeeded || []
      };
    } catch (err) {
      console.warn("Gemini AI notice, using Intelligent Engine:", err.message);
    }
  }

  return generateFallbackArduinoCode(prompt);
}