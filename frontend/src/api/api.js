import axios from "axios";

// 100% Pure Localhost Base API URL Engine (Port 10000)
export const getBaseURL = () => {
  return "http://localhost:10000/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default api;