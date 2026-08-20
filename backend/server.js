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

// 1. ABSOLUTE TOP OF MIDDLEWARE CHAIN: Universal Cors Configuration
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));

// 2. Explicitly handle all preflight OPTIONS checks immediately
app.options('*', cors());

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

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/hardware", hardwareRoutes);

// Direct compile route alias handler (/api/hardware/compile and /api/compile)
app.post(["/api/hardware/compile", "/api/compile", "/compile"], (req, res, next) => {
  req.url = "/compile";
  return hardwareRoutes(req, res, next);
});

// Health Check Routes (Root, /api, /api/, and wildcard /api/* fallback)
app.get(["/", "/api", "/api/", "/status"], (req, res) => {
  res.status(200).json({
    status: "api server online",
    success: true,
    message: "AI SENSE Backend Compiler Online",
    timestamp: new Date().toISOString()
  });
});

// 5. Crash-Proof Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Backend Exception:", err.stack || err.message);
  res.header("Access-Control-Allow-Origin", "*");
  res.status(500).json({ error: "Internal Server Error Triggered Safely", message: err.message });
});

// 404 Handler with CORS headers preserved
app.use((req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.status(404).json({ error: "Route Not Found", path: req.url });
});

const PORT = parseInt(process.env.PORT, 10) || 10000;
app.listen(PORT, () => console.log(`Compiler Backend running on port ${PORT}`));
