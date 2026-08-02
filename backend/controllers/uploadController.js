import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../Uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const sketchPath = path.join(uploadsDir, "sketch.ino");

export const detectBoard = (req, res) => {
  exec("arduino-cli board list", (err, stdout) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    res.json({ success: true, boards: stdout });
  });
};

export const compileSketch = (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ success: false, message: "Code is required" });

  fs.writeFileSync(sketchPath, code);

  exec(`arduino-cli compile --fqbn arduino:avr:uno "${uploadsDir}"`, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ success: false, message: stderr || err.message });
    }
    res.json({ success: true, message: stdout });
  });
};

export const uploadSketch = (req, res) => {
  const { port } = req.body;
  exec(`arduino-cli upload -p ${port || "COM3"} --fqbn arduino:avr:uno "${uploadsDir}"`, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ success: false, message: stderr || err.message });
    }
    res.json({ success: true, message: "Upload Successful" });
  });
};