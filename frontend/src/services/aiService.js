import api from "../api/api";

// Call Google Gemini API directly over REST (Supports AQ. and AIza... tokens)
export async function generateViaGeminiAPI(prompt, targetBoard = "Arduino UNO Q", userKey = "") {
  const apiKey = userKey || localStorage.getItem("gemini_api_key") || import.meta.env.VITE_GEMINI_API_KEY || "";
  
  if (!apiKey || apiKey.trim() === "") return null;

  const cleanKey = apiKey.trim();
  const models = ["gemini-robotics-er-2-preview", "gemini-2.5-computer-use-preview-10-2025"];

  const systemPrompt = `You are AI SENSE, an expert AI Code Generator & Software/Hardware Engineer for ${targetBoard} (Qualcomm Dragonwing QRB2210 Quad-Core + STM32U585 ARM Cortex-M33 Dual Architecture).
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
}`;

  for (const modelName of models) {
    // Attempt 1: Standard API Key URL Parameter ?key=...
    try {
      const urlKey = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${cleanKey}`;
      const resKey = await fetch(urlKey, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
      });
      const dataKey = await resKey.json();
      if (dataKey.candidates && dataKey.candidates[0]?.content?.parts[0]?.text) {
        let rawText = dataKey.candidates[0].content.parts[0].text.trim();
        if (rawText.startsWith("```json")) rawText = rawText.replace(/^```json/, "");
        if (rawText.startsWith("```")) rawText = rawText.replace(/^```/, "");
        if (rawText.endsWith("```")) rawText = rawText.replace(/```$/, "");
        const parsed = JSON.parse(rawText);
        return {
          success: true,
          source: `Google Gemini AI (${modelName})`,
          title: parsed.title || `Program for ${prompt}`,
          code: parsed.code,
          wiring: parsed.wiring || [],
          componentsNeeded: parsed.componentsNeeded || []
        };
      }
    } catch (e) {
      console.warn(`Key attempt notice (${modelName}):`, e.message);
    }

    // Attempt 2: OAuth 2.0 Bearer Header
    try {
      const urlBearer = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
      const resBearer = await fetch(urlBearer, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${cleanKey}`
        },
        body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
      });
      const dataBearer = await resBearer.json();
      if (dataBearer.candidates && dataBearer.candidates[0]?.content?.parts[0]?.text) {
        let rawText = dataBearer.candidates[0].content.parts[0].text.trim();
        if (rawText.startsWith("```json")) rawText = rawText.replace(/^```json/, "");
        if (rawText.startsWith("```")) rawText = rawText.replace(/^```/, "");
        if (rawText.endsWith("```")) rawText = rawText.replace(/```$/, "");
        const parsed = JSON.parse(rawText);
        return {
          success: true,
          source: `Google Gemini AI OAuth (${modelName})`,
          title: parsed.title || `Program for ${prompt}`,
          code: parsed.code,
          wiring: parsed.wiring || [],
          componentsNeeded: parsed.componentsNeeded || []
        };
      }
    } catch (e) {
      console.warn(`Bearer attempt notice (${modelName}):`, e.message);
    }
  }

  return null;
}

// Master Embedded C++ & Multi-Hardware Engine
export function generateExactOrSynthesizedCodeFrontend(prompt, targetBoard = "Arduino UNO Q") {
  const lp = (prompt || "").toLowerCase();

  // Clean prompt for header title
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

  // Component Detection Flags
  const hasColor = lp.includes('color') || lp.includes('colour') || lp.includes('tcs3200') || lp.includes('tcs230');
  const hasFingerprint = lp.includes('finger') || lp.includes('fingerprint') || lp.includes('r307') || lp.includes('as608');
  const hasUltrasonic = lp.includes('ultrasonic') || lp.includes('distance') || lp.includes('hc-sr04') || lp.includes('sonar');
  const hasDHT = lp.includes('dht') || lp.includes('temp') || lp.includes('temperature') || lp.includes('humidity') || lp.includes('dht11') || lp.includes('dht22');
  const hasDS18B20 = lp.includes('ds18b20') || lp.includes('waterproof temp');
  const hasGas = lp.includes('gas') || lp.includes('smoke') || lp.includes('mq') || lp.includes('co2') || lp.includes('air quality');
  const hasPIR = lp.includes('pir') || lp.includes('motion');
  const hasSoil = lp.includes('soil') || lp.includes('moisture');
  const hasMPU = lp.includes('mpu') || lp.includes('gyro') || lp.includes('accelerometer') || lp.includes('mpu6050');
  const hasRFID = lp.includes('rfid') || lp.includes('rc522') || lp.includes('card');

  // Actuator & Output Flags
  const hasServo = lp.includes('servo') || lp.includes('arm');
  const hasStepper = lp.includes('stepper') || lp.includes('28byj') || lp.includes('a4988') || lp.includes('nema');
  const hasDCMotor = lp.includes('dc motor') || lp.includes('motor driver') || lp.includes('l298n') || lp.includes('l293d');
  const hasRelay = lp.includes('relay') || lp.includes('pump') || lp.includes('solenoid') || lp.includes('lock') || lp.includes('valve');
  const hasBuzzer = lp.includes('buzzer') || lp.includes('alarm') || lp.includes('sound') || lp.includes('beep');
  const hasLED = lp.includes('led') || lp.includes('lamp') || lp.includes('indicator');

  // Display Flags
  const hasLCD = lp.includes('lcd') || lp.includes('16x2') || lp.includes('20x4');
  const hasOLED = lp.includes('oled') || lp.includes('ssd1306');

  // 1. TCS3200 Color Sensor
  if (hasColor) {
    componentsNeeded.push("TCS3200 Color Sensor Module");
    wiring.push("TCS3200 VCC -> 5V DC", "TCS3200 GND -> GND", "S0 -> D4", "S1 -> D5", "S2 -> D6", "S3 -> D7", "OUT -> D8");
    defines.push("#define S0_PIN 4\n#define S1_PIN 5\n#define S2_PIN 6\n#define S3_PIN 7\n#define OUT_PIN 8");
    setupBody.push("  pinMode(S0_PIN, OUTPUT); pinMode(S1_PIN, OUTPUT);\n  pinMode(S2_PIN, OUTPUT); pinMode(S3_PIN, OUTPUT);\n  pinMode(OUT_PIN, INPUT);\n  digitalWrite(S0_PIN, HIGH); digitalWrite(S1_PIN, LOW); // 20% Frequency scaling");
    loopBody.push("  digitalWrite(S2_PIN, LOW); digitalWrite(S3_PIN, LOW); int redPulse = pulseIn(OUT_PIN, LOW); delay(50);");
    loopBody.push("  digitalWrite(S2_PIN, HIGH); digitalWrite(S3_PIN, HIGH); int greenPulse = pulseIn(OUT_PIN, LOW); delay(50);");
    loopBody.push("  digitalWrite(S2_PIN, LOW); digitalWrite(S3_PIN, HIGH); int bluePulse = pulseIn(OUT_PIN, LOW); delay(50);");
    loopBody.push("  int redVal = map(redPulse, 25, 72, 255, 0);");
    loopBody.push("  int greenVal = map(greenPulse, 30, 90, 255, 0);");
    loopBody.push("  int blueVal = map(bluePulse, 25, 70, 255, 0);");
    loopBody.push(`  Serial.print("TELEMETRY|RED:"); Serial.print(redVal); Serial.print("|GREEN:"); Serial.print(greenVal); Serial.print("|BLUE:"); Serial.print(blueVal);`);
  }

  // 2. R307 / AS608 Fingerprint Sensor
  else if (hasFingerprint) {
    includes.push("#include <Adafruit_Fingerprint.h>");
    includes.push("#include <SoftwareSerial.h>");
    componentsNeeded.push("R307 / AS608 Optical Fingerprint Sensor");
    wiring.push("Fingerprint VCC -> 5V", "Fingerprint GND -> GND", "Fingerprint TX -> Digital D2 (SoftwareSerial RX)", "Fingerprint RX -> Digital D3 (SoftwareSerial TX)");
    defines.push("SoftwareSerial mySerial(2, 3);\nAdafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);");
    setupBody.push("  finger.begin(57600);\n  if (finger.verifyPassword()) {\n    Serial.println(\"TELEMETRY|FINGERPRINT:VERIFIED_READY\");\n  } else {\n    Serial.println(\"TELEMETRY|FINGERPRINT:NOT_FOUND\");\n  }");
    loopBody.push("  uint8_t p = finger.getImage();\n  if (p == FINGERPRINT_OK) {\n    p = finger.image2Tz();\n    if (p == FINGERPRINT_OK) {\n      p = finger.fingerFastSearch();\n      if (p == FINGERPRINT_OK) {\n        Serial.print(\"TELEMETRY|FINGER_MATCH_ID:\"); Serial.print(finger.fingerID); Serial.print(\"|CONFIDENCE:\"); Serial.print(finger.confidence);\n      }\n    }\n  }");
  }

  // 3. HC-SR04 Ultrasonic Distance Sensor
  else if (hasUltrasonic) {
    componentsNeeded.push("HC-SR04 Ultrasonic Distance Sensor");
    wiring.push("HC-SR04 VCC -> 5V", "HC-SR04 GND -> GND", "Trig Pin -> Digital D9", "Echo Pin -> Digital D10");
    defines.push("#define TRIG_PIN 9\n#define ECHO_PIN 10");
    setupBody.push("  pinMode(TRIG_PIN, OUTPUT); pinMode(ECHO_PIN, INPUT);");
    loopBody.push("  digitalWrite(TRIG_PIN, LOW); delayMicroseconds(2);");
    loopBody.push("  digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10); digitalWrite(TRIG_PIN, LOW);");
    loopBody.push("  long duration = pulseIn(ECHO_PIN, HIGH);");
    loopBody.push("  float distanceCm = (duration * 0.0343) / 2.0;");
    loopBody.push(`  Serial.print("TELEMETRY|DISTANCE_CM:"); Serial.print(distanceCm, 1);`);
  }

  // 4. DHT11 / DHT22 Sensor
  else if (hasDHT) {
    includes.push("#include <DHT.h>");
    componentsNeeded.push("DHT11 / DHT22 Sensor", "10kΩ Pull-up Resistor");
    wiring.push("DHT VCC -> 5V / 3.3V", "DHT GND -> GND", "DHT Data -> Digital D2 (10kΩ pull-up to VCC)");
    defines.push("#define DHTPIN 2\n#define DHTTYPE DHT11\nDHT dht(DHTPIN, DHTTYPE);");
    setupBody.push("  dht.begin();");
    loopBody.push("  float tempC = dht.readTemperature(); float hum = dht.readHumidity();");
    loopBody.push(`  Serial.print("TELEMETRY|TEMP_C:"); Serial.print(tempC, 1); Serial.print("|HUMIDITY:"); Serial.print(hum, 1); Serial.print("%");`);
  }

  // 5. DS18B20 Waterproof Temp
  else if (hasDS18B20) {
    includes.push("#include <OneWire.h>");
    includes.push("#include <DallasTemperature.h>");
    componentsNeeded.push("DS18B20 Waterproof Temperature Sensor", "4.7kΩ Resistor");
    wiring.push("DS18B20 VCC -> 5V", "DS18B20 GND -> GND", "DS18B20 Data -> Digital D2 (4.7kΩ pull-up)");
    defines.push("#define ONE_WIRE_BUS 2\nOneWire oneWire(ONE_WIRE_BUS);\nDallasTemperature sensors(&oneWire);");
    setupBody.push("  sensors.begin();");
    loopBody.push("  sensors.requestTemperatures(); float tempC = sensors.getTempCByIndex(0);");
    loopBody.push(`  Serial.print("TELEMETRY|WATER_TEMP_C:"); Serial.print(tempC, 2);`);
  }

  // 6. MQ Gas Sensor
  else if (hasGas) {
    componentsNeeded.push("MQ-2 / MQ-135 Gas & Smoke Sensor");
    wiring.push("MQ VCC -> 5V", "MQ GND -> GND", "MQ Analog Output -> Pin A0");
    defines.push("#define MQ_ANALOG_PIN A0");
    loopBody.push("  int rawGas = analogRead(MQ_ANALOG_PIN);");
    loopBody.push("  float voltage = rawGas * (5.0 / 1023.0);");
    loopBody.push(`  Serial.print("TELEMETRY|GAS_RAW:"); Serial.print(rawGas); Serial.print("|VOLTS:"); Serial.print(voltage, 2);`);
  }

  // 7. MPU-6050 Accelerometer & Gyro
  else if (hasMPU) {
    includes.push("#include <Wire.h>");
    includes.push("#include <MPU6050.h>");
    componentsNeeded.push("MPU-6050 6-Axis Accelerometer & Gyroscope");
    wiring.push("MPU VCC -> 3.3V / 5V", "MPU GND -> GND", "MPU SDA -> SDA (A4)", "MPU SCL -> SCL (A5)");
    defines.push("MPU6050 mpu;");
    setupBody.push("  Wire.begin(); mpu.initialize();");
    loopBody.push("  int16_t ax, ay, az, gx, gy, gz; mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);");
    loopBody.push(`  Serial.print("TELEMETRY|ACCEL_X:"); Serial.print(ax / 16384.0, 2); Serial.print("|GYRO_Z:"); Serial.print(gz / 131.0, 2);`);
  }

  // 8. RC522 RFID Reader
  else if (hasRFID) {
    includes.push("#include <SPI.h>");
    includes.push("#include <MFRC522.h>");
    componentsNeeded.push("MFRC522 RFID Card Reader Module", "RFID Tag / Card");
    wiring.push("RC522 VCC -> 3.3V (Strict)", "RC522 GND -> GND", "RC522 RST -> D9", "RC522 SDA -> D10", "MOSI -> D11", "MISO -> D12", "SCK -> D13");
    defines.push("#define SS_PIN 10\n#define RST_PIN 9\nMFRC522 rfid(SS_PIN, RST_PIN);");
    setupBody.push("  SPI.begin(); rfid.PCD_Init();");
    loopBody.push("  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {\n    Serial.print(\"TELEMETRY|RFID_UID:\");\n    for (byte i = 0; i < rfid.uid.size; i++) { Serial.print(rfid.uid.uidByte[i], HEX); }\n    rfid.PICC_HaltA();\n  }");
  }

  // Generic Sensor Fallback
  else {
    componentsNeeded.push(primaryName);
    wiring.push(`${primaryName} VCC -> 5V / 3.3V`, `${primaryName} GND -> GND`, `${primaryName} Signal -> Pin A0`);
    defines.push("#define SENSOR_PIN A0");
    loopBody.push("  int rawVal = analogRead(SENSOR_PIN);");
    loopBody.push(`  Serial.print("TELEMETRY|${tag}_ADC:"); Serial.print(rawVal);`);
  }

  // ACTUATOR & MOTOR CODE INJECTIONS
  if (hasServo) {
    if (!includes.includes("#include <Servo.h>")) includes.push("#include <Servo.h>");
    componentsNeeded.push("SG90 / MG996R Servo Motor");
    wiring.push("Servo Signal (Orange) -> Digital Pin D9", "Servo VCC (Red) -> 5V DC", "Servo GND (Brown) -> GND");
    defines.push("Servo myServo;\n#define SERVO_PIN 9");
    setupBody.push("  myServo.attach(SERVO_PIN); myServo.write(0);");
  }

  if (hasStepper) {
    includes.push("#include <Stepper.h>");
    componentsNeeded.push("28BYJ-48 Stepper Motor", "ULN2003 Driver Board");
    wiring.push("ULN2003 IN1 -> D4", "ULN2003 IN2 -> D5", "ULN2003 IN3 -> D6", "ULN2003 IN4 -> D7", "Driver VCC -> 5V", "GND -> GND");
    defines.push("#define STEPS_PER_REV 2048\nStepper myStepper(STEPS_PER_REV, 4, 6, 5, 7);");
    setupBody.push("  myStepper.setSpeed(10); // 10 RPM");
  }

  if (hasDCMotor) {
    componentsNeeded.push("L298N Dual H-Bridge Motor Driver Module", "DC Gear Motor");
    wiring.push("L298N IN1 -> D3", "L298N IN2 -> D4", "L298N ENA -> PWM D5", "Motor Power -> 12V/5V", "GND -> GND");
    defines.push("#define MOTOR_IN1 3\n#define MOTOR_IN2 4\n#define MOTOR_ENA 5");
    setupBody.push("  pinMode(MOTOR_IN1, OUTPUT); pinMode(MOTOR_IN2, OUTPUT); pinMode(MOTOR_ENA, OUTPUT);");
  }

  if (hasRelay) {
    componentsNeeded.push("5V Relay / Solenoid Valve Module");
    wiring.push("Relay Control IN -> Digital Pin D7", "Relay VCC -> 5V", "Relay GND -> GND");
    defines.push("#define RELAY_PIN 7");
    setupBody.push("  pinMode(RELAY_PIN, OUTPUT); digitalWrite(RELAY_PIN, LOW); // Relay OFF");
  }

  if (hasBuzzer) {
    componentsNeeded.push("Piezo Sound Buzzer");
    wiring.push("Buzzer Positive (+) -> Digital Pin D8", "Buzzer Negative (-) -> GND");
    defines.push("#define BUZZER_PIN 8");
    setupBody.push("  pinMode(BUZZER_PIN, OUTPUT);");
  }

  if (hasLED) {
    componentsNeeded.push("Status Indicator LED", "220Ω Resistor");
    wiring.push("LED Anode (+) -> Digital Pin D13 via 220Ω", "LED Cathode (-) -> GND");
    defines.push("#define LED_PIN 13");
    setupBody.push("  pinMode(LED_PIN, OUTPUT);");
  }

  if (hasLCD && !hasOLED) {
    if (!includes.includes("#include <Wire.h>")) includes.push("#include <Wire.h>");
    includes.push("#include <LiquidCrystal_I2C.h>");
    componentsNeeded.push("LCD 16x2 I2C Display");
    wiring.push("LCD SDA -> SDA (A4)", "LCD SCL -> SCL (A5)", "LCD VCC -> 5V", "LCD GND -> GND");
    defines.push("LiquidCrystal_I2C lcd(0x27, 16, 2);");
    setupBody.push("  Wire.begin(); lcd.init(); lcd.backlight();");
    setupBody.push(`  lcd.setCursor(0, 0); lcd.print("${primaryName.slice(0, 16)}");`);
  }

  if (hasOLED) {
    if (!includes.includes("#include <Wire.h>")) includes.push("#include <Wire.h>");
    includes.push("#include <Adafruit_GFX.h>");
    includes.push("#include <Adafruit_SSD1306.h>");
    componentsNeeded.push("0.96 inch OLED SSD1306 Display (128x64 I2C)");
    wiring.push("OLED SDA -> SDA (A4)", "OLED SCL -> SCL (A5)", "OLED VCC -> 3.3V/5V", "OLED GND -> GND");
    defines.push("#define SCREEN_WIDTH 128\n#define SCREEN_HEIGHT 64\nAdafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);");
    setupBody.push("  display.begin(SSD1306_SWITCHCAPVCC, 0x3C); display.clearDisplay(); display.setTextSize(1); display.setTextColor(WHITE);");
  }

  // ONLY APPEND CONTROL LOGIC IF AT LEAST ONE ACTUATOR IS PRESENT
  const hasAnyActuator = hasServo || hasStepper || hasDCMotor || hasRelay || hasBuzzer || hasLED || hasOLED;

  if (hasAnyActuator) {
    loopBody.push("\n  // --- Functional Actuator Control Logic ---");
    loopBody.push("  if (1) { // Control threshold rule");

    if (hasServo) loopBody.push("    myServo.write(90); // Rotate Servo to 90 degrees");
    if (hasStepper) loopBody.push("    myStepper.step(512); // Rotate Stepper 90 degrees");
    if (hasDCMotor) loopBody.push("    digitalWrite(MOTOR_IN1, HIGH); digitalWrite(MOTOR_IN2, LOW); analogWrite(MOTOR_ENA, 200); // Drive DC Motor");
    if (hasRelay) loopBody.push("    digitalWrite(RELAY_PIN, HIGH); // Activate Relay / Solenoid Lock");
    if (hasBuzzer) loopBody.push("    tone(BUZZER_PIN, 2000); // Sound 2kHz Alarm");
    if (hasLED) loopBody.push("    digitalWrite(LED_PIN, HIGH);");

    loopBody.push("  } else {");

    if (hasServo) loopBody.push("    myServo.write(0); // Return Servo to 0 degrees");
    if (hasDCMotor) loopBody.push("    digitalWrite(MOTOR_IN1, LOW); digitalWrite(MOTOR_IN2, LOW); analogWrite(MOTOR_ENA, 0); // Stop Motor");
    if (hasRelay) loopBody.push("    digitalWrite(RELAY_PIN, LOW); // Deactivate Relay");
    if (hasBuzzer) loopBody.push("    noTone(BUZZER_PIN);");
    if (hasLED) loopBody.push("    digitalWrite(LED_PIN, LOW);");

    loopBody.push("  }");

    if (hasOLED) {
      loopBody.push("  display.clearDisplay(); display.setCursor(0,0);");
      loopBody.push(`  display.println("${primaryName.slice(0, 16)}"); display.display();`);
    }
  }

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
    source: "AI SENSE Master Hardware Engine",
    title,
    prompt,
    code,
    wiring,
    componentsNeeded
  };
}

export const generateCode = async (prompt, targetBoard = "Arduino UNO Q", userKey = "") => {
  // 1. Try Direct Google Gemini API Client (Prioritize gemini-robotics-er-2-preview)
  const geminiResult = await generateViaGeminiAPI(prompt, targetBoard, userKey);
  if (geminiResult) return geminiResult;

  // 2. Try Express Backend API
  try {
    const res = await api.post("/ai/generate", { prompt, boardTarget: targetBoard });
    if (res.data && res.data.code) {
      return { ...res.data, source: "Render Express Gemini Backend" };
    }
  } catch (err) {
    console.warn("Backend API notice, switching to fallback:", err.message);
  }

  // 3. Master Hardware C++ Engine
  return generateExactOrSynthesizedCodeFrontend(prompt, targetBoard);
};