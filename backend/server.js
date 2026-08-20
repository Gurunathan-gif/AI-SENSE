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

// Connect MongoDB
connectDB();

const ALLOWED_ORIGINS = [
  "https://ai-sense.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000"
];

// 1. ABSOLUTE TOP OF MIDDLEWARE CHAIN: Universal Cors Configuration
app.use(cors({
  origin: '*', // Allows cross-origin testing requests from any domain interface
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));

// 2. Explicitly handle all preflight OPTIONS checks
app.options('*', cors());

// 3. Manual Fallback CORS Header Interceptor
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header("Access-Control-Allow-Origin", (origin && ALLOWED_ORIGINS.includes(origin)) ? origin : "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

// 4. Prevent 404 crashes on empty base route variations (/api, /api/, /, /status)
app.get(["/", "/api", "/api/", "/api/status", "/status"], (req, res) => {
  res.json({ status: "compiler online", success: true, message: "AI SENSE Backend Running Cleanly on Render..." });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/hardware", hardwareRoutes);

// Direct compile route alias handlers for clean execution across all endpoints
app.post(["/api/compile", "/compile", "/api/hardware/compile"], (req, res, next) => {
  req.url = "/compile";
  return hardwareRoutes(req, res, next);
});

// 5. 404 Handler with CORS headers preserved
app.use((req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.status(404).json({
    status: "error",
    success: false,
    message: "Route Not Found"
  });
});

// Server with EADDRINUSE handling
const PORT = parseInt(process.env.PORT, 10) || 10000;

function startServer(portToUse) {
  const server = app.listen(portToUse, () => {
    console.log(`=================================================`);
    console.log(`🚀 AI SENSE Backend Server running on port ${portToUse}`);
    console.log(`📡 Health Check: http://localhost:${portToUse}/`);
    console.log(`🤖 AI Route: POST http://localhost:${portToUse}/api/ai/generate`);
    console.log(`⚙️ Hardware Route: POST http://localhost:${portToUse}/api/hardware/compile`);
    console.log(`=================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`\n⚠️ Port ${portToUse} is already in use.`);
      console.warn(` Attempting to start server on port ${portToUse + 1}...\n`);
      startServer(portToUse + 1);
    } else {
      console.error('Fatal Server Error:', err);
    }
  });
}

startServer(PORT);
