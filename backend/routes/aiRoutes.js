import express from "express";
import { chat } from "../controllers/aiController.js";

const router = express.Router();

router.post("/generate", chat);

export default router;