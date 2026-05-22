import axios from "axios";

const defaultBaseURL = "http://localhost:8080/api";
const rawBaseURL = import.meta.env.VITE_API_BASE_URL || defaultBaseURL;

const baseURL = rawBaseURL.replace(/\/$/, "");

const apiClient = axios.create({
  baseURL,
});

// Request interceptor to automatically add Authorization header
apiClient.interceptors.request.use(
  (config) => {
    // Try to get token from both possible locations
    const token =
      localStorage.getItem("auth.token") || localStorage.getItem("token");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export function setAuthToken(token) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
}

export default apiClient;
