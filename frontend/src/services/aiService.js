import api from "../api/api";

export function generateExactOrSynthesizedCodeFrontend(prompt) {
  const lp = prompt.toLowerCase();
  let title = "Arduino Sensor Program";
  let code = "";
  let wiring = [];
  let componentsNeeded = ["Arduino UNO Q", "Breadboard", "Jumper Wires"];

  // 1. HC-SR04 Ultrasonic Distance Sensor
  if (lp.includes("ultrasonic") || lp.includes("hc-sr04") || lp.includes("distance sonar")) {
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
  else if (lp.includes("dht") || lp.includes("dht11") || lp.includes("dht22")) {
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
  else if (lp.includes("mq") || lp.includes("mq-2") || lp.includes("mq-135") || lp.includes("smoke")) {
    title = "MQ Gas & Smoke Leak Detection Alarm";
    componentsNeeded.push("MQ Gas Sensor", "Piezo Alarm Buzzer", "Status Red LED");
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
  // 4. BMP280 Barometric Pressure & Altitude
  else if (lp.includes("bmp280") || lp.includes("bme280") || lp.includes("pressure")) {
    title = "BMP280 Barometric Pressure & Altitude Monitor";
    componentsNeeded.push("BMP280 Sensor Module", "3.3V Power Supply");
    wiring = ["BMP280 VCC -> 3.3V", "GND -> GND", "SCL -> Arduino SCL (A5)", "SDA -> Arduino SDA (A4)"];
    code = `/*
 * AI SENSE — BMP280 Barometric Pressure & Altitude Sensor
 * I2C Protocol (0x76 / 0x77)
 */

#include <Wire.h>
#include <Adafruit_BMP280.h>

Adafruit_BMP280 bmp;

void setup() {
  Serial.begin(115200);
  if (!bmp.begin(0x76)) {
    Serial.println("TELEMETRY|STATUS:BMP280_INIT_FAILED");
    while (1);
  }
}

void loop() {
  float temp = bmp.readTemperature();
  float press = bmp.readPressure() / 100.0F;
  float alt = bmp.readAltitude(1013.25);

  Serial.print("TELEMETRY|TEMP:");
  Serial.print(temp, 1);
  Serial.print("C|PRESS:");
  Serial.print(press, 1);
  Serial.print("HPA|ALT:");
  Serial.print(alt, 1);
  Serial.println("M");

  delay(1000);
}`;
  }
  // 5. Universal Heuristic Synthesizer for Any Unlisted Custom Prompt
  else {
    return synthesizeCustomSensorCodeFrontend(prompt);
  }

  return { success: true, title, prompt, code, wiring, componentsNeeded };
}

export function synthesizeCustomSensorCodeFrontend(prompt) {
  const lp = prompt.toLowerCase();
  
  const cleanWords = prompt
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !['with', 'sensor', 'code', 'using', 'make', 'create', 'arduino', 'program', 'connect', 'interface', 'circuit', 'system', 'build', 'for', 'and', 'the'].includes(w.toLowerCase()));

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
    setupBody.push("  digitalWrite(RELAY_PIN, LOW); // Relay OFF initially");
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
    wiring.push("LCD SDA -> SDA (A4)", "LCD SCL -> SCL (A5)", "LCD VCC -> 5V", "LCD GND -> GND");
    defines.push("LiquidCrystal_I2C lcd(0x27, 16, 2);");
    setupBody.push("  Wire.begin(); lcd.init(); lcd.backlight();");
    setupBody.push(`  lcd.setCursor(0, 0); lcd.print("${primaryName.slice(0, 16)}");`);
  }

  if (hasOLED) {
    includes.push("#include <Wire.h>");
    includes.push("#include <Adafruit_GFX.h>");
    includes.push("#include <Adafruit_SSD1306.h>");
    componentsNeeded.push("OLED SSD1306 Display");
    wiring.push("OLED SDA -> SDA (A4)", "OLED SCL -> SCL (A5)");
    defines.push("#define SCREEN_WIDTH 128\n#define SCREEN_HEIGHT 64\nAdafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);");
    setupBody.push("  Wire.begin();");
    setupBody.push("  if (display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {");
    setupBody.push("    display.clearDisplay(); display.setTextSize(1); display.setTextColor(SSD1306_WHITE);");
    setupBody.push(`    display.setCursor(0, 0); display.println("${primaryName.slice(0, 20)}"); display.display();`);
    setupBody.push("  }");
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

  if (hasLCD && !hasOLED) {
    loopBody.push("  lcd.setCursor(0, 1); lcd.print(\"Val: \");");
    if (isAnalog) loopBody.push("  lcd.print(rawAdc); lcd.print(\"    \");");
    else loopBody.push("  lcd.print(sensorState == HIGH ? \"ACTIVE\" : \"IDLE  \");");
  }

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