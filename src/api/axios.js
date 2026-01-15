import axios from 'axios';
import { API_BASE_URL } from '../config';

// KeyStone Service URL (Auth)
const AUTH_BASE_URL = 'http://localhost:8001/api/v1';

// Auth Client (KeyStone)
export const authClient = axios.create({
    baseURL: AUTH_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Main Client (Knowledge Capture)
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Add Token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 (Optional: Auto-logout)
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        // If 401, maybe refresh token or logout
        // For now, just reject
        if (error.response && error.response.status === 401) {
            // Check if we can refresh?
            // Implementing robust refresh logic in frontend can be complex.
            // For MVP, if access token fails, we can just logout or rely on simple expiry check.
            console.error("Unauthorized access - maybe token expired?");
        }
        return Promise.reject(error);
    }
);
