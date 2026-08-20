import axios from "axios";

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, "");
  }
  
  if (typeof window !== "undefined" && window.location && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    // Production Render Docker Backend URL
    return "https://ai-sense-backend.onrender.com/api";
  }
  
  return "http://localhost:5000/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 60000, // 60s timeout to gracefully support Render free tier cold-start wakeups (~30-45s)
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default api;