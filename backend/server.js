import express from "express";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();

// Absolute Root CORS Rules - Automatically answers browser safety preflights
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

// Strict Server Status Checks to bypass 503 Service Unavailable blocks
app.get('/', (req, res) => res.status(200).json({ status: "online", core: "arduino-cli" }));
app.get('/api', (req, res) => res.status(200).json({ status: "online" }));
app.get('/api/hardware/compile', (req, res) => res.status(200).json({ status: "ready" }));

// Main Source Compilation API Route
app.post('/api/hardware/compile', (req, res) => {
  const userCode = req.body.code;
  if (!userCode) {
    return res.status(400).json({ error: "Code content is missing" });
  }

  const buildId = Date.now();
  const sketchDir = path.join('/tmp', `sketch_${buildId}`);
  const outputDir = path.join('/tmp', `output_${buildId}`);

  try {
    fs.mkdirSync(sketchDir, { recursive: true });
    fs.writeFileSync(path.join(sketchDir, `sketch_${buildId}.ino`), userCode);

    // Target FQBN definition for compilation
    const fqbn = req.body.fqbn || "arduino:zephyr:unoq";
    const cmd = `arduino-cli compile --fqbn ${fqbn} --output-dir ${outputDir} ${sketchDir}`;

    const processThread = exec(cmd, (error, stdout, stderr) => {
      const clearMemory = () => {
        try {
          fs.rmSync(sketchDir, { recursive: true, force: true });
          fs.rmSync(outputDir, { recursive: true, force: true });
        } catch(e){}
      };

      if (error) {
        console.error("Compilation Failure Tracked Safely:", stderr || stdout);
        clearMemory();
        const compilerErrorMsg = (stderr || stdout || error.message || "").trim();
        return res.status(400).json({ 
          error: compilerErrorMsg || "Compilation error triggered inside Arduino CLI", 
          details: compilerErrorMsg 
        });
      }

      const binPath = path.join(outputDir, `sketch_${buildId}.bin`);
      if (!fs.existsSync(binPath)) {
        clearMemory();
        return res.status(500).json({ error: "Binary compiled output missing" });
      }

      res.download(binPath, 'firmware.bin', () => clearMemory());
    });

    // Block internal thread crashes from propagating to the main server loop
    processThread.on('error', (err) => {
      console.error("Internal subprocess crashed caught:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Compilation thread limits exceeded memory margins safely", details: err.message });
      }
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

// Structural routing fail-safe catcher
app.use((err, req, res, next) => {
  console.error("Global routing exception safely intercepted:", err.stack || err.message);
  res.header("Access-Control-Allow-Origin", "*");
  res.status(500).json({ error: "Server infrastructure execution context preserved" });
});

// Process Level Crash Handlers
process.on("uncaughtException", (err) => {
  console.error("Process Uncaught Exception:", err.message);
});

process.on("unhandledRejection", (reason) => {
  console.error("Process Unhandled Rejection:", reason);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => console.log(`Compiler Core Service successfully active on port ${PORT}`));
