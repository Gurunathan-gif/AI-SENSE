import { generateResponse } from "../services/geminiService.js";

export const chat = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const result = await generateResponse(prompt);

    if (typeof result === "object") {
      return res.json({
        success: true,
        ...result,
      });
    }

    res.json({
      success: true,
      code: result,
      wiring: [],
      componentsNeeded: [],
      title: "Arduino Generated Program",
    });
  } catch (err) {
    console.error("AI Controller Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};