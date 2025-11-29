import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import weblogo from '../assets/images/logo/weblogo.png'
import '../styles/pages/Feedback.css'

const Feedback = () => {
  const navigate = useNavigate()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const orderItems = [
    { id: 1, name: '12" Vegitarian Pizza', price: 500, quantity: 1 },
    { id: 2, name: '17" Tandoori Pizza', price: 1000, quantity: 1 },
    { id: 3, name: '12" Vegitarian Pizza', price: 800, quantity: 1 }
  ]

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discount = 3.00
  const deliveryFee = 2.50
  const total = subtotal - discount + deliveryFee

  const handleSubmit = (e) => {
    e.preventDefault()
    if (rating === 0) {
      alert('Please provide a rating')
      return
    }
    // Here you would typically send the feedback to the backend
    console.log('Feedback submitted:', { rating, feedback })
    setSubmitted(true)
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

          <div className="order-summary-section">
            <h2>Order Summary</h2>
            <div className="order-items-list">
              {orderItems.map((item) => (
                <div key={item.id} className="order-item">
                  <span className="item-quantity">{item.quantity}x</span>
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">RS {item.price}</span>
                </div>
              ))}
            </div>
            <div className="order-total">
              <span>Total: RS {total.toFixed(2)}</span>
            </div>
          </div>

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

