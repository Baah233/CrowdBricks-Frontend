import axios from "axios";

const api = axios.create({
  baseURL: "http://crowdbricks-backend.test/api/v1", // Laravel backend API prefix
  withCredentials: true, // allow cookies for Sanctum if needed
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
