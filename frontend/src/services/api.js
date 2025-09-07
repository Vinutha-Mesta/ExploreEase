import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => api.post('/login', { email, password }),
  register: (userData) => api.post('/register', userData),
};

export const itineraryAPI = {
  generate: (data) => api.post('/generate-itinerary', data),
};

export default api; 
