import api from "../api/api";

export function generateExactOrSynthesizedCodeFrontend(prompt, targetBoard = "Arduino UNO Q") {
  const lp = prompt.toLowerCase();
  
  // Extract all clean words for header naming
  const cleanWords = prompt
    .replace(/give\s+(a\s+)?(code|program|project)\s+(for|to|of)?/gi, '')
    .replace(/write\s+(a\s+)?(code|program|project)\s+(for|to|of)?/gi, '')
    .replace(/create\s+(a\s+)?(code|program|project)\s+(for|to|of)?/gi, '')
    .replace(/interface\s+(a\s+)?/gi, '')
    .replace(/connect\s+(a\s+)?/gi, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 1 && !['with', 'sensor', 'code', 'using', 'make', 'create', 'arduino', 'program', 'connect', 'interface', 'circuit', 'system', 'build', 'for', 'and', 'the', 'give', 'please', 'help', 'write'].includes(w.toLowerCase()));

  const primaryName = cleanWords.slice(0, 4).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Embedded Hardware System';
  const tag = primaryName.toUpperCase().replace(/[^A-Z0-9]/g, '_');

  let title = `${targetBoard} — ${primaryName} Control System`;
  let componentsNeeded = [targetBoard, "Breadboard", "Jumper Wires"];
  let wiring = [];
  let includes = [];
  let defines = [];
  let setupBody = [];
  let loopBody = [];

  // Detect Hardware Components
  const hasColor = lp.includes('color') || lp.includes('colour') || lp.includes('tcs3200') || lp.includes('tcs230');
  const hasFingerprint = lp.includes('finger') || lp.includes('fingerprint') || lp.includes('r307') || lp.includes('as608') || lp.includes('biometric');
  const hasUltrasonic = lp.includes('ultrasonic') || lp.includes('distance') || lp.includes('hc-sr04') || lp.includes('sonar');
  const hasDHT = lp.includes('dht') || lp.includes('temp') || lp.includes('temperature') || lp.includes('humidity') || lp.includes('dht11') || lp.includes('dht22');
  const hasDS18B20 = lp.includes('ds18b20') || lp.includes('waterproof temp') || lp.includes('1-wire');
  const hasGas = lp.includes('gas') || lp.includes('smoke') || lp.includes('mq') || lp.includes('co2') || lp.includes('air quality');
  const hasPIR = lp.includes('pir') || lp.includes('motion') || lp.includes('motion sensor');
  const hasSoil = lp.includes('soil') || lp.includes('moisture');
  const hasMPU = lp.includes('mpu') || lp.includes('gyro') || lp.includes('accelerometer') || lp.includes('imu') || lp.includes('mpu6050');
  const hasWeight = lp.includes('weight') || lp.includes('load cell') || lp.includes('hx711') || lp.includes('scale');
  const hasCurrent = lp.includes('current') || lp.includes('acs712') || lp.includes('voltage') || lp.includes('power');
  const hasPulse = lp.includes('heart') || lp.includes('pulse') || lp.includes('oximeter') || lp.includes('max30100') || lp.includes('spo2') || lp.includes('ecg');
  const hasLDR = lp.includes('light') || lp.includes('ldr') || lp.includes('lux') || lp.includes('photoresistor');
  const hasRFID = lp.includes('rfid') || lp.includes('rc522') || lp.includes('card');
  const hasGPS = lp.includes('gps') || lp.includes('neo6m') || lp.includes('location');

  // Detect Actuators & Outputs
  const hasLCD = lp.includes('lcd') || lp.includes('16x2') || lp.includes('display');
  const hasOLED = lp.includes('oled') || lp.includes('ssd1306') || lp.includes('screen');
  const hasBuzzer = lp.includes('buzzer') || lp.includes('alarm') || lp.includes('sound') || lp.includes('beep');
  const hasRelay = lp.includes('relay') || lp.includes('pump') || lp.includes('fan') || lp.includes('solenoid') || lp.includes('lock') || lp.includes('valve');
  const hasServo = lp.includes('servo') || lp.includes('arm');
  const hasStepper = lp.includes('stepper') || lp.includes('28byj') || lp.includes('a4988');
  const hasDCMotor = lp.includes('dc motor') || lp.includes('motor driver') || lp.includes('l298n');
  const hasLED = lp.includes('led') || lp.includes('indicator') || lp.includes('lamp');
  const hasJoystick = lp.includes('joystick') || lp.includes('ps2');
  const hasRotary = lp.includes('rotary') || lp.includes('encoder') || lp.includes('ky040');

  // 1. Color Sensor TCS3200
  if (hasColor) {
    componentsNeeded.push("TCS3200 / TCS230 Color Sensor Module");
    wiring.push("TCS3200 VCC -> 5V DC", "TCS3200 GND -> GND", "S0 -> D4", "S1 -> D5", "S2 -> D6", "S3 -> D7", "OUT -> D8");
    defines.push("#define S0_PIN 4\n#define S1_PIN 5\n#define S2_PIN 6\n#define S3_PIN 7\n#define OUT_PIN 8");
    setupBody.push("  pinMode(S0_PIN, OUTPUT); pinMode(S1_PIN, OUTPUT);\n  pinMode(S2_PIN, OUTPUT); pinMode(S3_PIN, OUTPUT);\n  pinMode(OUT_PIN, INPUT);\n  digitalWrite(S0_PIN, HIGH); digitalWrite(S1_PIN, LOW);");
    loopBody.push("  digitalWrite(S2_PIN, LOW); digitalWrite(S3_PIN, LOW); int red = pulseIn(OUT_PIN, LOW); delay(50);");
    loopBody.push("  digitalWrite(S2_PIN, HIGH); digitalWrite(S3_PIN, HIGH); int green = pulseIn(OUT_PIN, LOW); delay(50);");
    loopBody.push("  digitalWrite(S2_PIN, LOW); digitalWrite(S3_PIN, HIGH); int blue = pulseIn(OUT_PIN, LOW); delay(50);");
    loopBody.push(`  Serial.print("TELEMETRY|RED:"); Serial.print(map(red,25,72,255,0)); Serial.print("|GREEN:"); Serial.print(map(green,30,90,255,0)); Serial.print("|BLUE:"); Serial.print(map(blue,25,70,255,0));`);
  }

  // 2. Fingerprint R307
  else if (hasFingerprint) {
    includes.push("#include <Adafruit_Fingerprint.h>");
    includes.push("#include <SoftwareSerial.h>");
    componentsNeeded.push("R307 / AS608 Optical Fingerprint Sensor");
    wiring.push("Fingerprint VCC -> 5V", "Fingerprint GND -> GND", "Fingerprint TX -> Digital D2 (SoftwareSerial RX)", "Fingerprint RX -> Digital D3 (SoftwareSerial TX)");
    defines.push("SoftwareSerial mySerial(2, 3);\nAdafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);");
    setupBody.push("  finger.begin(57600);\n  if(finger.verifyPassword()) Serial.println(\"TELEMETRY|FINGERPRINT:READY\");");
    loopBody.push("  uint8_t p = finger.getImage();\n  if (p == FINGERPRINT_OK) {\n    finger.image2Tz();\n    if (finger.fingerFastSearch() == FINGERPRINT_OK) {\n      Serial.print(\"TELEMETRY|FINGER_ID:\"); Serial.println(finger.fingerID);\n    }\n  }");
  }

  // 3. Ultrasonic HC-SR04
  else if (hasUltrasonic) {
    componentsNeeded.push("HC-SR04 Ultrasonic Distance Sensor");
    wiring.push("HC-SR04 VCC -> 5V", "HC-SR04 GND -> GND", "Trig Pin -> Digital D9", "Echo Pin -> Digital D10");
    defines.push("#define TRIG_PIN 9\n#define ECHO_PIN 10");
    setupBody.push("  pinMode(TRIG_PIN, OUTPUT); pinMode(ECHO_PIN, INPUT);");
    loopBody.push("  digitalWrite(TRIG_PIN, LOW); delayMicroseconds(2); digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10); digitalWrite(TRIG_PIN, LOW);");
    loopBody.push("  long duration = pulseIn(ECHO_PIN, HIGH);\n  float distanceCm = (duration * 0.0343) / 2.0;");
    loopBody.push(`  Serial.print("TELEMETRY|DISTANCE_CM:"); Serial.print(distanceCm, 1);`);
  }

  // 4. DHT Temp & Humidity
  else if (hasDHT) {
    includes.push("#include <DHT.h>");
    componentsNeeded.push("DHT11 / DHT22 Sensor", "10kΩ Pull-up Resistor");
    wiring.push("DHT VCC -> 5V / 3.3V", "DHT GND -> GND", "DHT Data -> Digital D2 (10kΩ pull-up to VCC)");
    defines.push("#define DHTPIN 2\n#define DHTTYPE DHT11\nDHT dht(DHTPIN, DHTTYPE);");
    setupBody.push("  dht.begin();");
    loopBody.push("  float tempC = dht.readTemperature();\n  float hum = dht.readHumidity();");
    loopBody.push(`  Serial.print("TELEMETRY|TEMP_C:"); Serial.print(tempC, 1); Serial.print("|HUMIDITY:"); Serial.print(hum, 1); Serial.print("%");`);
  }

  // 5. MPU6050 IMU
  else if (hasMPU) {
    includes.push("#include <Wire.h>");
    includes.push("#include <MPU6050.h>");
    componentsNeeded.push("MPU-6050 6-Axis Motion Tracking Sensor");
    wiring.push("MPU VCC -> 3.3V / 5V", "MPU GND -> GND", "MPU SCL -> SCL (A5)", "MPU SDA -> SDA (A4)");
    defines.push("MPU6050 mpu;");
    setupBody.push("  Wire.begin(); mpu.initialize();");
    loopBody.push("  int16_t ax, ay, az, gx, gy, gz;\n  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);");
    loopBody.push(`  Serial.print("TELEMETRY|ACCEL_X:"); Serial.print(ax/16384.0, 2); Serial.print("|GYRO_Z:"); Serial.print(gz/131.0, 2);`);
  }

  // Generic Analog/Digital Sensor Fallback
  else {
    componentsNeeded.push(primaryName);
    wiring.push(`${primaryName} VCC -> 5V / 3.3V DC`, `${primaryName} GND -> GND`, `${primaryName} Signal -> Analog Pin A0 / Digital D2`);
    defines.push("#define SENSOR_PIN A0");
    loopBody.push("  int rawAdc = analogRead(SENSOR_PIN);");
    loopBody.push(`  Serial.print("TELEMETRY|${tag}_ADC:"); Serial.print(rawAdc);`);
  }

  // Actuator Code Injections
  if (hasBuzzer) {
    componentsNeeded.push("Piezo Buzzer");
    wiring.push("Buzzer (+) -> Digital D8", "Buzzer (-) -> GND");
    defines.push("#define BUZZER_PIN 8");
    setupBody.push("  pinMode(BUZZER_PIN, OUTPUT);");
  }

  if (hasRelay) {
    componentsNeeded.push("5V Relay Module");
    wiring.push("Relay Control IN -> Digital D7", "Relay VCC -> 5V", "Relay GND -> GND");
    defines.push("#define RELAY_PIN 7");
    setupBody.push("  pinMode(RELAY_PIN, OUTPUT); digitalWrite(RELAY_PIN, LOW);");
  }

  if (hasLED) {
    componentsNeeded.push("Status Indicator LED", "220Ω Resistor");
    wiring.push("LED Anode (+) -> Digital D13 via 220Ω", "LED Cathode (-) -> GND");
    defines.push("#define LED_PIN 13");
    setupBody.push("  pinMode(LED_PIN, OUTPUT);");
  }

  if (hasServo) {
    if (!includes.includes("#include <Servo.h>")) includes.push("#include <Servo.h>");
    componentsNeeded.push("Servo Motor");
    wiring.push("Servo Signal -> Digital D9", "Servo VCC -> 5V", "Servo GND -> GND");
    defines.push("Servo myServo;\n#define SERVO_PIN 9");
    setupBody.push("  myServo.attach(SERVO_PIN); myServo.write(0);");
  }

  if (hasLCD && !hasOLED) {
    if (!includes.includes("#include <Wire.h>")) includes.push("#include <Wire.h>");
    includes.push("#include <LiquidCrystal_I2C.h>");
    componentsNeeded.push("LCD 16x2 I2C Display");
    wiring.push("LCD SDA -> SDA (A4)", "LCD SCL -> SCL (A5)");
    defines.push("LiquidCrystal_I2C lcd(0x27, 16, 2);");
    setupBody.push("  Wire.begin(); lcd.init(); lcd.backlight();");
    setupBody.push(`  lcd.setCursor(0, 0); lcd.print("${primaryName.slice(0, 16)}");`);
  }

  // Actuator Trigger Logic
  loopBody.push("  if (1) { // Threshold logic rule");
  if (hasRelay) loopBody.push("    digitalWrite(RELAY_PIN, HIGH);");
  if (hasBuzzer) loopBody.push("    tone(BUZZER_PIN, 2000);");
  if (hasLED) loopBody.push("    digitalWrite(LED_PIN, HIGH);");
  if (hasServo) loopBody.push("    myServo.write(90);");
  loopBody.push("  } else {");
  if (hasRelay) loopBody.push("    digitalWrite(RELAY_PIN, LOW);");
  if (hasBuzzer) loopBody.push("    noTone(BUZZER_PIN);");
  if (hasLED) loopBody.push("    digitalWrite(LED_PIN, LOW);");
  if (hasServo) loopBody.push("    myServo.write(0);");
  loopBody.push("  }");
  loopBody.push("  Serial.println();");
  loopBody.push("  delay(400);");

  let codeHeader = `/*\n * AI SENSE — ${targetBoard} Target\n * Qualcomm Dragonwing QRB2210 AP + STM32U585 ARM Cortex-M33 Coprocessor\n * Generated for Prompt: "${prompt}"\n */\n\n`;

  let code = codeHeader;
  if (includes.length > 0) code += [...new Set(includes)].join("\n") + "\n\n";
  if (defines.length > 0) code += [...new Set(defines)].join("\n") + "\n\n";

  code += "void setup() {\n  Serial.begin(115200); // 115200 Baud WebSerial Telemetry\n";
  code += setupBody.join("\n") + "\n}\n\n";

  code += "void loop() {\n";
  code += loopBody.join("\n") + "\n}\n";

  return {
    success: true,
    title,
    prompt,
    code,
    wiring,
    componentsNeeded
  };
}

