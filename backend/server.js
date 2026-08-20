import express from "express";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();

// Absolute Top Brute-Force CORS Middleware - Bypasses all Preflight (OPTIONS) browser checks
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => res.json({ status: "online", system: "active" }));
app.get('/api', (req, res) => res.json({ status: "online", system: "api-active" }));
app.get('/api/hardware/compile', (req, res) => res.json({ status: "ready to post" }));

app.post('/api/hardware/compile', (req, res) => {
  const userCode = req.body.code;
  if (!userCode) {
    return res.status(400).json({ error: "Code field is empty" });
  }

  const buildId = Date.now();
  const sketchDir = path.join('/tmp', `sketch_${buildId}`);
  const outputDir = path.join('/tmp', `output_${buildId}`);

  try {
    fs.mkdirSync(sketchDir, { recursive: true });
    fs.writeFileSync(path.join(sketchDir, `sketch_${buildId}.ino`), userCode);

    // Arduino CLI Official Zephyr Board ID
    const fqbn = req.body.fqbn || "arduino:zephyr:arduino_uno_q";
    const cmd = `arduino-cli compile --fqbn ${fqbn} --output-dir ${outputDir} ${sketchDir}`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error("CLI Compiler Output Error:", stderr || stdout);
        try {
          fs.rmSync(sketchDir, { recursive: true, force: true });
          fs.rmSync(outputDir, { recursive: true, force: true });
        } catch (e) {}
        
        return res.status(400).json({ error: stderr || stdout || error.message });
      }

      const binPath = path.join(outputDir, `sketch_${buildId}.bin`);
      if (!fs.existsSync(binPath)) {
        try {
          fs.rmSync(sketchDir, { recursive: true, force: true });
          fs.rmSync(outputDir, { recursive: true, force: true });
        } catch (e) {}
        return res.status(500).json({ error: "Compiled file generation error" });
      }

      res.download(binPath, 'firmware.bin', () => {
        try {
          fs.rmSync(sketchDir, { recursive: true, force: true });
          fs.rmSync(outputDir, { recursive: true, force: true });
        } catch (e) {}
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Alias compile routes
app.post(['/api/compile', '/compile'], (req, res, next) => {
  req.url = '/api/hardware/compile';
  return app._router.handle(req, res, next);
});

// Global Uncaught Exception Error Catching Middleware (Prevents 502 Bad Gateway)
app.use((err, req, res, next) => {
  console.error("Global Catching Error:", err.stack || err.message);
  res.header("Access-Control-Allow-Origin", "*");
  res.status(500).json({ error: "Internal Server Protected", message: err.message });
});

// Process Level Crash Handlers
process.on("uncaughtException", (err) => {
  console.error("Process Uncaught Exception:", err.message);
});

process.on("unhandledRejection", (reason) => {
  console.error("Process Unhandled Rejection:", reason);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Compiler active on port ${PORT}`));
