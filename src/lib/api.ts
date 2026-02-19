import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add a request interceptor to include the token
api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
