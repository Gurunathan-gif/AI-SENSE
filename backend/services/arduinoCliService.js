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

// Safely compile sketch in a temporary directory and return compiled .hex / .bin binary
export function compileSketch({ code, fqbn = "arduino:avr:uno" }) {
  return new Promise((resolve) => {
    const cleanFqbn = sanitizeInput(fqbn) || "arduino:avr:uno";
    const uniqueId = crypto.randomBytes(8).toString("hex");
    const tempDir = path.join(os.tmpdir(), `aisense_sketch_${uniqueId}`);
    const sketchName = `aisense_sketch_${uniqueId}`;

    try {
      fs.mkdirSync(tempDir, { recursive: true });
      const sketchFile = path.join(tempDir, `${sketchName}.ino`);
      fs.writeFileSync(sketchFile, code || "// empty sketch");

      // Secure execFile compilation with output directory to extract .hex / .bin binary
      execFile("arduino-cli", ["compile", "--fqbn", cleanFqbn, "--output-dir", tempDir, tempDir], (err, stdout, stderr) => {
        let hexContent = "";
        let hexFileName = "";

        try {
          const files = fs.readdirSync(tempDir);
          const hexFile = files.find(f => f.endsWith(".hex") || f.endsWith(".bin"));
          if (hexFile) {
            hexFileName = hexFile;
            hexContent = fs.readFileSync(path.join(tempDir, hexFile), "utf-8");
          }
        } catch (e) {
          console.warn("Binary read error:", e.message);
        }

        // Cleanup temp folder
        try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}

        if (err) {
          resolve({
            success: false,
            fqbn: cleanFqbn,
            output: stderr || stdout || err.message,
            error: "Compilation Failed"
          });
        } else {
          resolve({
            success: true,
            fqbn: cleanFqbn,
            hex: hexContent,
            hexFileName,
            output: stdout || "Sketch compiled successfully into Intel HEX binary!",
          });
        }
      });
    } catch (err) {
      resolve({
        success: false,
        error: "Failed to initialize compilation directory: " + err.message
      });
    }
  });
}

// Safely upload compiled sketch to target port
export function uploadSketch({ code, fqbn = "arduino:avr:uno", port = "COM3" }) {
  return new Promise((resolve) => {
    const cleanFqbn = sanitizeInput(fqbn) || "arduino:avr:uno";
    const cleanPort = sanitizeInput(port) || "COM3";
    const uniqueId = crypto.randomBytes(8).toString("hex");
    const tempDir = path.join(os.tmpdir(), `aisense_sketch_${uniqueId}`);
    const sketchName = `aisense_sketch_${uniqueId}`;

    try {
      fs.mkdirSync(tempDir, { recursive: true });
      const sketchFile = path.join(tempDir, `${sketchName}.ino`);
      fs.writeFileSync(sketchFile, code || "// empty sketch");

      execFile("arduino-cli", ["upload", "-p", cleanPort, "--fqbn", cleanFqbn, tempDir], (err, stdout, stderr) => {
        try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}

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
        error: "Failed to initialize upload directory: " + err.message
      });
    }
  });
}
