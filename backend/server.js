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

// Universal Production CORS Middleware with Preflight OPTIONS Handling
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

app.use(express.json());

// Server Root & API Health Check Routes
app.get(["/", "/api", "/api/"], (req, res) => {
  res.json({
    success: true,
    message: "AI SENSE Backend Running Cleanly on Render..."
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/hardware", hardwareRoutes);

// Direct compile route alias handler for clean Express execution
app.use("/api/compile", (req, res, next) => {
  req.url = "/compile";
  return hardwareRoutes(req, res, next);
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
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
