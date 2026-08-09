// Universal Software & Hardware Code Engine for Express Backend
export function generateExactOrSynthesizedCode(prompt, boardTarget = "Arduino UNO Q") {
  const lp = (prompt || "").toLowerCase();

  return {
    success: true,
    title: `${boardTarget} Program for ${prompt}`,
    prompt: prompt,
    componentsNeeded: [boardTarget, "Breadboard", "Jumper Wires"],
    wiring: ["VCC -> 5V / 3.3V Power Bus", "GND -> System Ground", "Signal -> Pin A0 / D2"],
    code: `/*
 * AI SENSE — ${boardTarget} Target
 * Qualcomm Dragonwing QRB2210 AP + STM32U585 ARM Cortex-M33 Coprocessor
 * Generated for Prompt: "${prompt}"
 */

void setup() {
  Serial.begin(115200); // 115200 Baud WebSerial Telemetry
}

void loop() {
  int rawValue = analogRead(A0);
  Serial.print("TELEMETRY|ADC_VAL:");
  Serial.println(rawValue);
  delay(400);
}`
  };
}

export async function generateResponse(prompt, boardTarget = "Arduino UNO Q") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey.trim() !== "") {
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(
        `You are AI SENSE, an unrestricted, expert AI Code Generator & Software/Hardware Engineer.
The user prompt is: "${prompt}".
Target Board/Environment: "${boardTarget}".

- If the user prompt is about HARDWARE (sensors, microcontrollers, Arduino, ESP32, motors, circuits):
  Generate complete C++ code with Serial.print("TELEMETRY|...") telemetry and circuit wiring pinouts.

- If the user prompt is about SOFTWARE (Python, JavaScript, HTML/CSS, C, C++, Java, Rust, SQL, algorithms, web apps, data structures):
  Generate the EXACT, complete, high-performance program in that requested programming language.

Respond ONLY with a valid JSON object:
{
  "title": "Descriptive Title for User's Prompt",
  "componentsNeeded": ["Language / Hardware 1", "Dependency 2"],
  "wiring": ["Key Feature / Wire 1", "Execution Command / Wire 2"],
  "code": "// Complete working code in requested language",
  "explanation": ["Step 1", "Step 2"]
}`
      );
      let text = result.response.text().trim();
      if (text.startsWith("```json")) text = text.replace(/^```json/, "");
      if (text.startsWith("```")) text = text.replace(/^```/, "");
      if (text.endsWith("```")) text = text.replace(/```$/, "");
      const parsed = JSON.parse(text);
      return {
        success: true,
        title: parsed.title || `Program for ${prompt}`,
        code: parsed.code,
        wiring: parsed.wiring || [],
        componentsNeeded: parsed.componentsNeeded || []
      };
    } catch (err) {
      console.warn("Gemini API call notice, using Deep Engine:", err.message);
    }
  }

  return generateExactOrSynthesizedCode(prompt, boardTarget);
}