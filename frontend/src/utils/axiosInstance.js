import axios from 'axios';
import { BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, 
    headers: {
        'Content-Type': 'application/json',
    Accept: 'application/json',
    },
});

// Add a request interceptor to include the token in headers
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// Add a response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors globally
        if (error.response && error.response.status === 401) {
            // Unauthorized access, redirect to login
            window.location.href = '/login';
        } else if (error.response.status === 500) {
            console.error('Server error:');
        } else if (error.code === 'ECONNABORTED') {
            console.error('Request timeout, please try again later.');
        }
        return Promise.reject(error);
    }
);
export default axiosInstance;