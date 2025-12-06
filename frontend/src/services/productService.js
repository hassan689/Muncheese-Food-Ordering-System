import api from './api'

export const productService = {
  // Get all product items
  getProductItems: async () => {
    const response = await api.get('/api/products/items')
    return response.data
  },

  // Get items by category
  getItemsByCategory: async (category) => {
    const response = await api.get(`/api/products/items/category?category=${category}`)
    return response.data
  },

  // Get all categories
  getCategories: async () => {
    const response = await api.get('/api/products/categories')
    return response.data
  },

  // Get all products (with items)
  getProducts: async () => {
    const response = await api.get('/api/products/products')
    return response.data
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    const response = await api.get(`/api/products/products/category?category=${category}`)
    return response.data
  },

  // Get single product item by ID
  getProductItem: async (itemId) => {
    const response = await api.get(`/api/products/items/${itemId}`)
    return response.data
  },
}

