// API Client configuration
const API_BASE_URL = "https://your-api-url.com/api";

const apiClient = {
  baseURL: API_BASE_URL,
  
  async get(endpoint) {
    // Mock implementation - replace with real API calls
    return { data: null };
  },
  
  async post(endpoint, data) {
    // Mock implementation - replace with real API calls
    return { data };
  },
  
  async put(endpoint, data) {
    // Mock implementation - replace with real API calls
    return { data };
  },
  
  async delete(endpoint) {
    // Mock implementation - replace with real API calls
    return { data: null };
  },
};

export default apiClient;