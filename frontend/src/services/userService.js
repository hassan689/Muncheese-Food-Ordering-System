import api from './api'

export const userService = {
  register: async (userData) => {
    const response = await api.post('/api/customers/register', userData)
    return response.data
  },

  login: async (credentials) => {
    const response = await api.post('/api/login', credentials)
    return response.data
  },

  adminLogin: async (username, password) => {
    const response = await api.post('/api/admin/login', { username, password })
    return response.data
  },

  getAllCustomers: async () => {
    const response = await api.get('/api/customers')
    return response.data
  },

  getAllPhones: async () => {
    const response = await api.get('/api/admin/phones')
    return response.data
  },

  updateCustomer: async (customerId, data) => {
    const response = await api.put(`/api/admin/${customerId}`, data)
    return response.data
  },
}

