import express from "express";
import auth from "../middleware/authMiddleware.js";
import { saveProject, getProjects, deleteProject } from "../controllers/projectController.js";

const router = express.Router();

router.post("/", auth, saveProject);
router.get("/", auth, getProjects);
router.delete("/:id", auth, deleteProject);

export default router;