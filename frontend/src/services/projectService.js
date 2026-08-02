import api from "../api/api";

export const saveProject = async (project) => {
  const res = await api.post("/projects", project);
  return res.data;
};

export const getProjects = async () => {
  const res = await api.get("/projects");
  return res.data;
};

export const deleteProject = async (id) => {
  const res = await api.delete(`/projects/${id}`);
  return res.data;
};