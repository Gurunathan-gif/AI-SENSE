import { generateExactOrSynthesizedCodeFrontend } from "../../frontend/src/services/aiService.js";

// Universal Software & Hardware Code Engine for Express Backend
export function generateExactOrSynthesizedCode(prompt, boardTarget = "Arduino UNO Q") {
  return generateExactOrSynthesizedCodeFrontend(prompt, boardTarget);
}

export async function generateResponse(prompt, boardTarget = "Arduino UNO Q") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey.trim() !== "") {
    // 1. New Official @google/genai SDK (Natively supports AQ. Auth Tokens with latest Google Gemini models)
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