import axios from "axios";

export const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, "");
  }
  
  if (typeof window !== "undefined" && window.location && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    // Exact Live Railway Production Backend URL from Dashboard
    return "https://ai-sense-production-25f4.up.railway.app/api";
  }
  
  return "http://localhost:5000/api";
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