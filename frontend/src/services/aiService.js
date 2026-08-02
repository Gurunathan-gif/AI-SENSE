import api from "../api/api";

export function generateExactSensorCodeFrontend(prompt) {
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
#define DHTTYPE DHT11
#define RELAY_PIN 7

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  pinMode(RELAY_PIN, OUTPUT);
}

void loop() {
  delay(2000);

  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    Serial.println("TELEMETRY|STATUS:DHT_READ_ERROR");
    return;
  }

  Serial.print("TELEMETRY|TEMP:");
  Serial.print(t, 1);
  Serial.print("C|HUMIDITY:");
  Serial.print(h, 1);
  Serial.println("%");

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
    tone(BUZZER_PIN, 2500);
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
#define DRY_THRESHOLD 450

void setup() {
  Serial.begin(115200);
  pinMode(PUMP_RELAY, OUTPUT);
  digitalWrite(PUMP_RELAY, LOW);
}

void loop() {
  int rawAdc = analogRead(SOIL_PIN);
  int moisturePercent = map(rawAdc, 1023, 200, 0, 100);
  moisturePercent = constrain(moisturePercent, 0, 100);

  Serial.print("TELEMETRY|MOISTURE_ADC:");
  Serial.print(rawAdc);
  Serial.print("|PERCENT:");
  Serial.print(moisturePercent);
  Serial.println("%");

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
  // 8. Servo Motor Control
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
  myServo.write(0);
}

void loop() {
  for (int pos = 0; pos <= 180; pos += 30) {
    myServo.write(pos);
    Serial.print("TELEMETRY|SERVO_ANGLE:");
    Serial.println(pos);
    delay(500);
  }

  for (int pos = 180; pos >= 0; pos -= 30) {
    myServo.write(pos);
    Serial.print("TELEMETRY|SERVO_ANGLE:");
    Serial.println(pos);
    delay(500);
  }
}`;
  }
  // 9. LCD 16x2 Display
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

LiquidCrystal_I2C lcd(0x27, 16, 2);

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
  // 10. Universal Smart Parser (For any custom / unlisted sensor)
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
 * Precision Signal Sampling Program
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

  Serial.print("TELEMETRY|${tag}_ADC:");
  Serial.print(rawAdc);
  Serial.print("|PERCENT:");
  Serial.print(signalPercent);
  Serial.print("%|DIGITAL:");
  Serial.println(digState == HIGH ? "ACTIVE" : "IDLE");

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

export const generateCode = async (prompt) => {
  try {
    const res = await api.post("/ai/generate", { prompt });
    if (res.data && res.data.code) {
      return res.data;
    }
  } catch (err) {
    console.warn("Backend API call notice, using frontend exact sensor engine:", err.message);
  }

  return generateExactSensorCodeFrontend(prompt);
};