import axios from 'axios';

const API_URL = 'https://agr-base.onrender.com/api/auth/';

const api = axios.create({
    baseURL: API_URL,
});

// Add token to requests if it exists
api.interceptors.request.use(
    (config) => {
        // Skip adding token for auth endpoints
        if (config.url.includes('login') || config.url.includes('register')) {
            return config;
        }

        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle token refresh - only for authenticated requests
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Don't retry auth endpoints
        if (originalRequest.url.includes('login') || originalRequest.url.includes('register')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                const response = await axios.post(`${API_URL}refresh/`, {
                    refresh: refreshToken,
                });

                localStorage.setItem('access_token', response.data.access);
                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed - clear tokens and redirect
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');

                // Only redirect if we're not already on the login page
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (userData) => api.post('register/', userData),
    login: (credentials) => api.post('login/', credentials),
    getProfile: () => api.get('profile/'),
    updateProfile: (userData) => api.patch('profile/', userData),
};

export default api;