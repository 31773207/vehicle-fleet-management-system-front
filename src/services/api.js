import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Keep ONLY ONE request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('🔑 Sending token:', token ? 'Yes' : 'No');
    console.log('📡 Request URL:', config.url);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    let errorMessage = 'An unexpected error occurred';
    if (error.response?.data) {
      errorMessage = error.response.data.message || 
                    error.response.data.error || 
                    error.response.data.detail || 
                    error.response.data.title ||
                    JSON.stringify(error.response.data);
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    const stringError = new Error(errorMessage);
    stringError.status = error.response?.status;
    stringError.response = error.response;
    return Promise.reject(stringError);
  }
);

export default api;
