import Project from "../models/Project.js";

// Save Project
export const saveProject = async (req, res) => {
  try {
    const project = await Project.create({
      userId: req.user?.id,
      title: req.body.title,
      prompt: req.body.prompt,
      code: req.body.code,
    });
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user?.id }).sort({ createdAt: -1 });
    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Project
export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Project Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};