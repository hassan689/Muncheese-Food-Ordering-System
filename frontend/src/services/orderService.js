import api from './api'

export const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post('/api/orders/', orderData)
    return response.data
  },

  getOrders: async (status = null) => {
    // Use admin endpoint to get all orders
    const url = status ? `/api/admin/orders?status=${status}` : '/api/admin/orders'
    const response = await api.get(url)
    return response.data
  },

  getOrderById: async (orderId) => {
    const response = await api.get(`/api/orders/${orderId}`)
    return response.data
  },

  getCustomerOrders: async (customerId) => {
    const response = await api.get(`/api/orders/customer?customer_id=${customerId}`)
    return response.data
  },

  addLocation: async (orderId, locationData) => {
    const response = await api.post(`/api/orders/${orderId}/location`, locationData)
    return response.data
  },

  makePayment: async (paymentData) => {
    const formData = new FormData()
    Object.keys(paymentData).forEach(key => {
      if (key === 'file' && paymentData[key]) {
        formData.append('file', paymentData[key])
      } else {
        formData.append(key, paymentData[key])
      }
    })
    const response = await api.post('/api/orders/payment', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  updateOrder: async (orderId, data) => {
    const response = await api.put(`/api/orders/${orderId}`, data)
    return response.data
  },

  reviewOrder: async (orderId, data) => {
    const response = await api.post(`/api/admin/orders/${orderId}/review`, data)
    return response.data
  },

  deleteOrder: async (orderId) => {
    const response = await api.delete(`/api/orders/${orderId}`)
    return response.data
  },
}

