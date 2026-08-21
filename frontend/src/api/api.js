import axios from "axios";

export const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    let url = import.meta.env.VITE_API_URL.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }
    return url.replace(/\/+$/, "");
  }
  
  if (typeof window !== "undefined" && window.location && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    // Direct Vercel Serverless Function Route on same origin
    return "/api";
  }
  
  return "/api";
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