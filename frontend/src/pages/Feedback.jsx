import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { feedbackService } from '../services/feedbackService'
import { orderService } from '../services/orderService'
import { productService } from '../services/productService'
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
  const [customerOrders, setCustomerOrders] = useState([])
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [availableItems, setAvailableItems] = useState([])
  const [loading, setLoading] = useState(false)

  // Get order data from location state or fetch customer orders
  useEffect(() => {
    if (location.state?.orderData) {
      setOrderData(location.state.orderData)
      // Set first item_id if available
      if (location.state.orderData?.items?.[0]?.item_id) {
        setSelectedItemId(location.state.orderData.items[0].item_id)
      }
    } else {
      // Try to fetch customer's recent orders
      fetchCustomerOrders()
    }
  }, [location])

  const fetchCustomerOrders = async () => {
    try {
      setLoading(true)
      const customerId = localStorage.getItem('customerId')
      if (customerId) {
        const orders = await orderService.getCustomerOrders(parseInt(customerId))
        setCustomerOrders(orders || [])
      }
      
      // Fetch available products to allow selection
      try {
        const products = await productService.getProductItems()
        setAvailableItems(products || [])
        // Set first item as default if no item is selected
        if (products && products.length > 0 && !selectedItemId) {
          setSelectedItemId(products[0].item_id)
        }
      } catch (err) {
        console.error('Error fetching products:', err)
      }
    } catch (error) {
      console.error('Error fetching customer orders:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate total from order data
  const calculateTotal = (items) => {
    if (!items || items.length === 0) return 0
    
    const subtotal = items.reduce((sum, item) => {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0
      const quantity = item.quantity || 1
      return sum + (price * quantity)
    }, 0)
    
    const discount = 0
    const deliveryFee = 150
    return subtotal - discount + deliveryFee
  }

  const total = orderData ? calculateTotal(orderData.items || []) : 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      alert('Please provide a rating')
      return
    }

    // Get item_id - prioritize selectedItemId, then from orderData
    let itemId = selectedItemId
    if (!itemId && orderData?.items?.[0]?.item_id) {
      itemId = orderData.items[0].item_id
    }

    // If still no item_id, use first available item
    if (!itemId && availableItems.length > 0) {
      itemId = availableItems[0].item_id
    }

    if (!itemId) {
      alert('Unable to submit feedback: No item information available. Please try again later.')
      return
    }

    // Get customer ID from order data or localStorage
    let customerId = null
    if (orderData?.customer_id) {
      customerId = orderData.customer_id
    } else if (customerOrders.length > 0 && customerOrders[0].customer_id) {
      customerId = customerOrders[0].customer_id
    } else {
      // Try to get from localStorage (set during checkout)
      customerId = localStorage.getItem('customerId')
    }

    if (!customerId) {
      alert('Unable to submit feedback: Customer information not available. Please make sure you are logged in or have placed an order.')
      return
    }

    try {
      const feedbackData = {
        item_id: itemId,
        customer_id: parseInt(customerId),
        no_of_stars: rating,
        feedback_message: feedback || null
      }

      await feedbackService.submitFeedback(feedbackData)
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit feedback. Please try again.'
      alert(errorMessage)
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

          {(orderData && orderData.items) || customerOrders.length > 0 ? (
            <div className="order-summary-section">
              <h2>Order Summary</h2>
              {orderData && orderData.items ? (
                <>
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
                </>
              ) : (
                <div className="order-items-list">
                  <p style={{ marginBottom: '10px', color: '#666' }}>Your recent orders:</p>
                  {customerOrders.slice(0, 5).map((order) => (
                    <div key={order.order_id} className="order-item">
                      <span className="item-name">Order #{order.order_id}</span>
                      <span className="item-price">RS {parseFloat(order.total_amount || 0).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {!orderData && availableItems.length > 0 && (
            <div className="order-summary-section">
              <h2>Select Product to Review</h2>
              <div className="order-items-list">
                <select 
                  value={selectedItemId || ''} 
                  onChange={(e) => setSelectedItemId(parseInt(e.target.value))}
                  className="item-select"
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    border: '1px solid #ddd',
                    fontSize: '16px',
                    marginTop: '10px'
                  }}
                >
                  {availableItems.map((item) => (
                    <option key={item.item_id} value={item.item_id}>
                      {item.product_name} {item.size ? `- ${item.size}` : ''} - RS {parseFloat(item.price).toFixed(2)}
                    </option>
                  ))}
                </select>
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
