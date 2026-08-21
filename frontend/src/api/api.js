import axios from "axios";

export const getBaseURL = () => {
  let url = import.meta.env.VITE_API_URL;
  
  if (!url || !url.trim()) {
    if (typeof window !== "undefined" && window.location && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      return "https://ai-sense-production-25f4.up.railway.app/api";
    }
    return "http://localhost:5000/api";
  }

  url = url.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  return url.replace(/\/+$/, "");
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 45000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default api;