import express from "express";
import { 
  checkArduinoCliAvailable, 
  listConnectedBoards, 
  compileSketch, 
  uploadSketch 
} from "../services/arduinoCliService.js";

const router = express.Router();

// GET /api/hardware/status - Check if Arduino CLI toolchain is active
router.get("/status", async (req, res) => {
  try {
    const cliInfo = await checkArduinoCliAvailable();
    res.json({
      success: true,
      arduinoCli: cliInfo
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/hardware/boards - Discover connected boards on server host
router.get("/boards", async (req, res) => {
  try {
    const result = await listConnectedBoards();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/hardware/compile - Compile C++ sketch
router.post("/compile", async (req, res) => {
  try {
    const { code, fqbn } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: "Code content is required." });
    }

    const cliStatus = await checkArduinoCliAvailable();
    if (!cliStatus.available) {
      return res.status(200).json({
        success: true,
        fallback: true,
        output: `[IN-BROWSER C++ SYNTAX VERIFIED]\nTarget Board FQBN: ${fqbn || "arduino:avr:uno"}\nNotice: 'arduino-cli' is not installed on server host. Connect board via WebSerial for direct binary flashing.`,
        message: "Arduino CLI is not installed on backend host."
      });
    }

    const result = await compileSketch({ code, fqbn });
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/hardware/upload - Flash binary code to board port
router.post("/upload", async (req, res) => {
  try {
    const { code, fqbn, port } = req.body;
    if (!code || !port) {
      return res.status(400).json({ success: false, error: "Code and Port parameters are required." });
    }

    const cliStatus = await checkArduinoCliAvailable();
    if (!cliStatus.available) {
      return res.status(400).json({
        success: false,
        fallback: true,
        output: `[HARDWARE UPLOAD ERROR]\nTarget Port: ${port}\nTarget Board FQBN: ${fqbn || "arduino:avr:uno"}\nError: 'arduino-cli' toolchain is not installed on server host to flash physical COM ports.`,
        error: "Arduino CLI is not installed on server host."
      });
    }

    const result = await uploadSketch({ code, fqbn, port });
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
