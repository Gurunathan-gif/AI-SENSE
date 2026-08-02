import express from "express";
import { compileSketch, uploadSketch, detectBoard } from "../controllers/uploadController.js";

const router = express.Router();

router.get("/board", detectBoard);
router.post("/compile", compileSketch);
router.post("/upload", uploadSketch);

export default router;