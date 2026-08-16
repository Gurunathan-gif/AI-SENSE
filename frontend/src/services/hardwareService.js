import api from "../api/api.js";

// Check if Arduino CLI is active on backend
export async function getHardwareStatus() {
  try {
    const res = await api.get("/hardware/status");
    return res.data;
  } catch (err) {
    return { success: false, arduinoCli: { available: false } };
  }
}

// Fetch connected hardware ports/boards via Arduino CLI
export async function fetchConnectedBoards() {
  try {
    const res = await api.get("/hardware/boards");
    return res.data;
  } catch (err) {
    return { success: false, available: false, boards: [] };
  }
}

// Compile C++ code via Arduino CLI endpoint
export async function compileHardwareSketch(code, fqbn = "arduino:avr:uno") {
  try {
    const res = await api.post("/hardware/compile", { code, fqbn });
    return res.data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || err.message
    };
  }
}

// Flash compiled binary to board via Arduino CLI endpoint
export async function uploadHardwareSketch(code, fqbn = "arduino:avr:uno", port = "COM3") {
  try {
    const res = await api.post("/hardware/upload", { code, fqbn, port });
    return res.data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || err.message
    };
  }
}
