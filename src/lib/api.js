import axios from "axios";

const api = axios.create({
  baseURL: "http://crowdbricks-backend.test/api/v1", // Laravel backend API prefix
  withCredentials: false, // allow cookies for Sanctum if needed
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
  console.log("API Request:", config.method.toUpperCase(), config.url, "Token:", token ? "Present" : "Missing");
  return config;
}, (error) => {
  console.error("API Request Error:", error);
  return Promise.reject(error);
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.config.url, response.status, response.data);
    return response;
  },
  (error) => {
    console.error("API Response Error:", error.config?.url, error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      console.warn("Unauthorized - Token might be invalid or expired");
      // Optionally redirect to login
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Support ticket functions
export const supportTicketApi = {
  submit: (data) => api.post('/support/ticket', data),
  getAll: () => api.get('/support/tickets'),
  getById: (id) => api.get(`/support/tickets/${id}`),
  reply: (id, message) => api.post(`/support/tickets/${id}/reply`, { message }),
  getUnreadCount: () => api.get('/support/unread-count'),
};

export default api;
