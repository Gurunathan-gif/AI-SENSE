import { GoogleGenerativeAI } from "@google/generative-ai";

// Comprehensive Intelligent Code Generator for 25+ exact sensors & custom modules
export function generateExactSensorCode(prompt) {
  const lp = prompt.toLowerCase();
  let title = "Arduino Sensor Program";
  let code = "";
  let wiring = [];
  let componentsNeeded = ["Arduino UNO Q", "Breadboard", "Jumper Wires"];

  // 1. HC-SR04 Ultrasonic Distance Sensor
  if (lp.includes("ultrasonic") || lp.includes("hc-sr04") || lp.includes("distance")) {
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
  // Transmit 10 microsecond ultrasonic pulse
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // Measure echo return time in microseconds
  long duration = pulseIn(ECHO_PIN, HIGH);
  float distanceCm = (duration * 0.0343) / 2.0;

  // Stream structured telemetry
  Serial.print("TELEMETRY|DISTANCE:");
  Serial.print(distanceCm, 1);
  Serial.println("CM");

  // Proximity alert trigger (< 15 cm)
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
  // 2. DHT11 / DHT22 Temperature & Humidity Sensor
  else if (lp.includes("dht") || lp.includes("humidity") || (lp.includes("temp") && !lp.includes("ds18b20"))) {
    title = "DHT Temperature & Humidity Environmental Control";
    componentsNeeded.push("DHT11 / DHT22 Sensor", "5V Relay Module", "10kΩ Pull-Up Resistor");
    wiring = ["DHT VCC -> 5V DC", "DHT GND -> GND", "DHT Data -> Digital D2 (with 10kΩ pull-up to 5V)", "Relay IN -> Digital D7"];
    code = `/*
 * AI SENSE — DHT Temperature & Humidity Environmental Control
 * Single-Wire Digital Protocol & Relay Trigger
 */

#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT11   // Change to DHT22 if using DHT22
#define RELAY_PIN 7

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  pinMode(RELAY_PIN, OUTPUT);
}

void loop() {
  delay(2000); // 2-second sampling rate

  float h = dht.readHumidity();
  float t = dht.readTemperature(); // Celsius

  if (isnan(h) || isnan(t)) {
    Serial.println("TELEMETRY|STATUS:DHT_READ_ERROR");
    return;
  }

  Serial.print("TELEMETRY|TEMP:");
  Serial.print(t, 1);
  Serial.print("C|HUMIDITY:");
  Serial.print(h, 1);
  Serial.println("%");

  // Climate control threshold (Fan Relay ON if Temp >= 28.0°C)
  if (t >= 28.0) {
    digitalWrite(RELAY_PIN, HIGH);
  } else {
    digitalWrite(RELAY_PIN, LOW);
  }
}`;
  }
  // 3. MQ-2 / MQ-135 Gas & Smoke Sensor
  else if (lp.includes("mq") || lp.includes("gas") || lp.includes("smoke") || lp.includes("co2") || lp.includes("air quality")) {
    title = "MQ Gas & Smoke Leak Detection Alarm";
    componentsNeeded.push("MQ-2 / MQ-135 Gas Sensor", "Piezo Alarm Buzzer", "Status Red LED");
    wiring = ["MQ VCC -> 5V (Requires 150mA Heater)", "MQ GND -> GND", "MQ AOUT -> Analog A0", "MQ DOUT -> Digital D8", "Buzzer -> Digital D9"];
    code = `/*
 * AI SENSE — MQ Gas & Smoke Detection System
 * Analog ADC Read & Digital Comparator Alert
 */

#define GAS_ANALOG A0
#define GAS_DIGITAL 8
#define BUZZER_PIN 9
#define THRESHOLD_ADC 350

void setup() {
  Serial.begin(115200);
  pinMode(GAS_DIGITAL, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
}

void loop() {
  int gasAdc = analogRead(GAS_ANALOG);
  int gasDigital = digitalRead(GAS_DIGITAL);

  Serial.print("TELEMETRY|GAS_ADC:");
  Serial.print(gasAdc);
  Serial.print("|ALERT:");
  Serial.println(gasAdc > THRESHOLD_ADC ? "WARNING_GAS_LEAK" : "NORMAL");

  if (gasAdc > THRESHOLD_ADC || gasDigital == LOW) {
    tone(BUZZER_PIN, 2500); // 2.5kHz Alarm
  } else {
    noTone(BUZZER_PIN);
  }

  delay(300);
}`;
  }
  // 4. PIR Motion Sensor (HC-SR501)
  else if (lp.includes("pir") || lp.includes("motion") || lp.includes("occupancy")) {
    title = "PIR Motion Security & Occupancy Detector";
    componentsNeeded.push("HC-SR501 PIR Motion Sensor", "Security Siren / Buzzer", "Alert LED");
    wiring = ["PIR VCC -> 5V", "PIR GND -> GND", "PIR OUT -> Digital D3", "Buzzer -> Digital D8", "LED -> Digital D13"];
    code = `/*
 * AI SENSE — HC-SR501 PIR Motion Security Detector
 * Passive Infrared Thermal Detection
 */

#define PIR_PIN 3
#define BUZZER_PIN 8
#define LED_PIN 13

void setup() {
  Serial.begin(115200);
  pinMode(PIR_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int motionState = digitalRead(PIR_PIN);

  Serial.print("TELEMETRY|MOTION:");
  Serial.println(motionState == HIGH ? "DETECTED" : "IDLE");

  if (motionState == HIGH) {
    digitalWrite(LED_PIN, HIGH);
    tone(BUZZER_PIN, 1800);
  } else {
    digitalWrite(LED_PIN, LOW);
    noTone(BUZZER_PIN);
  }

  delay(250);
}`;
  }
  // 5. Soil Moisture Sensor
  else if (lp.includes("soil") || lp.includes("moisture") || lp.includes("plant") || lp.includes("irrigation")) {
    title = "Automatic Smart Irrigation & Soil Moisture System";
    componentsNeeded.push("Soil Moisture Sensor Module", "5V Water Pump Relay", "Status Indicator LED");
    wiring = ["Soil Sensor VCC -> 5V", "Soil Sensor GND -> GND", "Soil Sensor AOUT -> Analog A0", "Relay Control -> Digital D7"];
    code = `/*
 * AI SENSE — Automatic Smart Soil Irrigation
 * Analog Capacitive/Resistive Soil Moisture Detection
 */

#define SOIL_PIN A0
#define PUMP_RELAY 7
#define DRY_THRESHOLD 450 // Higher ADC = drier soil

void setup() {
  Serial.begin(115200);
  pinMode(PUMP_RELAY, OUTPUT);
  digitalWrite(PUMP_RELAY, LOW); // Pump OFF initially
}

void loop() {
  int rawAdc = analogRead(SOIL_PIN);
  int moisturePercent = map(rawAdc, 1023, 200, 0, 100); // 100% = fully wet
  moisturePercent = constrain(moisturePercent, 0, 100);

  Serial.print("TELEMETRY|MOISTURE_ADC:");
  Serial.print(rawAdc);
  Serial.print("|PERCENT:");
  Serial.print(moisturePercent);
  Serial.println("%");

  // Auto watering pump trigger if dry
  if (rawAdc > DRY_THRESHOLD) {
    Serial.println("TELEMETRY|PUMP_STATUS:WATERING_ON");
    digitalWrite(PUMP_RELAY, HIGH);
  } else {
    digitalWrite(PUMP_RELAY, LOW);
  }

  delay(1000);
}`;
  }
  // 6. MPU-6050 Gyro + Accelerometer
  else if (lp.includes("mpu") || lp.includes("gyro") || lp.includes("accelerometer") || lp.includes("imu")) {
    title = "MPU-6050 6-Axis Motion & Tilt Tracking";
    componentsNeeded.push("MPU-6050 6-Axis IMU Module", "I2C Pull-Up Resistors");
    wiring = ["MPU-6050 VCC -> 5V / 3.3V", "MPU-6050 GND -> GND", "SCL -> Arduino SCL (A5)", "SDA -> Arduino SDA (A4)"];
    code = `/*
 * AI SENSE — MPU-6050 6-Axis Motion Tracking
 * I2C Interface (Address 0x68) Gyroscope & Accelerometer
 */

#include <Wire.h>
#include <MPU6050.h>

MPU6050 mpu;

void setup() {
  Serial.begin(115200);
  Wire.begin();
  mpu.initialize();

  if (!mpu.testConnection()) {
    Serial.println("TELEMETRY|STATUS:MPU6050_INIT_FAIL");
  }
}

void loop() {
  int16_t ax, ay, az, gx, gy, gz;
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

  // Convert raw readings to m/s² and deg/s
  float accelZ = az / 16384.0 * 9.81;

  Serial.print("TELEMETRY|AX:");
  Serial.print(ax / 16384.0, 2);
  Serial.print("|AY:");
  Serial.print(ay / 16384.0, 2);
  Serial.print("|AZ:");
  Serial.print(accelZ, 2);
  Serial.println("MS2");

  delay(200);
}`;
  }
  // 7. MAX30100 / MAX30102 Pulse Oximeter
  else if (lp.includes("max30100") || lp.includes("max30102") || lp.includes("pulse") || lp.includes("oximeter") || lp.includes("heart rate") || lp.includes("spo2")) {
    title = "MAX30100 Pulse Oximeter & Heart Rate Monitor";
    componentsNeeded.push("MAX30100 Optical PPG Sensor", "3.3V Power Regulator");
    wiring = ["MAX30100 VCC -> 3.3V DC (Do NOT connect 5V!)", "GND -> GND", "SCL -> SCL (A5)", "SDA -> SDA (A4)"];
    code = `/*
 * AI SENSE — MAX30100 Blood Oxygen & Heart Rate Monitor
 * Photoplethysmography (PPG) Photodetector
 */

#include <Wire.h>
#include "MAX30100_PulseOximeter.h"

PulseOximeter pox;

void setup() {
  Serial.begin(115200);
  if (!pox.begin()) {
    Serial.println("TELEMETRY|STATUS:MAX30100_INIT_FAILED");
    while (1);
  }
}

void loop() {
  pox.update();

  float hr = pox.getHeartRate();
  uint8_t spo2 = pox.getSpO2();

  Serial.print("TELEMETRY|HR:");
  Serial.print(hr, 1);
  Serial.print("BPM|SPO2:");
  Serial.print(spo2);
  Serial.println("%");

  delay(500);
}`;
  }
  // 8. DS18B20 Waterproof Temperature Sensor Probe
  else if (lp.includes("ds18b20") || lp.includes("waterproof temp") || lp.includes("1-wire")) {
    title = "DS18B20 Waterproof Temperature Probe Interface";
    componentsNeeded.push("DS18B20 Waterproof Probe", "4.7kΩ Pull-Up Resistor");
    wiring = ["Red Wire -> 5V VCC", "Black Wire -> GND", "Yellow Wire -> Digital D2 (with 4.7kΩ pull-up to 5V)"];
    code = `/*
 * AI SENSE — DS18B20 Waterproof Temperature Probe
 * Dallas 1-Wire Protocol
 */

#include <OneWire.h>
#include <DallasTemperature.h>

#define ONE_WIRE_BUS 2

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup() {
  Serial.begin(115200);
  sensors.begin();
}

void loop() {
  sensors.requestTemperatures();
  float tempC = sensors.getTempCByIndex(0);

  Serial.print("TELEMETRY|DS18B20_TEMP:");
  Serial.print(tempC, 2);
  Serial.println("C");

  delay(1000);
}`;
  }
  // 9. ACS712 Current Sensor
  else if (lp.includes("acs712") || lp.includes("current") || lp.includes("ampere") || lp.includes("power meter")) {
    title = "ACS712 AC/DC Current Sensor & Power Meter";
    componentsNeeded.push("ACS712 Current Sensor (5A/20A/30A)", "Load Resistor");
    wiring = ["ACS712 VCC -> 5V", "ACS712 GND -> GND", "ACS712 OUT -> Analog A0", "Terminal Block -> In series with load"];
    code = `/*
 * AI SENSE — ACS712 Current Sensor
 * Hall Effect AC/DC Current Measurement
 */

#define CURRENT_PIN A0
const float mVperAmp = 185; // 185mV/A for 5A model (100mV/A for 20A, 66mV/A for 30A)
const int ACSoffset = 2500; // 2.5V zero-current offset

void setup() {
  Serial.begin(115200);
}

void loop() {
  int rawADC = analogRead(CURRENT_PIN);
  float voltage = (rawADC / 1024.0) * 5000; // Voltage in mV
  float currentAmps = (voltage - ACSoffset) / mVperAmp;

  Serial.print("TELEMETRY|ADC:");
  Serial.print(rawADC);
  Serial.print("|CURRENT:");
  Serial.print(currentAmps, 2);
  Serial.println("A");

  delay(500);
}`;
  }
  // 10. GPS NEO-6M Module
  else if (lp.includes("gps") || lp.includes("neo-6m") || lp.includes("location") || lp.includes("latitude")) {
    title = "NEO-6M GPS Position & Navigation Tracker";
    componentsNeeded.push("GY-NEO6MV2 GPS Module", "External Patch Antenna");
    wiring = ["GPS VCC -> 5V / 3.3V", "GPS GND -> GND", "GPS TX -> Digital D4 (SoftwareSerial RX)", "GPS RX -> Digital D3 (SoftwareSerial TX)"];
    code = `/*
 * AI SENSE — NEO-6M GPS Positioning Tracker
 * NMEA Sentence Serial Decoder
 */

#include <SoftwareSerial.h>
#include <TinyGPS++.h>

SoftwareSerial gpsSerial(4, 3); // RX=D4, TX=D3
TinyGPSPlus gps;

void setup() {
  Serial.begin(115200);
  gpsSerial.begin(9600);
}

void loop() {
  while (gpsSerial.available() > 0) {
    gps.encode(gpsSerial.read());
    if (gps.location.isUpdated()) {
      Serial.print("TELEMETRY|LAT:");
      Serial.print(gps.location.lat(), 6);
      Serial.print("|LNG:");
      Serial.print(gps.location.lng(), 6);
      Serial.print("|ALT:");
      Serial.print(gps.altitude.meters(), 1);
      Serial.println("M");
    }
  }
}`;
  }
  // 11. Servo Motor Control
  else if (lp.includes("servo") || lp.includes("sg90") || lp.includes("mg996r") || lp.includes("arm")) {
    title = "Servo Motor Angular Position Controller";
    componentsNeeded.push("SG90 / MG996R Servo Motor", "External 5V Power Supply");
    wiring = ["Servo Brown/Black -> GND", "Servo Red -> 5V", "Servo Orange/Yellow Signal -> Digital D9"];
    code = `/*
 * AI SENSE — Servo Motor PWM Controller
 * 0° to 180° Angular Sweep
 */

#include <Servo.h>

Servo myServo;
#define SERVO_PIN 9

void setup() {
  Serial.begin(115200);
  myServo.attach(SERVO_PIN);
  myServo.write(0); // Start at 0 degrees
}

void loop() {
  // Sweep from 0 to 180 degrees
  for (int pos = 0; pos <= 180; pos += 30) {
    myServo.write(pos);
    Serial.print("TELEMETRY|SERVO_ANGLE:");
    Serial.println(pos);
    delay(500);
  }

  // Sweep back from 180 to 0 degrees
  for (int pos = 180; pos >= 0; pos -= 30) {
    myServo.write(pos);
    Serial.print("TELEMETRY|SERVO_ANGLE:");
    Serial.println(pos);
    delay(500);
  }
}`;
  }
  // 12. LCD 16x2 Display
  else if (lp.includes("lcd") || lp.includes("16x2") || lp.includes("display")) {
    title = "LCD 16x2 I2C Screen Interface";
    componentsNeeded.push("LCD 16x2 Display with PCF8574 I2C Adapter");
    wiring = ["LCD VCC -> 5V", "LCD GND -> GND", "SDA -> Arduino SDA (A4)", "SCL -> Arduino SCL (A5)"];
    code = `/*
 * AI SENSE — LCD 16x2 I2C Display Interface
 * Address 0x27 or 0x3F PCF8574
 */

#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2); // Change address to 0x3F if blank

void setup() {
  Serial.begin(115200);
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("AI SENSE PLATFORM");
  lcd.setCursor(0, 1);
  lcd.print("SYSTEM READY...");
}

void loop() {
  static int counter = 0;
  counter++;

  lcd.setCursor(0, 1);
  lcd.print("Uptime: ");
  lcd.print(counter);
  lcd.print("s   ");

  Serial.print("TELEMETRY|UPTIME:");
  Serial.println(counter);

  delay(1000);
}`;
  }
  // 13. OLED SSD1306 Display
  else if (lp.includes("oled") || lp.includes("ssd1306")) {
    title = "OLED SSD1306 128x64 Graphics Display";
    componentsNeeded.push("OLED SSD1306 0.96 inch I2C Display");
    wiring = ["OLED VCC -> 3.3V / 5V", "OLED GND -> GND", "SCL -> SCL (A5)", "SDA -> SDA (A4)"];
    code = `/*
 * AI SENSE — OLED SSD1306 128x64 Graphics Interface
 * Adafruit SSD1306 I2C Driver
 */

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

void setup() {
  Serial.begin(115200);
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("TELEMETRY|OLED:INIT_FAIL");
    while (1);
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(10, 10);
  display.println("AI SENSE HARDWARE");
  display.display();
}

void loop() {
  static int count = 0;
  count++;

  display.clearDisplay();
  display.setCursor(0, 0);
  display.setTextSize(2);
  display.println("AI SENSE");
  display.setTextSize(1);
  display.print("Count: ");
  display.println(count);
  display.display();

  Serial.print("TELEMETRY|OLED_COUNT:");
  Serial.println(count);

  delay(1000);
}`;
  }
  // 14. RFID RC522 Card Reader
  else if (lp.includes("rfid") || lp.includes("mfrc522") || lp.includes("card") || lp.includes("door lock")) {
    title = "RC522 RFID Access Control & Door Lock";
    componentsNeeded.push("MFRC522 RFID Reader Module", "5V Relay Door Lock Solenoid");
    wiring = ["RFID VCC -> 3.3V (STRICT)", "GND -> GND", "RST -> D9", "SDA/SS -> D10", "MOSI -> D11", "MISO -> D12", "SCK -> D13", "Relay -> D7"];
    code = `/*
 * AI SENSE — MFRC522 RFID Card Access Control
 * SPI Protocol UID Security Match
 */

#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 10
#define RST_PIN 9
#define LOCK_RELAY 7

MFRC522 rfid(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(115200);
  SPI.begin();
  rfid.PCD_Init();
  pinMode(LOCK_RELAY, OUTPUT);
  digitalWrite(LOCK_RELAY, LOW);
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;

  String uid = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    uid += String(rfid.uid.uidByte[i] < 0x10 ? "0" : "");
    uid += String(rfid.uid.uidByte[i], HEX);
  }
  uid.toUpperCase();

  Serial.print("TELEMETRY|RFID_UID:");
  Serial.println(uid);

  // Example authorized tag UID match
  if (uid == "A1B2C3D4") {
    Serial.println("TELEMETRY|ACCESS:GRANTED");
    digitalWrite(LOCK_RELAY, HIGH);
    delay(3000);
    digitalWrite(LOCK_RELAY, LOW);
  } else {
    Serial.println("TELEMETRY|ACCESS:DENIED");
  }

  rfid.PICC_HaltA();
}`;
  }
  // 15. Universal Sensor Smart Parser (For any unlisted / custom sensor)
  else {
    const words = prompt.split(' ').filter(w => w.length > 2 && !['with', 'sensor', 'code', 'using', 'make', 'create', 'arduino'].includes(w.toLowerCase()));
    const sensorName = words.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Custom Sensor Module';
    const tag = sensorName.toUpperCase().replace(/[^A-Z0-9]/g, '_');

    title = `Exact Arduino Interface for ${sensorName}`;
    componentsNeeded.push(sensorName, "Status Indicator LED", "220Ω Protection Resistor");
    wiring = [
      `${sensorName} VCC -> 5V / 3.3V DC Power`,
      `${sensorName} GND -> Arduino GND Ground`,
      `${sensorName} Signal OUT -> Analog Pin A0 (or Digital D2)`,
      `Status LED -> Digital Pin D13`
    ];

    code = `/*
 * AI SENSE — ${sensorName} Custom Interface
 * Optimized Precision Signal Sampling Program
 */

#define SENSOR_ANALOG A0
#define SENSOR_DIGITAL 2
#define LED_PIN 13

void setup() {
  Serial.begin(115200);
  pinMode(SENSOR_DIGITAL, INPUT);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int rawAdc = analogRead(SENSOR_ANALOG);
  int digState = digitalRead(SENSOR_DIGITAL);
  int signalPercent = map(rawAdc, 0, 1023, 0, 100);

  // Stream structured real-time telemetry output
  Serial.print("TELEMETRY|${tag}_ADC:");
  Serial.print(rawAdc);
  Serial.print("|PERCENT:");
  Serial.print(signalPercent);
  Serial.print("%|DIGITAL:");
  Serial.println(digState == HIGH ? "ACTIVE" : "IDLE");

  // Output indicator logic
  if (rawAdc > 500 || digState == HIGH) {
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }

  delay(400);
}`;
  }

  return { success: true, title, prompt, code, wiring, componentsNeeded };
}

export async function generateResponse(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey.trim() !== "") {
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const client = new GoogleGenerativeAI(apiKey);
      const model = client.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      const systemPrompt = `You are AI SENSE, an expert AI embedded systems engineer specializing in Arduino C++.
Generate EXACT, fully working, compilable Arduino C++ code and circuit wiring for prompt: "${prompt}".
Respond ONLY with a valid JSON object:
{
  "title": "Exact Sensor Title",
  "componentsNeeded": ["Component 1", "Component 2"],
  "wiring": ["Wire instruction 1", "Wire instruction 2"],
  "code": "// Compilable Arduino C++ code with Serial.print TELEMETRY|...",
  "explanation": ["Step 1", "Step 2"]
}`;
      const result = await model.generateContent(systemPrompt);
      let text = result.response.text().trim();
      if (text.startsWith("```json")) text = text.replace(/^```json/, "");
      if (text.startsWith("```")) text = text.replace(/^```/, "");
      if (text.endsWith("```")) text = text.replace(/```$/, "");
      const parsed = JSON.parse(text);
      return {
        success: true,
        title: parsed.title || "Arduino Generated Program",
        code: parsed.code,
        wiring: parsed.wiring || [],
        componentsNeeded: parsed.componentsNeeded || []
      };
    } catch (err) {
      console.warn("Gemini API call notice, using Exact Intelligent Sensor Engine:", err.message);
    }
  }

  return generateExactSensorCode(prompt);
}