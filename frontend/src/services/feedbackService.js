import api from './api'

export const feedbackService = {
  // Get featured reviews (for landing page)
  getFeaturedReviews: async (limit = 5) => {
    const response = await api.get(`/api/feedback/featured?limit=${limit}`)
    return response.data
  },

  // Get all feedback
  getAllFeedback: async () => {
    const response = await api.get('/api/feedback')
    return response.data
  },

  // Get reviews for a specific item
  getItemReviews: async (itemId) => {
    const response = await api.get(`/api/feedback/item/${itemId}`)
    return response.data
  },

  // Submit feedback
  submitFeedback: async (feedbackData) => {
    const response = await api.post('/api/feedback', feedbackData)
    return response.data
  },
}



