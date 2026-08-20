import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";

// Sanitize FQBN and Port inputs to prevent command injection
function sanitizeInput(str) {
  if (!str || typeof str !== "string") return "";
  return str.replace(/[^a-zA-Z0-9:_\-\.\/]/g, "").trim();
}

// Check if arduino-cli is installed on system
export function checkArduinoCliAvailable() {
  return new Promise((resolve) => {
    execFile("arduino-cli", ["version"], (err, stdout) => {
      if (err) resolve({ available: false, version: null });
      else resolve({ available: true, version: stdout.trim() });
    });
  });
}

// Get connected Arduino boards via CLI
export function listConnectedBoards() {
  return new Promise((resolve) => {
    execFile("arduino-cli", ["board", "list", "--format", "json"], (err, stdout) => {
      if (err) {
        resolve({
          success: false,
          available: false,
          boards: [],
          message: "Arduino CLI is not installed or no board detected on server host."
        });
        return;
      }
      try {
        const parsed = JSON.parse(stdout);
        resolve({
          success: true,
          available: true,
          boards: parsed || []
        });
      } catch (e) {
        resolve({ success: false, available: true, boards: [], message: "Failed to parse board list." });
      }
    });
  });
}

// Safely compile sketch in container's isolated /tmp directory and return binary payload (.bin / .hex)
export function compileSketch({ code, fqbn = "arduino:zephyr:arduino_uno_q_stm32u585xx" }) {
  return new Promise((resolve) => {
    const cleanFqbn = sanitizeInput(fqbn) || "arduino:zephyr:arduino_uno_q_stm32u585xx";
    const buildId = Date.now() + "_" + crypto.randomBytes(4).toString("hex");
    
    // Target container's isolated volatile /tmp directory
    const baseTmp = os.tmpdir() || "/tmp";
    const sketchDir = path.join(baseTmp, `sketch_${buildId}`);
    const outputDir = path.join(baseTmp, `output_${buildId}`);

    try {
      fs.mkdirSync(sketchDir, { recursive: true });
      fs.mkdirSync(outputDir, { recursive: true });

      const sketchFile = path.join(sketchDir, `sketch_${buildId}.ino`);
      fs.writeFileSync(sketchFile, code || "// empty sketch");

      // Invoke Arduino CLI to compile to binary output directory using Zephyr RTOS FQBN
      const args = ["compile", "--fqbn", cleanFqbn, "--output-dir", outputDir, sketchDir];

      execFile("arduino-cli", args, (err, stdout, stderr) => {
        if (err) {
          try { fs.rmSync(sketchDir, { recursive: true, force: true }); } catch (e) {}
          try { fs.rmSync(outputDir, { recursive: true, force: true }); } catch (e) {}
          return resolve({
            success: false,
            fqbn: cleanFqbn,
            output: stderr || stdout || err.message,
            error: stderr || stdout || "Compilation Failed"
          });
        }

        let hexContent = "";
        let hexFileName = "";
        let binBase64 = "";

        try {
          const files = fs.readdirSync(outputDir);
          const binaryFile = files.find(f => f.endsWith(".bin") || f.endsWith(".hex"));
          if (binaryFile) {
            hexFileName = binaryFile;
            const fullPath = path.join(outputDir, binaryFile);
            const bufferData = fs.readFileSync(fullPath);
            hexContent = bufferData.toString("utf-8");
            binBase64 = bufferData.toString("base64");
          }
        } catch (e) {
          console.warn("Binary extraction notice:", e.message);
        }

        // Cleanup temporary folders from container memory
        try { fs.rmSync(sketchDir, { recursive: true, force: true }); } catch (e) {}
        try { fs.rmSync(outputDir, { recursive: true, force: true }); } catch (e) {}

        if (!hexContent && !binBase64) {
          return resolve({
            success: false,
            fqbn: cleanFqbn,
            output: "Compilation completed, but no .bin or .hex binary output was generated.",
            error: "No binary file generated"
          });
        }

        return resolve({
          success: true,
          fqbn: cleanFqbn,
          hex: hexContent,
          binBase64,
          hexFileName,
          output: stdout || "Sketch compiled successfully into firmware binary!",
        });
      });
    } catch (err) {
      resolve({
        success: false,
        error: "Failed to initialize container compilation directory: " + err.message
      });
    }
  });
}

// Safely upload compiled sketch to target port
export function uploadSketch({ code, fqbn = "arduino:zephyr:arduino_uno_q_stm32u585xx", port = "COM3" }) {
  return new Promise((resolve) => {
    const cleanFqbn = sanitizeInput(fqbn) || "arduino:zephyr:arduino_uno_q_stm32u585xx";
    const cleanPort = sanitizeInput(port) || "COM3";
    const buildId = Date.now() + "_" + crypto.randomBytes(4).toString("hex");
    const baseTmp = os.tmpdir() || "/tmp";
    const sketchDir = path.join(baseTmp, `sketch_${buildId}`);

    try {
      fs.mkdirSync(sketchDir, { recursive: true });
      const sketchFile = path.join(sketchDir, `sketch_${buildId}.ino`);
      fs.writeFileSync(sketchFile, code || "// empty sketch");

      execFile("arduino-cli", ["upload", "-p", cleanPort, "--fqbn", cleanFqbn, sketchDir], (err, stdout, stderr) => {
        try { fs.rmSync(sketchDir, { recursive: true, force: true }); } catch (e) {}

        if (err) {
          resolve({
            success: false,
            port: cleanPort,
            fqbn: cleanFqbn,
            output: stderr || stdout || err.message,
            error: "Upload Failed"
          });
        } else {
          resolve({
            success: true,
            port: cleanPort,
            fqbn: cleanFqbn,
            output: stdout || "Sketch uploaded successfully to " + cleanPort
          });
        }
      });
    } catch (err) {
      resolve({
        success: false,
        error: "Failed to initialize container upload directory: " + err.message
      });
    }
  });
}
