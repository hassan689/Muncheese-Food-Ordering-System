import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // If data is FormData, let axios set Content-Type automatically (with boundary)
    // Otherwise, use application/json
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json'
    } else {
      // Remove Content-Type header for FormData - axios will set it with boundary
      delete config.headers['Content-Type']
    }
    
    // Add admin token if available (for admin routes)
    const adminToken = localStorage.getItem('adminToken')
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`
    }
    
    // Add user_id header for admin routes and product routes (required by admin middleware)
    const adminUserId = localStorage.getItem('adminUserId')
    if (adminUserId && config.url && (config.url.includes('/admin') || config.url.includes('/products'))) {
      config.headers['user-id'] = adminUserId
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
      // Only redirect to login if accessing admin routes
      const currentPath = window.location.pathname
      if (currentPath.startsWith('/admin')) {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

