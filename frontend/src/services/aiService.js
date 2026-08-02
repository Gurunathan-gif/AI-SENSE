import api from "../api/api";

export const generateCode = async (prompt) => {
  const res = await api.post("/ai/generate", {
    prompt,
  });

  return res.data;
};