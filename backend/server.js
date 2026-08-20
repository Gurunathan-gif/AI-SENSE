import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import hardwareRoutes from "./routes/hardwareRoutes.js";

dotenv.config();

const app = express();

// Connect MongoDB safely
connectDB();

// 1. ABSOLUTE FIRST MIDDLEWARE: Top-Level CORS Policy (Zero Redirects on OPTIONS)
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));

// 2. Explicitly handle preflight OPTIONS check with immediate 200 OK (NO Redirects)
app.options('*', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  return res.status(200).end();
});

// 3. Header Interceptor for all incoming requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

// 4. Server Root & Health Check Routes (Handles trailing & non-trailing slashes without redirect)
app.get(["/", "/api", "/api/", "/status", "/api/status", "/api/status/"], (req, res) => {
  res.json({ status: "compiler online", success: true, message: "AI SENSE Backend Running Cleanly on Render..." });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/hardware", hardwareRoutes);

// Direct compile route alias handler matching all path variations (Trailing & Non-Trailing)
app.post([
  "/api/hardware/compile", 
  "/api/hardware/compile/", 
  "/api/compile", 
  "/api/compile/", 
  "/compile", 
  "/compile/"
], (req, res, next) => {
  req.url = "/compile";
  return hardwareRoutes(req, res, next);
});

// 5. Crash-Proof Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Backend Exception:", err.stack || err.message);
  res.header("Access-Control-Allow-Origin", "*");
  res.status(500).json({ error: "Internal Server Error Triggered Safely", message: err.message });
});

// 404 Handler with CORS headers preserved (NO Redirects)
app.use((req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.status(404).json({ error: "Route Not Found" });
});

const PORT = parseInt(process.env.PORT, 10) || 10000;
app.listen(PORT, () => console.log(`Compiler Backend running on port ${PORT}`));
