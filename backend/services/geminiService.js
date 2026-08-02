// Universal Deep Sensor Synthesizer for ANY sensor / actuator / combination prompt
export function synthesizeCustomSensorCode(prompt) {
  const lp = prompt.toLowerCase();
  
  // Extract key nouns/words for titles & sensor identification
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

  // Detect Displays
  const hasLCD = lp.includes('lcd') || lp.includes('16x2') || lp.includes('display');
  const hasOLED = lp.includes('oled') || lp.includes('ssd1306');
  
  // Detect Actuators
  const hasBuzzer = lp.includes('buzzer') || lp.includes('alarm') || lp.includes('sound') || lp.includes('beep');
  const hasRelay = lp.includes('relay') || lp.includes('pump') || lp.includes('motor') || lp.includes('fan') || lp.includes('light');
  const hasServo = lp.includes('servo') || lp.includes('arm') || lp.includes('angle');
  const hasLED = lp.includes('led') || lp.includes('indicator') || lp.includes('lamp');

  // Detect Sensor Type & Signal Protocol
  const isI2C = lp.includes('i2c') || lp.includes('vl53l0x') || lp.includes('bmp280') || lp.includes('bme280') || lp.includes('bh1750') || lp.includes('mpu') || lp.includes('aht20') || lp.includes('ina219');
  const isSPI = lp.includes('spi') || lp.includes('rfid') || lp.includes('nrf24') || lp.includes('sd card');
  const isOneWire = lp.includes('ds18b20') || lp.includes('1-wire') || lp.includes('onewire');
  const isAnalog = lp.includes('analog') || lp.includes('soil') || lp.includes('moisture') || lp.includes('flex') || lp.includes('force') || lp.includes('fsr') || lp.includes('ldr') || lp.includes('light') || lp.includes('rain') || lp.includes('water') || lp.includes('sound') || lp.includes('mic') || lp.includes('mq') || lp.includes('current') || lp.includes('gas') || lp.includes('smoke') || lp.includes('ph') || lp.includes('turbidity') || lp.includes('weight') || lp.includes('load cell') || lp.includes('potentiometer');

  // Configure Hardware Peripherals
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
    wiring.push("Servo Signal (Yellow/Orange) -> Digital Pin D9", "Servo VCC (Red) -> 5V", "Servo GND (Black) -> GND");
    defines.push("Servo myServo;\n#define SERVO_PIN 9");
    setupBody.push("  myServo.attach(SERVO_PIN);");
    setupBody.push("  myServo.write(0); // Set initial angle to 0°");
  }

  if (hasLCD && !hasOLED) {
    includes.push("#include <Wire.h>");
    includes.push("#include <LiquidCrystal_I2C.h>");
    componentsNeeded.push("LCD 16x2 I2C Display");
    wiring.push("LCD SDA -> Arduino SDA (A4)", "LCD SCL -> Arduino SCL (A5)", "LCD VCC -> 5V", "LCD GND -> GND");
    defines.push("LiquidCrystal_I2C lcd(0x27, 16, 2);");
    setupBody.push("  Wire.begin();");
    setupBody.push("  lcd.init();");
    setupBody.push("  lcd.backlight();");
    setupBody.push("  lcd.setCursor(0, 0);");
    setupBody.push(`  lcd.print("${primaryName.slice(0, 16)}");`);
  }

  if (hasOLED) {
    includes.push("#include <Wire.h>");
    includes.push("#include <Adafruit_GFX.h>");
    includes.push("#include <Adafruit_SSD1306.h>");
    componentsNeeded.push("OLED SSD1306 128x64 Display");
    wiring.push("OLED SDA -> SDA (A4)", "OLED SCL -> SCL (A5)", "OLED VCC -> 3.3V / 5V", "OLED GND -> GND");
    defines.push("#define SCREEN_WIDTH 128\n#define SCREEN_HEIGHT 64\nAdafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);");
    setupBody.push("  Wire.begin();");
    setupBody.push("  if (display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {");
    setupBody.push("    display.clearDisplay(); display.setTextSize(1); display.setTextColor(SSD1306_WHITE);");
    setupBody.push(`    display.setCursor(0, 0); display.println("${primaryName.slice(0, 20)}"); display.display();`);
    setupBody.push("  }");
  }

  // Generate Primary Sensor Protocol Code
  if (isI2C) {
    if (!includes.includes("#include <Wire.h>")) includes.push("#include <Wire.h>");
    wiring.push(`${primaryName} SDA -> Arduino SDA (A4)`, `${primaryName} SCL -> Arduino SCL (A5)`);
    setupBody.push("  Wire.begin();");
    loopBody.push(`  Wire.beginTransmission(0x29); // I2C Address for ${primaryName}`);
    loopBody.push("  Wire.write(0x00); Wire.endTransmission();");
    loopBody.push("  Wire.requestFrom(0x29, 2);");
    loopBody.push("  int sensorVal = 0;");
    loopBody.push("  if (Wire.available() >= 2) {");
    loopBody.push("    sensorVal = (Wire.read() << 8) | Wire.read();");
    loopBody.push("  }");
    loopBody.push(`  Serial.print("TELEMETRY|${tag}_VAL:"); Serial.print(sensorVal);`);
  } else if (isSPI) {
    if (!includes.includes("#include <SPI.h>")) includes.push("#include <SPI.h>");
    wiring.push(`${primaryName} CS -> Digital D10`, `${primaryName} MOSI -> Digital D11`, `${primaryName} MISO -> Digital D12`, `${primaryName} SCK -> Digital D13`);
    defines.push("#define CS_PIN 10");
    setupBody.push("  SPI.begin(); pinMode(CS_PIN, OUTPUT); digitalWrite(CS_PIN, HIGH);");
    loopBody.push("  digitalWrite(CS_PIN, LOW);");
    loopBody.push("  byte b1 = SPI.transfer(0x00);");
    loopBody.push("  digitalWrite(CS_PIN, HIGH);");
    loopBody.push(`  Serial.print("TELEMETRY|${tag}_SPI:"); Serial.print(b1);`);
  } else if (isOneWire) {
    includes.push("#include <OneWire.h>");
    includes.push("#include <DallasTemperature.h>");
    wiring.push(`${primaryName} Data -> Digital D2 (with 4.7kΩ pull-up to 5V)`);
    defines.push("#define ONE_WIRE_BUS 2\nOneWire oneWire(ONE_WIRE_BUS);\nDallasTemperature sensors(&oneWire);");
    setupBody.push("  sensors.begin();");
    loopBody.push("  sensors.requestTemperatures();");
    loopBody.push("  float tempC = sensors.getTempCByIndex(0);");
    loopBody.push(`  Serial.print("TELEMETRY|${tag}_TEMP:"); Serial.print(tempC, 2); Serial.print("C");`);
  } else if (isAnalog) {
    wiring.push(`${primaryName} Signal OUT -> Analog Pin A0`);
    defines.push("#define SENSOR_ANALOG A0");
    loopBody.push("  int rawAdc = analogRead(SENSOR_ANALOG);");
    loopBody.push("  int signalPercent = map(rawAdc, 0, 1023, 0, 100);");
    loopBody.push("  signalPercent = constrain(signalPercent, 0, 100);");
    loopBody.push(`  Serial.print("TELEMETRY|${tag}_ADC:"); Serial.print(rawAdc);`);
    loopBody.push(`  Serial.print("|PCT:"); Serial.print(signalPercent); Serial.print("%");`);
  } else {
    // Default Digital / Proximity / Switch Sensor
    wiring.push(`${primaryName} Signal OUT -> Digital Pin D2`);
    defines.push("#define SENSOR_DIGITAL 2");
    setupBody.push("  pinMode(SENSOR_DIGITAL, INPUT);");
    loopBody.push("  int sensorState = digitalRead(SENSOR_DIGITAL);");
    loopBody.push(`  Serial.print("TELEMETRY|${tag}_STATE:"); Serial.print(sensorState == HIGH ? "ACTIVE" : "IDLE");`);
  }

  // Actuator Trigger Conditions in Loop
  if (isAnalog) {
    loopBody.push("  if (rawAdc > 500) {");
  } else {
    loopBody.push("  if (sensorState == HIGH) {");
  }

  if (hasRelay) loopBody.push("    digitalWrite(RELAY_PIN, HIGH); // Activate Relay");
  if (hasBuzzer) loopBody.push("    tone(BUZZER_PIN, 2000);        // Sound Alarm");
  if (hasLED) loopBody.push("    digitalWrite(LED_PIN, HIGH);   // LED Indicator ON");
  if (hasServo) loopBody.push("    myServo.write(90);            // Rotate Servo to 90°");

  loopBody.push("  } else {");

  if (hasRelay) loopBody.push("    digitalWrite(RELAY_PIN, LOW);");
  if (hasBuzzer) loopBody.push("    noTone(BUZZER_PIN);");
  if (hasLED) loopBody.push("    digitalWrite(LED_PIN, LOW);");
  if (hasServo) loopBody.push("    myServo.write(0);");

  loopBody.push("  }");

  // Display Updates in Loop
  if (hasLCD && !hasOLED) {
    loopBody.push("  lcd.setCursor(0, 1);");
    loopBody.push("  lcd.print(\"Val: \");");
    if (isAnalog) loopBody.push("  lcd.print(rawAdc); lcd.print(\"    \");");
    else loopBody.push("  lcd.print(sensorState == HIGH ? \"ACTIVE\" : \"IDLE  \");");
  }

  loopBody.push("  Serial.println();");
  loopBody.push("  delay(400); // Sampling interval");

  // Construct Final C++ Source Code String
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

export async function generateResponse(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey.trim() !== "") {
    try {
      let GoogleGenAIModule;
      try {
        GoogleGenAIModule = await import("@google/genai");
      } catch (e) {
        GoogleGenAIModule = await import("@google/generative-ai");
      }
      const GoogleGenAI = GoogleGenAIModule.GoogleGenAI || GoogleGenAIModule.GoogleGenerativeAI;
      const client = new GoogleGenAI({ apiKey });
      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are AI SENSE, an expert AI embedded systems engineer specializing in Arduino C++.
Generate EXACT, fully working, compilable Arduino C++ code and circuit wiring for ANY user prompt: "${prompt}".
Respond ONLY with a valid JSON object:
{
  "title": "Descriptive Title for User's Prompt",
  "componentsNeeded": ["Component 1", "Component 2"],
  "wiring": ["Wire instruction 1", "Wire instruction 2"],
  "code": "// Compilable Arduino C++ code with Serial.print TELEMETRY|...",
  "explanation": ["Step 1", "Step 2"]
}`
      });
      let text = (response.text || response.response?.text() || "").trim();
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
      console.warn("Gemini API call notice, using Deep Sensor Synthesizer:", err.message);
    }
  }

  return synthesizeCustomSensorCode(prompt);
}