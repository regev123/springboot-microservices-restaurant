import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api", // base API URL
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Unexpected error occurred";

    if (error.response) {
      const data = error.response.data;

      if (Array.isArray(data?.messages)) {
        message = data.messages.join(", ");
      } else {
        message = data?.message || `Request failed with status ${error.response.status}`;
      }
    } else if (error.request) {
      message = "No response from server. Please check your connection.";
    } else {
      message = error.message;
    }

    return Promise.reject(new Error(message));
  }
);


export default api;
