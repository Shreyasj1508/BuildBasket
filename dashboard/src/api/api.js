import axios from "axios";

// Local development only
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
    timeout: 10000
})

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Check if this is a logout request to avoid conflicts
            const isLogoutRequest = error.config?.url?.includes('/logout')
            
            if (!isLogoutRequest) {
                localStorage.removeItem('accessToken')
                // Use replace to avoid adding to history
                window.location.replace('/login')
            }
        }
        return Promise.reject(error)
    }
)

export default api