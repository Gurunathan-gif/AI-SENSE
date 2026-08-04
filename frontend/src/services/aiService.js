import api from "../api/api";

export function generateExactOrSynthesizedCodeFrontend(prompt) {
  const lp = prompt.toLowerCase();
  
  const cleanedPrompt = lp
    .replace(/give\s+(a\s+)?(code|program|project)\s+(for|to|of)?/g, '')
    .replace(/write\s+(a\s+)?(code|program|project)\s+(for|to|of)?/g, '')
    .replace(/create\s+(a\s+)?(code|program|project)\s+(for|to|of)?/g, '')
    .replace(/interface\s+(a\s+)?/g, '')
    .replace(/connect\s+(a\s+)?/g, '')
    .trim();

  let title = "Arduino Sensor Program";
  let code = "";
  let wiring = [];
  let componentsNeeded = ["Arduino UNO Q", "Breadboard", "Jumper Wires"];

  // 1. TCS3200 / TCS230 Color Sensor
  if (cleanedPrompt.includes("color") || cleanedPrompt.includes("colour") || cleanedPrompt.includes("tcs3200") || cleanedPrompt.includes("tcs230")) {
    title = "TCS3200 Color Sensor RGB Identification System";
    componentsNeeded.push("TCS3200 / TCS230 Color Sensor Module", "Status RGB / Indicator LED");
    wiring = [
      "TCS3200 VCC -> 5V DC",
      "TCS3200 GND -> GND",
      "S0 Pin -> Digital D4 (Frequency Scaling 20%)",
      "S1 Pin -> Digital D5",
      "S2 Pin -> Digital D6 (Color Filter Selection)",
      "S3 Pin -> Digital D7",
      "OUT Pin -> Digital D8 (Frequency Output Pulse)"
    ];
    code = `/*
 * AI SENSE — TCS3200 / TCS230 Color Sensor
 * RGB Color Recognition & Pulse Frequency Measurement
 */

#define S0_PIN 4
#define S1_PIN 5
#define S2_PIN 6
#define S3_PIN 7
#define OUT_PIN 8

int redFrequency = 0;
int greenFrequency = 0;
int blueFrequency = 0;

void setup() {
  Serial.begin(115200);
  pinMode(S0_PIN, OUTPUT);
  pinMode(S1_PIN, OUTPUT);
  pinMode(S2_PIN, OUTPUT);
  pinMode(S3_PIN, OUTPUT);
  pinMode(OUT_PIN, INPUT);

  // Set Frequency scaling to 20%
  digitalWrite(S0_PIN, HIGH);
  digitalWrite(S1_PIN, LOW);
}

void loop() {
  // Read Red filtered pulse frequency
  digitalWrite(S2_PIN, LOW);
  digitalWrite(S3_PIN, LOW);
  redFrequency = pulseIn(OUT_PIN, LOW);
  delay(100);

  // Read Green filtered pulse frequency
  digitalWrite(S2_PIN, HIGH);
  digitalWrite(S3_PIN, HIGH);
  greenFrequency = pulseIn(OUT_PIN, LOW);
  delay(100);

  // Read Blue filtered pulse frequency
  digitalWrite(S2_PIN, LOW);
  digitalWrite(S3_PIN, HIGH);
  blueFrequency = pulseIn(OUT_PIN, LOW);
  delay(100);

  int redColor = map(redFrequency, 25, 72, 255, 0);
  int greenColor = map(greenFrequency, 30, 90, 255, 0);
  int blueColor = map(blueFrequency, 25, 70, 255, 0);

  Serial.print("TELEMETRY|RED:");
  Serial.print(redColor);
  Serial.print("|GREEN:");
  Serial.print(greenColor);
  Serial.print("|BLUE:");
  Serial.println(blueColor);

  delay(500);
}`;
  }

  // 2. Optical Fingerprint Sensor (FPM10A / R307 / AS608)
  else if (cleanedPrompt.includes("finger") || cleanedPrompt.includes("fingerprint") || cleanedPrompt.includes("biometric") || cleanedPrompt.includes("r307") || cleanedPrompt.includes("as608")) {
    title = "FPM10A / R307 Optical Fingerprint Access Control";
    componentsNeeded.push("R307 / AS608 Optical Fingerprint Sensor", "5V Solenoid Door Lock Relay", "Green & Red LEDs");
    wiring = [
      "Fingerprint Sensor VCC -> 5V DC (Strict)",
      "Fingerprint Sensor GND -> GND",
      "Fingerprint TX -> Digital D2 (SoftwareSerial RX)",
      "Fingerprint RX -> Digital D3 (SoftwareSerial TX)",
      "Door Lock Relay -> Digital D7",
      "Status LED -> Digital D13"
    ];
    code = `/*
 * AI SENSE — Optical Fingerprint Sensor (R307 / AS608)
 * Biometric Verification & Access Control System
 */

#include <Adafruit_Fingerprint.h>
#include <SoftwareSerial.h>

SoftwareSerial mySerial(2, 3); // RX=D2, TX=D3
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

#define RELAY_PIN 7
#define LED_PIN 13

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  finger.begin(57600);
  if (finger.verifyPassword()) {
    Serial.println("TELEMETRY|STATUS:FINGERPRINT_SENSOR_READY");
  } else {
    Serial.println("TELEMETRY|STATUS:FINGERPRINT_NOT_FOUND");
  }
}

void loop() {
  int fingerprintID = getFingerprintID();
  if (fingerprintID > 0) {
    Serial.print("TELEMETRY|FINGER_MATCH_ID:");
    Serial.print(fingerprintID);
    Serial.println("|ACCESS:GRANTED");

    digitalWrite(LED_PIN, HIGH);
    digitalWrite(RELAY_PIN, HIGH);
    delay(3000);
    digitalWrite(RELAY_PIN, LOW);
    digitalWrite(LED_PIN, LOW);
  }
  delay(200);
}

int getFingerprintID() {
  uint8_t p = finger.getImage();
  if (p != FINGERPRINT_OK) return -1;

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK) return -1;

  p = finger.fingerFastSearch();
  if (p != FINGERPRINT_OK) return -1;

  return finger.fingerID;
}`;
  }

  // 3. HX711 Load Cell Weight Scale
  else if (cleanedPrompt.includes("weight") || cleanedPrompt.includes("load cell") || cleanedPrompt.includes("hx711") || cleanedPrompt.includes("scale")) {
    title = "HX711 Load Cell Precision Weight Scale";
    componentsNeeded.push("HX711 Amplifier Module", "5kg / 10kg Strain Gauge Load Cell");
    wiring = [
      "HX711 VCC -> 5V", "HX711 GND -> GND", "HX711 DT -> Digital D2", "HX711 SCK -> Digital D3"
    ];
    code = `/*
 * AI SENSE — HX711 Load Cell Weight Measurement
 */

#include "HX711.h"

#define LOADCELL_DOUT_PIN 2
#define LOADCELL_SCK_PIN 3

HX711 scale;
float calibration_factor = -7050;

void setup() {
  Serial.begin(115200);
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  scale.set_scale(calibration_factor);
  scale.tare();
}

void loop() {
  if (scale.is_ready()) {
    float weightGrams = scale.get_units(5) * 1000.0;
    Serial.print("TELEMETRY|WEIGHT_GRAMS:");
    Serial.print(weightGrams, 1);
    Serial.println("G");
  }
  delay(500);
}`;
  }

  // 4. HC-SR04 Ultrasonic Distance Sensor
  else if (cleanedPrompt.includes("ultrasonic") || cleanedPrompt.includes("hc-sr04") || cleanedPrompt.includes("distance")) {
    title = "HC-SR04 Ultrasonic Distance Alert System";
    componentsNeeded.push("HC-SR04 Ultrasonic Sensor", "Piezo Buzzer", "LED", "220Ω Resistor");
    wiring = ["HC-SR04 VCC -> 5V", "HC-SR04 GND -> GND", "Trig Pin -> Digital D9", "Echo Pin -> Digital D10", "Buzzer -> Digital D8", "LED -> Digital D13"];
    code = `/*
 * AI SENSE — HC-SR04 Ultrasonic Distance Sensor
 * Precision Sonar Distance Measurement & Alarm System
 */

#define TRIG_PIN 9
#define ECHO_PIN 10
#define BUZZER_PIN 8
#define LED_PIN 13

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH);
  float distanceCm = (duration * 0.0343) / 2.0;

  Serial.print("TELEMETRY|DISTANCE:");
  Serial.print(distanceCm, 1);
  Serial.println("CM");

  if (distanceCm > 0 && distanceCm < 15.0) {
    digitalWrite(LED_PIN, HIGH);
    tone(BUZZER_PIN, 1000);
  } else {
    digitalWrite(LED_PIN, LOW);
    noTone(BUZZER_PIN);
  }

  delay(200);
}`;
  }

  // 5. Universal Heuristic Synthesizer
  else {
    return synthesizeCustomSensorCodeFrontend(prompt);
  }

  return { success: true, title, prompt, code, wiring, componentsNeeded };
}

