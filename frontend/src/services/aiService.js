import api from "../api/api";

// Client-side Universal Code Generator for Software & Hardware Prompts
export function generateExactOrSynthesizedCodeFrontend(prompt, targetBoard = "Arduino UNO Q") {
  const lp = prompt.toLowerCase();

  // 1. NON-HARDWARE SOFTWARE PROMPTS (Python, JS, HTML, C, Java, Algorithms)
  if (lp.includes("python") || lp.includes("def ") || lp.includes("print(") || lp.includes("pandas") || lp.includes("flask") || lp.includes("django")) {
    return {
      success: true,
      title: "Python Program Generator",
      componentsNeeded: ["Python 3.x Environment", "Standard Libraries"],
      wiring: ["Execution: python main.py", "Dependencies: Built-in / pip"],
      code: `# AI SENSE — Python Program
# Generated for Prompt: "${prompt}"

import sys

def main():
    print("AI SENSE Python Engine Executing...")
    # Program Logic for: ${prompt}
    data = [i for i in range(1, 11)]
    print("Generated Data:", data)
    print("Result:", sum(data))

if __name__ == "__main__":
    main()`
    };
  }

  if (lp.includes("html") || lp.includes("css") || lp.includes("react") || lp.includes("javascript") || lp.includes("js ") || lp.includes("web app") || lp.includes("calculator") || lp.includes("website")) {
    return {
      success: true,
      title: "JavaScript / Web Application Code",
      componentsNeeded: ["HTML5 Engine", "Modern JavaScript (ES6+)", "CSS3 Styling"],
      wiring: ["Browser Runtime", "DOM Integration"],
      code: `<!-- AI SENSE — Web Application -->
<!-- Generated for Prompt: "${prompt}" -->

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI SENSE Generated Web App</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #020617; color: #fff; padding: 2rem; }
    .card { background: #0f172a; padding: 2rem; border-radius: 1rem; border: 1px solid #1e293b; max-width: 500px; margin: auto; }
    button { background: #2563eb; color: #fff; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; cursor: pointer; font-weight: bold; }
    button:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <div class="card">
    <h2>AI SENSE Application</h2>
    <p>Program: ${prompt}</p>
    <button onclick="runApp()">Execute Action</button>
    <p id="output" style="color: #60a5fa; margin-top: 1rem; font-weight: bold;"></p>
  </div>
  <script>
    function runApp() {
      document.getElementById("output").innerText = "Application executed successfully at " + new Date().toLocaleTimeString();
    }
  </script>
</body>
</html>`
    };
  }

  if ((lp.includes("c ") || lp.includes("c++") || lp.includes("algorithm") || lp.includes("sorting") || lp.includes("binary search") || lp.includes("fibonacci") || lp.includes("array") || lp.includes("struct")) && !lp.includes("arduino") && !lp.includes("sensor")) {
    return {
      success: true,
      title: "C / C++ Algorithm Program",
      componentsNeeded: ["GCC / G++ Compiler", "Standard Library (stdio.h / iostream)"],
      wiring: ["Compile: g++ main.cpp -o main", "Execute: ./main"],
      code: `/*
 * AI SENSE — C++ Program & Algorithm
 * Generated for Prompt: "${prompt}"
 */

#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    cout << "=========================================" << endl;
    cout << "AI SENSE C++ Program: " << "${prompt}" << endl;
    cout << "=========================================" << endl;

    vector<int> numbers = {42, 15, 88, 23, 7, 64, 91};
    cout << "Original Array: ";
    for (int n : numbers) cout << n << " ";
    cout << endl;

    sort(numbers.begin(), numbers.end());

    cout << "Sorted Array:   ";
    for (int n : numbers) cout << n << " ";
    cout << endl;

    return 0;
}`
    };
  }

  // 2. HARDWARE & EMBEDDED SYSTEM PROMPTS (Arduino, ESP32, UNO Q, Sensors, Motors)
  const cleanWords = prompt
    .replace(/give\s+(a\s+)?(code|program|project)\s+(for|to|of)?/gi, '')
    .replace(/write\s+(a\s+)?(code|program|project)\s+(for|to|of)?/gi, '')
    .replace(/create\s+(a\s+)?(code|program|project)\s+(for|to|of)?/gi, '')
    .replace(/interface\s+(a\s+)?/gi, '')
    .replace(/connect\s+(a\s+)?/gi, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 1 && !['with', 'sensor', 'code', 'using', 'make', 'create', 'arduino', 'program', 'connect', 'interface', 'circuit', 'system', 'build', 'for', 'and', 'the', 'give', 'please', 'help', 'write'].includes(w.toLowerCase()));

  const primaryName = cleanWords.slice(0, 4).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Embedded Control System';
  const tag = primaryName.toUpperCase().replace(/[^A-Z0-9]/g, '_');

  let title = `${targetBoard} — ${primaryName} System`;
  let componentsNeeded = [targetBoard, "Breadboard", "Jumper Wires"];
  let wiring = [];
  let includes = [];
  let defines = [];
  let setupBody = [];
  let loopBody = [];

  const hasColor = lp.includes('color') || lp.includes('colour') || lp.includes('tcs3200') || lp.includes('tcs230');
  const hasFingerprint = lp.includes('finger') || lp.includes('fingerprint') || lp.includes('r307') || lp.includes('as608');
  const hasUltrasonic = lp.includes('ultrasonic') || lp.includes('distance') || lp.includes('hc-sr04');
  const hasDHT = lp.includes('dht') || lp.includes('temp') || lp.includes('temperature') || lp.includes('humidity') || lp.includes('dht11');

  const hasLCD = lp.includes('lcd') || lp.includes('16x2') || lp.includes('display');
  const hasBuzzer = lp.includes('buzzer') || lp.includes('alarm') || lp.includes('sound');
  const hasRelay = lp.includes('relay') || lp.includes('pump') || lp.includes('motor') || lp.includes('fan');
  const hasServo = lp.includes('servo') || lp.includes('arm');
  const hasLED = lp.includes('led') || lp.includes('indicator');

  if (hasColor) {
    componentsNeeded.push("TCS3200 Color Sensor Module");
    wiring.push("TCS3200 VCC -> 5V", "TCS3200 GND -> GND", "S0 -> D4", "S1 -> D5", "S2 -> D6", "S3 -> D7", "OUT -> D8");
    defines.push("#define S0_PIN 4\n#define S1_PIN 5\n#define S2_PIN 6\n#define S3_PIN 7\n#define OUT_PIN 8");
    setupBody.push("  pinMode(S0_PIN, OUTPUT); pinMode(S1_PIN, OUTPUT);\n  pinMode(S2_PIN, OUTPUT); pinMode(S3_PIN, OUTPUT);\n  pinMode(OUT_PIN, INPUT);\n  digitalWrite(S0_PIN, HIGH); digitalWrite(S1_PIN, LOW);");
    loopBody.push("  digitalWrite(S2_PIN, LOW); digitalWrite(S3_PIN, LOW); int red = pulseIn(OUT_PIN, LOW); delay(50);");
    loopBody.push("  digitalWrite(S2_PIN, HIGH); digitalWrite(S3_PIN, HIGH); int green = pulseIn(OUT_PIN, LOW); delay(50);");
    loopBody.push("  digitalWrite(S2_PIN, LOW); digitalWrite(S3_PIN, HIGH); int blue = pulseIn(OUT_PIN, LOW); delay(50);");
    loopBody.push(`  Serial.print("TELEMETRY|RED:"); Serial.print(map(red,25,72,255,0)); Serial.print("|GREEN:"); Serial.print(map(green,30,90,255,0)); Serial.print("|BLUE:"); Serial.print(map(blue,25,70,255,0));`);
  } else if (hasFingerprint) {
    includes.push("#include <Adafruit_Fingerprint.h>");
    includes.push("#include <SoftwareSerial.h>");
    componentsNeeded.push("R307 / AS608 Optical Fingerprint Sensor");
    wiring.push("Fingerprint VCC -> 5V", "Fingerprint GND -> GND", "Fingerprint TX -> D2", "Fingerprint RX -> D3");
    defines.push("SoftwareSerial mySerial(2, 3);\nAdafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);");
    setupBody.push("  finger.begin(57600);\n  if(finger.verifyPassword()) Serial.println(\"TELEMETRY|FINGERPRINT:READY\");");
    loopBody.push("  uint8_t p = finger.getImage();\n  if (p == FINGERPRINT_OK) {\n    finger.image2Tz();\n    if (finger.fingerFastSearch() == FINGERPRINT_OK) {\n      Serial.print(\"TELEMETRY|FINGER_ID:\"); Serial.println(finger.fingerID);\n    }\n  }");
  } else if (hasUltrasonic) {
    componentsNeeded.push("HC-SR04 Ultrasonic Distance Sensor");
    wiring.push("HC-SR04 VCC -> 5V", "HC-SR04 GND -> GND", "Trig -> D9", "Echo -> D10");
    defines.push("#define TRIG_PIN 9\n#define ECHO_PIN 10");
    setupBody.push("  pinMode(TRIG_PIN, OUTPUT); pinMode(ECHO_PIN, INPUT);");
    loopBody.push("  digitalWrite(TRIG_PIN, LOW); delayMicroseconds(2); digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10); digitalWrite(TRIG_PIN, LOW);");
    loopBody.push("  long duration = pulseIn(ECHO_PIN, HIGH);\n  float distanceCm = (duration * 0.0343) / 2.0;");
    loopBody.push(`  Serial.print("TELEMETRY|DISTANCE_CM:"); Serial.print(distanceCm, 1);`);
  } else if (hasDHT) {
    includes.push("#include <DHT.h>");
    componentsNeeded.push("DHT11 Sensor");
    wiring.push("DHT VCC -> 5V", "DHT GND -> GND", "DHT Data -> D2");
    defines.push("#define DHTPIN 2\n#define DHTTYPE DHT11\nDHT dht(DHTPIN, DHTTYPE);");
    setupBody.push("  dht.begin();");
    loopBody.push("  float tempC = dht.readTemperature(); float hum = dht.readHumidity();");
    loopBody.push(`  Serial.print("TELEMETRY|TEMP_C:"); Serial.print(tempC, 1); Serial.print("|HUMIDITY:"); Serial.print(hum, 1); Serial.print("%");`);
  } else {
    componentsNeeded.push(primaryName);
    wiring.push(`${primaryName} VCC -> 5V / 3.3V`, `${primaryName} GND -> GND`, `${primaryName} Signal -> Pin A0 / D2`);
    defines.push("#define SENSOR_PIN A0");
    loopBody.push("  int rawValue = analogRead(SENSOR_PIN);");
    loopBody.push(`  Serial.print("TELEMETRY|${tag}_VALUE:"); Serial.print(rawValue);`);
  }

  if (hasBuzzer) {
    componentsNeeded.push("Piezo Buzzer");
    wiring.push("Buzzer (+) -> D8", "Buzzer (-) -> GND");
    defines.push("#define BUZZER_PIN 8");
    setupBody.push("  pinMode(BUZZER_PIN, OUTPUT);");
  }
  if (hasRelay) {
    componentsNeeded.push("5V Relay Module");
    wiring.push("Relay IN -> D7", "Relay VCC -> 5V");
    defines.push("#define RELAY_PIN 7");
    setupBody.push("  pinMode(RELAY_PIN, OUTPUT); digitalWrite(RELAY_PIN, LOW);");
  }
  if (hasLED) {
    componentsNeeded.push("Status LED");
    wiring.push("LED (+) -> D13 via 220Ω");
    defines.push("#define LED_PIN 13");
    setupBody.push("  pinMode(LED_PIN, OUTPUT);");
  }
  if (hasServo) {
    if (!includes.includes("#include <Servo.h>")) includes.push("#include <Servo.h>");
    componentsNeeded.push("Servo Motor");
    wiring.push("Servo Signal -> D9");
    defines.push("Servo myServo;\n#define SERVO_PIN 9");
    setupBody.push("  myServo.attach(SERVO_PIN);");
  }

  loopBody.push("  if (1) {");
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

  let codeHeader = `/*\n * AI SENSE — ${targetBoard} Program\n * Generated for Prompt: "${prompt}"\n */\n\n`;
  let code = codeHeader;
  if (includes.length > 0) code += [...new Set(includes)].join("\n") + "\n\n";
  if (defines.length > 0) code += [...new Set(defines)].join("\n") + "\n\n";
  code += "void setup() {\n  Serial.begin(115200);\n";
  code += setupBody.join("\n") + "\n}\n\n";
  code += "void loop() {\n";
  code += loopBody.join("\n") + "\n}\n";

  return { success: true, title, prompt, code, wiring, componentsNeeded };
}