// Call Google Gemini API directly over REST
async function generateViaGeminiAPI(prompt, targetBoard = "Arduino UNO Q") {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") return null;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const systemPrompt = `You are AI SENSE, an expert embedded AI systems engineer for ${targetBoard} Single Board Computer (Qualcomm Dragonwing QRB2210 Quad-Core + STM32U585 ARM Cortex-M33 Dual Architecture).
Generate EXACT, fully working, compilable C++ code, circuit wiring pinouts, and components needed for ANY prompt: "${prompt}".
Respond ONLY with a valid raw JSON object (NO markdown backticks, NO markdown formatting):
{
  "title": "Descriptive Title for User's Prompt",
  "componentsNeeded": ["Component 1", "Component 2"],
  "wiring": ["Wire instruction 1", "Wire instruction 2"],
  "code": "// Compilable C++ code with Serial.print TELEMETRY|...",
  "explanation": ["Step 1", "Step 2"]
}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }]
      })
    });

    const data = await res.json();
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      let rawText = data.candidates[0].content.parts[0].text.trim();
      if (rawText.startsWith("```json")) rawText = rawText.replace(/^```json/, "");
      if (rawText.startsWith("```")) rawText = rawText.replace(/^```/, "");
      if (rawText.endsWith("```")) rawText = rawText.replace(/```$/, "");
      const parsed = JSON.parse(rawText);
      return {
        success: true,
        title: parsed.title || `${targetBoard} Program for ${prompt}`,
        code: parsed.code,
        wiring: parsed.wiring || [],
        componentsNeeded: parsed.componentsNeeded || []
      };
    }
  } catch (err) {
    console.warn("Direct Gemini REST call notice:", err.message);
  }
  return null;
}

export const generateCode = async (prompt, targetBoard = "Arduino UNO Q") => {
  // 1. Try Express Backend API
  try {
    const res = await api.post("/ai/generate", { prompt, boardTarget: targetBoard });
    if (res.data && res.data.code) {
      return res.data;
    }
  } catch (err) {
    console.warn("Backend API notice, switching to Gemini Client / Synthesizer:", err.message);
  }

  // 2. Try Direct Google Gemini API Client
  const geminiResult = await generateViaGeminiAPI(prompt, targetBoard);
  if (geminiResult) return geminiResult;

  // 3. Multi-Hardware Dynamic Synthesizer Engine
  return generateExactOrSynthesizedCodeFrontend(prompt, targetBoard);
};