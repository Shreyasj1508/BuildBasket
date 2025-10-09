import axios from "axios";

const local = 'http://localhost:5000'
const production = process.env.REACT_APP_API_URL || 'https://backend-psi-livid-66.vercel.app/api'

const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? production : `${local}/api`,
    withCredentials: true,
    timeout: 10000
})

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('customerToken')
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
            localStorage.removeItem('customerToken')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api