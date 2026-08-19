// Universal Software & Hardware Code Engine for Express Backend
export function generateExactOrSynthesizedCode(prompt, targetBoard = "Arduino UNO Q") {
  const lp = (prompt || "").toLowerCase();

  const cleanWords = prompt
    .replace(/give\s+(a\s+)?(code|program|project)\s+(for|to|of)?/gi, '')
    .replace(/write\s+(a\s+)?(code|program|project)\s+(for|to|of)?/gi, '')
    .replace(/create\s+(a\s+)?(code|program|project)\s+(for|to|of)?/gi, '')
    .replace(/interface\s+(a\s+)?/gi, '')
    .replace(/connect\s+(a\s+)?/gi, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 1 && !['with', 'sensor', 'code', 'using', 'make', 'create', 'arduino', 'program', 'connect', 'interface', 'circuit', 'system', 'build', 'for', 'and', 'the', 'give', 'please', 'help', 'write'].includes(w.toLowerCase()));

  const primaryName = cleanWords.slice(0, 4).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Embedded Hardware Controller';
  const tag = primaryName.toUpperCase().replace(/[^A-Z0-9]/g, '_');

  let title = `${targetBoard} — ${primaryName} System`;
  let componentsNeeded = [targetBoard, "Breadboard", "Jumper Wires"];
  let wiring = [];
  let includes = [];
  let defines = [];
  let setupBody = [];
  let loopBody = [];

  // Component Detection
  const hasColor = lp.includes('color') || lp.includes('colour') || lp.includes('tcs3200') || lp.includes('tcs230');
  const hasFingerprint = lp.includes('finger') || lp.includes('fingerprint') || lp.includes('r307') || lp.includes('as608');
  const hasUltrasonic = lp.includes('ultrasonic') || lp.includes('distance') || lp.includes('hc-sr04') || lp.includes('sonar');
  const hasDHT = lp.includes('dht') || lp.includes('temp') || lp.includes('temperature') || lp.includes('humidity') || lp.includes('dht11') || lp.includes('dht22');
  const hasDS18B20 = lp.includes('ds18b20') || lp.includes('waterproof temp');
  const hasGas = lp.includes('gas') || lp.includes('smoke') || lp.includes('mq') || lp.includes('co2') || lp.includes('air quality');
  const hasMPU = lp.includes('mpu') || lp.includes('gyro') || lp.includes('accelerometer') || lp.includes('mpu6050');
  const hasRFID = lp.includes('rfid') || lp.includes('rc522') || lp.includes('card');

  const hasServo = lp.includes('servo') || lp.includes('arm');
  const hasStepper = lp.includes('stepper') || lp.includes('28byj') || lp.includes('a4988');
  const hasDCMotor = lp.includes('dc motor') || lp.includes('l298n') || lp.includes('l293d');
  const hasRelay = lp.includes('relay') || lp.includes('pump') || lp.includes('solenoid') || lp.includes('lock');
  const hasBuzzer = lp.includes('buzzer') || lp.includes('alarm') || lp.includes('sound');
  const hasLED = lp.includes('led') || lp.includes('lamp') || lp.includes('indicator');
  const hasLCD = lp.includes('lcd') || lp.includes('16x2') || lp.includes('20x4');
  const hasOLED = lp.includes('oled') || lp.includes('ssd1306');

  if (hasColor) {
    componentsNeeded.push("TCS3200 Color Sensor Module");
    wiring.push("TCS3200 VCC -> 5V DC", "TCS3200 GND -> GND", "S0 -> D4", "S1 -> D5", "S2 -> D6", "S3 -> D7", "OUT -> D8");
    defines.push("#define S0_PIN 4\n#define S1_PIN 5\n#define S2_PIN 6\n#define S3_PIN 7\n#define OUT_PIN 8");
    setupBody.push("  pinMode(S0_PIN, OUTPUT); pinMode(S1_PIN, OUTPUT);\n  pinMode(S2_PIN, OUTPUT); pinMode(S3_PIN, OUTPUT);\n  pinMode(OUT_PIN, INPUT);\n  digitalWrite(S0_PIN, HIGH); digitalWrite(S1_PIN, LOW);");
    loopBody.push("  digitalWrite(S2_PIN, LOW); digitalWrite(S3_PIN, LOW); int redPulse = pulseIn(OUT_PIN, LOW); delay(50);");
    loopBody.push("  digitalWrite(S2_PIN, HIGH); digitalWrite(S3_PIN, HIGH); int greenPulse = pulseIn(OUT_PIN, LOW); delay(50);");
    loopBody.push("  digitalWrite(S2_PIN, LOW); digitalWrite(S3_PIN, HIGH); int bluePulse = pulseIn(OUT_PIN, LOW); delay(50);");
    loopBody.push("  int redVal = map(redPulse, 25, 72, 255, 0);");
    loopBody.push("  int greenVal = map(greenPulse, 30, 90, 255, 0);");
    loopBody.push("  int blueVal = map(bluePulse, 25, 70, 255, 0);");
    loopBody.push(`  Serial.print("TELEMETRY|RED:"); Serial.print(redVal); Serial.print("|GREEN:"); Serial.print(greenVal); Serial.print("|BLUE:"); Serial.print(blueVal);`);
  } else if (hasUltrasonic) {
    componentsNeeded.push("HC-SR04 Ultrasonic Distance Sensor");
    wiring.push("HC-SR04 VCC -> 5V", "HC-SR04 GND -> GND", "Trig Pin -> Digital D9", "Echo Pin -> Digital D10");
    defines.push("#define TRIG_PIN 9\n#define ECHO_PIN 10");
    setupBody.push("  pinMode(TRIG_PIN, OUTPUT); pinMode(ECHO_PIN, INPUT);");
    loopBody.push("  digitalWrite(TRIG_PIN, LOW); delayMicroseconds(2);");
    loopBody.push("  digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10); digitalWrite(TRIG_PIN, LOW);");
    loopBody.push("  long duration = pulseIn(ECHO_PIN, HIGH);");
    loopBody.push("  float distanceCm = (duration * 0.0343) / 2.0;");
    loopBody.push(`  Serial.print("TELEMETRY|DISTANCE_CM:"); Serial.print(distanceCm, 1);`);
  } else if (hasDHT) {
    includes.push("#include <DHT.h>");
    componentsNeeded.push("DHT11 / DHT22 Sensor");
    wiring.push("DHT VCC -> 5V", "DHT GND -> GND", "DHT Data -> Digital D2");
    defines.push("#define DHTPIN 2\n#define DHTTYPE DHT11\nDHT dht(DHTPIN, DHTTYPE);");
    setupBody.push("  dht.begin();");
    loopBody.push("  float tempC = dht.readTemperature(); float hum = dht.readHumidity();");
    loopBody.push(`  Serial.print("TELEMETRY|TEMP_C:"); Serial.print(tempC, 1); Serial.print("|HUMIDITY:"); Serial.print(hum, 1);`);
  } else {
    componentsNeeded.push(primaryName);
    wiring.push(`${primaryName} Signal -> Pin A0`);
    defines.push("#define SENSOR_PIN A0");
    loopBody.push("  int rawVal = analogRead(SENSOR_PIN);");
    loopBody.push(`  Serial.print("TELEMETRY|${tag}_ADC:"); Serial.print(rawVal);`);
  }

  if (hasServo) {
    includes.push("#include <Servo.h>");
    componentsNeeded.push("SG90 / MG996R Servo Motor");
    wiring.push("Servo Signal -> Digital Pin D9");
    defines.push("Servo myServo;\n#define SERVO_PIN 9");
    setupBody.push("  myServo.attach(SERVO_PIN); myServo.write(0);");
  }

  if (hasRelay) {
    componentsNeeded.push("5V Relay Module");
    wiring.push("Relay IN -> Pin D7");
    defines.push("#define RELAY_PIN 7");
    setupBody.push("  pinMode(RELAY_PIN, OUTPUT); digitalWrite(RELAY_PIN, LOW);");
  }

  if (hasLED) {
    componentsNeeded.push("Status LED");
    wiring.push("LED Anode -> Pin D13");
    defines.push("#define LED_PIN 13");
    setupBody.push("  pinMode(LED_PIN, OUTPUT);");
  }

  loopBody.push("  Serial.println();");
  loopBody.push("  delay(400);");

  let codeHeader = `/*\n * AI SENSE — ${targetBoard} Backend Engine\n * Generated for Prompt: "${prompt}"\n */\n\n`;
  let code = codeHeader;
  if (includes.length > 0) code += [...new Set(includes)].join("\n") + "\n\n";
  if (defines.length > 0) code += [...new Set(defines)].join("\n") + "\n\n";
  code += "void setup() {\n  Serial.begin(115200);\n";
  code += setupBody.join("\n") + "\n}\n\n";
  code += "void loop() {\n";
  code += loopBody.join("\n") + "\n}\n";

  return {
    success: true,
    source: "AI SENSE Backend Hardware Engine",
    title,
    prompt,
    code,
    wiring,
    componentsNeeded
  };
}

