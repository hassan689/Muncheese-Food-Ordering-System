import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { feedbackService } from '../services/feedbackService'
import weblogo from '../assets/images/logo/weblogo.png'
import '../styles/pages/Feedback.css'

const Feedback = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [orderData, setOrderData] = useState(null)

  // Get order data from location state
  useEffect(() => {
    if (location.state?.orderData) {
      setOrderData(location.state.orderData)
    }
  }, [location])

  // Calculate total from order data
  const calculateTotal = (items) => {
    if (!items || items.length === 0) return 0
    
    const subtotal = items.reduce((sum, item) => {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0
      const quantity = item.quantity || 1
      return sum + (price * quantity)
    }, 0)
    
    const discount = 0
    const deliveryFee = 2.50
    return subtotal - discount + deliveryFee
  }

  const total = orderData ? calculateTotal(orderData.items || []) : 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      alert('Please provide a rating')
      return
    }

    // Get the first item from order if available
    const firstItem = orderData?.items?.[0]
    if (!firstItem || !firstItem.item_id) {
      alert('Unable to submit feedback: No item information available')
      return
    }

    // Get customer ID from order data or localStorage
    let customerId = null
    if (orderData?.customer_id) {
      customerId = orderData.customer_id
    } else {
      // Try to get from localStorage (set during checkout)
      customerId = localStorage.getItem('customerId')
    }

    if (!customerId) {
      alert('Unable to submit feedback: Customer information not available')
      return
    }

    try {
      const feedbackData = {
        item_id: firstItem.item_id,
        customer_id: customerId,
        no_of_stars: rating,
        feedback_message: feedback || null
      }

      await feedbackService.submitFeedback(feedbackData)
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Failed to submit feedback. Please try again.')
    }
  }

  const handleRatingClick = (value) => {
    setRating(value)
  }

  const handleRatingHover = (value) => {
    setHoveredRating(value)
  }

  const handleRatingLeave = () => {
    setHoveredRating(0)
  }

  if (submitted) {
    return (
      <div className="feedback-page">
        <div className="feedback-container">
          <div className="feedback-success">
            <div className="success-icon">✓</div>
            <h1>Thank You for Your Feedback!</h1>
            <p>Your feedback has been submitted successfully. We appreciate your input and will use it to improve our service.</p>
            <div className="success-actions">
              <button className="home-btn" onClick={() => navigate('/')}>
                Back to Home
              </button>
              <button className="orders-btn" onClick={() => navigate('/orders')}>
                View Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="feedback-page">
      <div className="feedback-header">
        <div className="feedback-logo">
          <img src={weblogo} alt="Muncheese Logo" className="logo-img" />
          <span className="logo-text">Muncheese</span>
        </div>
      </div>

      <div className="feedback-container">
        <div className="feedback-content">
          <div className="feedback-header-section">
            <h1>How was your order?</h1>
            <p>We'd love to hear about your experience</p>
          </div>

          {orderData && orderData.items && (
            <div className="order-summary-section">
              <h2>Order Summary</h2>
              <div className="order-items-list">
                {orderData.items.map((item, index) => (
                  <div key={item.id || index} className="order-item">
                    <span className="item-quantity">{item.quantity || 1}x</span>
                    <span className="item-name">{item.name}</span>
                    <span className="item-price">
                      RS {((typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0) * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <span>Total: RS {total.toFixed(2)}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="rating-section">
              <label className="rating-label">Rate your experience</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= (hoveredRating || rating) ? 'filled' : ''}`}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => handleRatingHover(star)}
                    onMouseLeave={handleRatingLeave}
                  >
                    ★
                  </span>
                ))}
              </div>
              {rating > 0 && (
                <p className="rating-text">
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent'}
                </p>
              )}
            </div>

            <div className="feedback-text-section">
              <label htmlFor="feedback" className="feedback-label">
                Tell us more about your experience (optional)
              </label>
              <textarea
                id="feedback"
                className="feedback-textarea"
                placeholder="Share your thoughts about the food quality, delivery time, service, etc..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={6}
              />
            </div>

            <div className="feedback-actions">
              <button type="submit" className="submit-feedback-btn">
                Submit Feedback
              </button>
              <button 
                type="button" 
                className="skip-btn"
                onClick={() => navigate('/')}
              >
                Skip for now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Feedback
