import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

const publicApi = axios.create({
    baseURL: API_URL,

});

// Add token to requests if it exists
publicApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle token refresh
publicApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await axios.post(`${API_URL}refresh/`, {
                    refresh: refreshToken,
                });
                localStorage.setItem('access_token', response.data.access);
                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                return publicApi(originalRequest);
            } catch (refreshError) {
                // Refresh failed - redirect to login
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (userData) => publicApi.post('register/', userData),
    login: (credentials) => publicApi.post('login/', credentials),
    getProfile: () => publicApi.get('profile/'),
    updateProfile: (userData) => publicApi.patch('profile/', userData),
};

export default publicApi;