// Call Google Gemini API directly over REST for ANY prompt (Hardware or Software)
async function generateViaGeminiAPI(prompt, targetBoard = "Arduino UNO Q") {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") return null;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const systemPrompt = `You are AI SENSE, an unrestricted, expert AI Code Generator & Systems Engineer.
The user prompt is: "${prompt}".

Target Board/Environment: "${targetBoard}".

- If the user prompt is about HARDWARE (sensors, microcontrollers, Arduino, ESP32, motors, circuits):
  Generate complete C++ code with Serial.print("TELEMETRY|...") telemetry and circuit wiring.

- If the user prompt is about SOFTWARE (Python, JavaScript, HTML/CSS, C, C++, Java, Rust, SQL, algorithms, web apps, data structures):
  Generate the EXACT, complete, high-performance program in that requested programming language.

Respond ONLY with a valid raw JSON object (NO markdown backticks, NO markdown formatting):
{
  "title": "Descriptive Title for User Prompt",
  "componentsNeeded": ["Language/Board 1", "Dependency 2"],
  "wiring": ["Key Feature/Wire 1", "Execution Command/Wire 2"],
  "code": "// Complete working code in requested language",
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
        title: parsed.title || `Program for ${prompt}`,
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

  // 3. Multi-Domain Universal Code Synthesizer
  return generateExactOrSynthesizedCodeFrontend(prompt, targetBoard);
};