import axios from "axios";

/**
 * Base Axios instance for HelloWorld
 * Automatically attaches JWT token
 */
const api = axios.create({
  baseURL: "http://localhost:7000/api", // Backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 * Adds Authorization token to every request if available
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Handles global errors (like token expiry)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Optional: redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