export async function generateResponse(prompt, boardTarget = "Arduino UNO Q") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey.trim() !== "") {
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
      const response = await ai.models.generateContent({
        model: "gemini-robotics-er-2-preview",
        contents: `You are AI SENSE, an expert AI Code Generator & Software/Hardware Engineer for ${boardTarget} (Qualcomm Dragonwing QRB2210 Quad-Core + STM32U585 ARM Cortex-M33 Dual Architecture).
User Prompt: "${prompt}".

- If the user prompt is about HARDWARE (sensors, microcontrollers, Arduino, ESP32, motors, circuits):
  Generate complete C++ code with Serial.print("TELEMETRY|...") telemetry and circuit wiring pinouts.

- If the user prompt is about SOFTWARE (Python, JavaScript, HTML/CSS, C, C++, Java, Rust, SQL, algorithms, web apps, data structures):
  Generate the EXACT, complete, high-performance program in that requested programming language.

Respond ONLY with a valid raw JSON object (NO markdown backticks, NO markdown formatting):
{
  "title": "Descriptive Title for User Prompt",
  "componentsNeeded": ["Language / Hardware 1", "Dependency 2"],
  "wiring": ["Key Feature / Wire 1", "Execution Command / Wire 2"],
  "code": "// Complete working code in requested language",
  "explanation": ["Step 1", "Step 2"]
}`
      });

      let text = response.text ? response.text.trim() : "";
      if (text.startsWith("```json")) text = text.replace(/^```json/, "");
      if (text.startsWith("```")) text = text.replace(/^```/, "");
      if (text.endsWith("```")) text = text.replace(/```$/, "");
      const parsed = JSON.parse(text);
      return {
        success: true,
        source: "Google Gemini Engine (@google/genai - AQ Key Active)",
        title: parsed.title || `Program for ${prompt}`,
        code: parsed.code,
        wiring: parsed.wiring || [],
        componentsNeeded: parsed.componentsNeeded || []
      };
    } catch (err1) {
      console.warn("@google/genai SDK notice, switching to fallback:", err1.message);
    }
  }

  return generateExactOrSynthesizedCode(prompt, boardTarget);
}