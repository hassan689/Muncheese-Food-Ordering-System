import api from './api'

export const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post('/api/orders', orderData)
    return response.data
  },

  getOrders: async () => {
    const response = await api.get('/api/orders')
    return response.data
  },

  getOrderById: async (orderId) => {
    const response = await api.get(`/api/orders/${orderId}`)
    return response.data
  },

  updateOrder: async (orderId, data) => {
    const response = await api.put(`/api/orders/${orderId}`, data)
    return response.data
  },

  deleteOrder: async (orderId) => {
    const response = await api.delete(`/api/orders/${orderId}`)
    return response.data
  },
}