export function synthesizeCustomSensorCodeFrontend(prompt) {
  const lp = prompt.toLowerCase();
  
  const cleanWords = prompt
    .replace(/give\s+(a\s+)?(code|program|project)\s+(for|to|of)?/gi, '')
    .replace(/write\s+(a\s+)?(code|program|project)\s+(for|to|of)?/gi, '')
    .replace(/create\s+(a\s+)?(code|program|project)\s+(for|to|of)?/gi, '')
    .replace(/interface\s+(a\s+)?/gi, '')
    .replace(/connect\s+(a\s+)?/gi, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !['with', 'sensor', 'code', 'using', 'make', 'create', 'arduino', 'program', 'connect', 'interface', 'circuit', 'system', 'build', 'for', 'and', 'the', 'give'].includes(w.toLowerCase()));

  const primaryName = cleanWords.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Custom Hardware Module';
  const tag = primaryName.toUpperCase().replace(/[^A-Z0-9]/g, '_');

  let title = `Exact Arduino System for ${primaryName}`;
  let componentsNeeded = ["Arduino UNO Q", "Breadboard", "Jumper Wires", primaryName];
  let wiring = [`${primaryName} VCC -> 5V / 3.3V DC Power`, `${primaryName} GND -> Arduino GND Ground`];
  let codeHeader = `/*\n * AI SENSE — ${primaryName} Precision Control Program\n * Generated for Prompt: "${prompt}"\n */\n\n`;
  let includes = [];
  let defines = [];
  let setupBody = [];
  let loopBody = [];

  const hasLCD = lp.includes('lcd') || lp.includes('16x2') || lp.includes('display');
  const hasOLED = lp.includes('oled') || lp.includes('ssd1306');
  const hasBuzzer = lp.includes('buzzer') || lp.includes('alarm') || lp.includes('sound') || lp.includes('beep');
  const hasRelay = lp.includes('relay') || lp.includes('pump') || lp.includes('motor') || lp.includes('fan') || lp.includes('light');
  const hasServo = lp.includes('servo') || lp.includes('arm') || lp.includes('angle');
  const hasLED = lp.includes('led') || lp.includes('indicator') || lp.includes('lamp');

  const isI2C = lp.includes('i2c') || lp.includes('vl53l0x') || lp.includes('bmp280') || lp.includes('bme280') || lp.includes('bh1750') || lp.includes('mpu') || lp.includes('aht20') || lp.includes('ina219');
  const isSPI = lp.includes('spi') || lp.includes('rfid') || lp.includes('nrf24') || lp.includes('sd card');
  const isOneWire = lp.includes('ds18b20') || lp.includes('1-wire') || lp.includes('onewire');
  const isAnalog = lp.includes('analog') || lp.includes('soil') || lp.includes('moisture') || lp.includes('flex') || lp.includes('force') || lp.includes('fsr') || lp.includes('ldr') || lp.includes('light') || lp.includes('rain') || lp.includes('water') || lp.includes('sound') || lp.includes('mic') || lp.includes('mq') || lp.includes('current') || lp.includes('gas') || lp.includes('smoke') || lp.includes('ph') || lp.includes('turbidity') || lp.includes('weight') || lp.includes('load cell') || lp.includes('potentiometer');

  if (hasBuzzer) {
    componentsNeeded.push("Piezo Buzzer");
    wiring.push("Buzzer Positive -> Digital Pin D8", "Buzzer Negative -> GND");
    defines.push("#define BUZZER_PIN 8");
    setupBody.push("  pinMode(BUZZER_PIN, OUTPUT);");
  }

  if (hasRelay) {
    componentsNeeded.push("5V Relay Module");
    wiring.push("Relay Control IN -> Digital Pin D7", "Relay VCC -> 5V", "Relay GND -> GND");
    defines.push("#define RELAY_PIN 7");
    setupBody.push("  pinMode(RELAY_PIN, OUTPUT);");
    setupBody.push("  digitalWrite(RELAY_PIN, LOW);");
  }

  if (hasLED) {
    componentsNeeded.push("Status Indicator LED", "220Ω Resistor");
    wiring.push("LED Anode (+) -> Digital Pin D13 via 220Ω", "LED Cathode (-) -> GND");
    defines.push("#define LED_PIN 13");
    setupBody.push("  pinMode(LED_PIN, OUTPUT);");
  }

  if (hasServo) {
    includes.push("#include <Servo.h>");
    componentsNeeded.push("Servo Motor");
    wiring.push("Servo Signal -> Digital Pin D9", "Servo VCC -> 5V", "Servo GND -> GND");
    defines.push("Servo myServo;\n#define SERVO_PIN 9");
    setupBody.push("  myServo.attach(SERVO_PIN);");
    setupBody.push("  myServo.write(0);");
  }

  if (hasLCD && !hasOLED) {
    includes.push("#include <Wire.h>");
    includes.push("#include <LiquidCrystal_I2C.h>");
    componentsNeeded.push("LCD 16x2 I2C Display");
    wiring.push("LCD SDA -> SDA (A4)", "LCD SCL -> SCL (A5)");
    defines.push("LiquidCrystal_I2C lcd(0x27, 16, 2);");
    setupBody.push("  Wire.begin(); lcd.init(); lcd.backlight();");
    setupBody.push(`  lcd.setCursor(0, 0); lcd.print("${primaryName.slice(0, 16)}");`);
  }

  if (isI2C) {
    if (!includes.includes("#include <Wire.h>")) includes.push("#include <Wire.h>");
    wiring.push(`${primaryName} SDA -> SDA (A4)`, `${primaryName} SCL -> SCL (A5)`);
    setupBody.push("  Wire.begin();");
    loopBody.push(`  Wire.beginTransmission(0x29); // I2C Address for ${primaryName}`);
    loopBody.push("  Wire.write(0x00); Wire.endTransmission();");
    loopBody.push("  Wire.requestFrom(0x29, 2);");
    loopBody.push("  int sensorVal = 0;");
    loopBody.push("  if (Wire.available() >= 2) { sensorVal = (Wire.read() << 8) | Wire.read(); }");
    loopBody.push(`  Serial.print("TELEMETRY|${tag}_VAL:"); Serial.print(sensorVal);`);
  } else if (isSPI) {
    if (!includes.includes("#include <SPI.h>")) includes.push("#include <SPI.h>");
    wiring.push(`${primaryName} CS -> D10`, `${primaryName} MOSI -> D11`, `${primaryName} MISO -> D12`, `${primaryName} SCK -> D13`);
    defines.push("#define CS_PIN 10");
    setupBody.push("  SPI.begin(); pinMode(CS_PIN, OUTPUT); digitalWrite(CS_PIN, HIGH);");
    loopBody.push("  digitalWrite(CS_PIN, LOW); byte b1 = SPI.transfer(0x00); digitalWrite(CS_PIN, HIGH);");
    loopBody.push(`  Serial.print("TELEMETRY|${tag}_SPI:"); Serial.print(b1);`);
  } else if (isOneWire) {
    includes.push("#include <OneWire.h>");
    includes.push("#include <DallasTemperature.h>");
    wiring.push(`${primaryName} Data -> Digital D2 (4.7kΩ pull-up to 5V)`);
    defines.push("#define ONE_WIRE_BUS 2\nOneWire oneWire(ONE_WIRE_BUS);\nDallasTemperature sensors(&oneWire);");
    setupBody.push("  sensors.begin();");
    loopBody.push("  sensors.requestTemperatures(); float tempC = sensors.getTempCByIndex(0);");
    loopBody.push(`  Serial.print("TELEMETRY|${tag}_TEMP:"); Serial.print(tempC, 2); Serial.print("C");`);
  } else if (isAnalog) {
    wiring.push(`${primaryName} Signal -> Analog Pin A0`);
    defines.push("#define SENSOR_ANALOG A0");
    loopBody.push("  int rawAdc = analogRead(SENSOR_ANALOG);");
    loopBody.push("  int signalPercent = map(rawAdc, 0, 1023, 0, 100);");
    loopBody.push("  signalPercent = constrain(signalPercent, 0, 100);");
    loopBody.push(`  Serial.print("TELEMETRY|${tag}_ADC:"); Serial.print(rawAdc);`);
    loopBody.push(`  Serial.print("|PCT:"); Serial.print(signalPercent); Serial.print("%");`);
  } else {
    wiring.push(`${primaryName} Signal -> Digital Pin D2`);
    defines.push("#define SENSOR_DIGITAL 2");
    setupBody.push("  pinMode(SENSOR_DIGITAL, INPUT);");
    loopBody.push("  int sensorState = digitalRead(SENSOR_DIGITAL);");
    loopBody.push(`  Serial.print("TELEMETRY|${tag}_STATE:"); Serial.print(sensorState == HIGH ? "ACTIVE" : "IDLE");`);
  }

  if (isAnalog) {
    loopBody.push("  if (rawAdc > 500) {");
  } else {
    loopBody.push("  if (sensorState == HIGH) {");
  }

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

  let code = codeHeader;
  if (includes.length > 0) code += includes.join("\n") + "\n\n";
  if (defines.length > 0) code += defines.join("\n") + "\n\n";

  code += "void setup() {\n  Serial.begin(115200);\n";
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

export const generateCode = async (prompt) => {
  try {
    const res = await api.post("/ai/generate", { prompt });
    if (res.data && res.data.code) {
      return res.data;
    }
  } catch (err) {
    console.warn("Backend API call notice, using Deep Sensor Engine:", err.message);
  }

  return generateExactOrSynthesizedCodeFrontend(prompt);
};