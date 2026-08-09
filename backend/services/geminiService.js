import { generateExactOrSynthesizedCodeFrontend } from "../../frontend/src/services/aiService.js";

// Advanced Hardware Module Engine & Universal Synthesizer
export function generateExactOrSynthesizedCode(prompt, boardTarget = "Arduino UNO Q") {
  return generateExactOrSynthesizedCodeFrontend(prompt, boardTarget);
}

export async function generateResponse(prompt, boardTarget = "Arduino UNO Q") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey.trim() !== "") {
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(
        `You are AI SENSE, an expert AI embedded systems engineer specializing in ${boardTarget} Single Board Computer (Qualcomm Dragonwing QRB2210 Quad-Core + STM32U585 ARM Cortex-M33 Dual Architecture).
Generate EXACT, fully working, compilable Arduino C++ code and circuit wiring for ANY user prompt: "${prompt}".
Respond ONLY with a valid JSON object:
{
  "title": "Descriptive Title for User's Prompt",
  "componentsNeeded": ["Component 1", "Component 2"],
  "wiring": ["Wire instruction 1", "Wire instruction 2"],
  "code": "// Compilable Arduino C++ code with Serial.print TELEMETRY|...",
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
        title: parsed.title || `${boardTarget} Program`,
        code: parsed.code,
        wiring: parsed.wiring || [],
        componentsNeeded: parsed.componentsNeeded || []
      };
    } catch (err) {
      console.warn("Gemini API call notice, using Deep Sensor Engine:", err.message);
    }
  }

  return generateExactOrSynthesizedCode(prompt, boardTarget);
}