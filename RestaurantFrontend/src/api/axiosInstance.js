import axios from 'axios';

/**
 * Axios instance configured for the application's API.
 */
const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Adds the Authorization header with JWT token (if available).
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Handles API response and error transformation into readable messages.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = getErrorMessage(error);
    return Promise.reject(new Error(message));
  }
);

/**
 * Extracts a user-friendly message from Axios error objects.
 *
 * @param {object} error - Axios error object
 * @returns {string} Readable error message
 */
function getErrorMessage(error) {
  if (error.response) {
    const { data, status } = error.response;

    if (Array.isArray(data?.messages)) return data.messages.join(', ');
    if (data?.message) return data.message;

    return `Request failed with status ${status}`;
  }

  if (error.request) {
    return 'No response from server. Please check your internet connection.';
  }

  return error.message || 'An unexpected error occurred.';
}

export default api;
