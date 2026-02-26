import axios from "axios";

const configuredBaseURL = import.meta.env.VITE_API_URL?.trim();

const api = axios.create({
  baseURL: configuredBaseURL || "http://localhost:5000/api",
});

// Attach token automatically
api.interceptors.request.use((config) => {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    localStorage.removeItem("user");
  }

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

export default api;
