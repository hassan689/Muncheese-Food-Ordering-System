import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { orderService } from '../services/orderService'
import { feedbackService } from '../services/feedbackService'
import '../styles/pages/OrderTracking.css'

const OrderTracking = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { orderId } = useParams()
  const [orderData, setOrderData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [submittingFeedback, setSubmittingFeedback] = useState(false)
  const orderDataRef = useRef(null)

  // Get order ID from URL params, location state, or query string
  const getOrderId = () => {
    if (orderId) return parseInt(orderId)
    if (location.state?.orderId) return location.state.orderId
    const params = new URLSearchParams(location.search)
    const id = params.get('order_id')
    return id ? parseInt(id) : null
  }

  useEffect(() => {
    const fetchOrderData = async () => {
      const id = getOrderId()
      if (!id) {
        setError('Order ID not provided')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await orderService.getOrderById(id)
        setOrderData(data)
        orderDataRef.current = data
      } catch (err) {
        console.error('Error fetching order:', err)
        let errorMessage = 'Failed to load order details. '
        
        if (err.response?.status === 404) {
          errorMessage = 'Order not found. Please check the order ID.'
        } else if (err.response) {
          errorMessage += `Server error: ${err.response.status}`
        } else if (err.request) {
          errorMessage += 'Cannot connect to server.'
        } else {
          errorMessage += err.message || 'Please try again later.'
        }
        
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderData()
  }, [orderId, location])

  // Update ref when orderData changes
  useEffect(() => {
    if (orderData) {
      orderDataRef.current = orderData
    }
  }, [orderData])

  // Separate effect for polling order status updates
  useEffect(() => {
    if (!orderData) return
    
    const id = getOrderId()
    if (!id) return
    
    // If order is completed, show feedback form if not already submitted
    if (orderData.status === 'completed' && !feedbackSubmitted) {
      setShowFeedback(true)
    }
    
    // Only poll if order is not completed/rejected
    if (orderData.status === 'completed' || orderData.status === 'rejected') {
      return
    }
    
    const intervalId = setInterval(() => {
      orderService.getOrderById(id)
        .then(data => {
          const previousStatus = orderDataRef.current?.status
          orderDataRef.current = data
          setOrderData(data)
          // Check if status changed to completed
          if (data.status === 'completed' && previousStatus !== 'completed') {
            setShowFeedback(true)
          }
        })
        .catch(err => console.error('Error polling order status:', err))
    }, 5000) // Poll every 5 seconds
    
    return () => clearInterval(intervalId) // Cleanup on unmount
  }, [orderData?.status, orderId, feedbackSubmitted])

  // Map order status to timeline steps
  const getOrderStatusTimeline = (status) => {
    const statusMap = {
      'pending': { step: 0, label: 'Order Placed', description: 'Your order has been received and is pending approval' },
      'location_verified': { step: 0, label: 'Order Placed', description: 'Your order has been received' },
      'awaiting_approval': { step: 0, label: 'Order Placed', description: 'Payment received, waiting for admin approval' },
      'paid': { step: 0, label: 'Order Placed', description: 'Payment has been confirmed, waiting for approval' },
      'accepted': { step: 2, label: 'Preparing', description: 'Your food is being prepared' },
      'rejected': { step: -1, label: 'Rejected', description: 'Your order has been rejected by the restaurant' },
      'completed': { step: 3, label: 'Delivered', description: 'Order has been delivered' }
    }

    const currentStatus = statusMap[status] || statusMap['pending']
    
    const timeline = [
      { 
        status: 'Order Placed', 
        completed: currentStatus.step >= 0,
        description: 'Your order has been received'
      },
      { 
        status: 'Preparing', 
        completed: currentStatus.step >= 2,
        description: 'Your food is being prepared'
      },
      { 
        status: 'Delivered', 
        completed: currentStatus.step >= 3 && status === 'completed',
        description: 'Order has been delivered'
      }
    ]

    return timeline
  }

  // Calculate estimated delivery time
  const getEstimatedDeliveryTime = (createdAt) => {
    if (!createdAt) return '30-45 minutes'
    
    const orderTime = new Date(createdAt)
    const now = new Date()
    const minutesSinceOrder = Math.floor((now - orderTime) / 1000 / 60)
    
    // Estimate 30-45 minutes from order time
    const estimatedMinutes = 45 - minutesSinceOrder
    if (estimatedMinutes <= 0) {
      return 'Arriving soon'
    }
    
    const deliveryTime = new Date(orderTime.getTime() + 45 * 60 * 1000)
    return deliveryTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  // Format date/time
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  // Format time only
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  // Handle feedback submission
  const handleSubmitFeedback = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      alert('Please provide a rating')
      return
    }

    if (!orderData) {
      alert('Unable to submit feedback: Order data not available')
      return
    }

    // Debug: Log order data structure
    console.log('Order data:', orderData)
    console.log('Order items:', orderData.items)

    if (!orderData.items || orderData.items.length === 0) {
      alert('Unable to submit feedback: Order items not available. Please refresh the page and try again.')
      return
    }

    const customerId = orderData.customer_id || localStorage.getItem('customerId')
    if (!customerId) {
      alert('Unable to submit feedback: Customer information not available')
      return
    }

    try {
      setSubmittingFeedback(true)
      
      // Submit feedback for the first item in the order (or allow multiple items)
      const firstItem = orderData.items[0]
      
      if (!firstItem.item_id) {
        alert('Unable to submit feedback: Item ID not found in order data')
        setSubmittingFeedback(false)
        return
      }
      
      const feedbackData = {
        item_id: firstItem.item_id,
        customer_id: parseInt(customerId),
        no_of_stars: rating,
        feedback_message: feedbackMessage || null
      }
      
      console.log('Submitting feedback:', feedbackData)

      await feedbackService.submitFeedback(feedbackData)
      setFeedbackSubmitted(true)
      setShowFeedback(false)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit feedback. Please try again.'
      alert(errorMessage)
    } finally {
      setSubmittingFeedback(false)
    }
  }

  // Check if order is completed and show feedback form
  useEffect(() => {
    if (orderData && orderData.status === 'completed' && !feedbackSubmitted) {
      setShowFeedback(true)
    }
  }, [orderData, feedbackSubmitted])

  if (loading) {
    return (
      <div className="order-tracking-page">
        <div className="order-tracking-container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '60vh',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #ffb800',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ fontSize: '18px', fontWeight: '600', color: '#03081f' }}>Loading order details...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show rejection message if order is rejected
  if (orderData && orderData.status === 'rejected') {
    return (
      <div className="order-tracking-page">
        <div className="order-tracking-container">
          <div className="error-container" style={{
            textAlign: 'center',
            padding: '60px 40px',
            background: '#fff5f5',
            borderRadius: '16px',
            border: '2px solid #ffcccc',
            margin: '40px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#cc0000', marginBottom: '12px' }}>
              Order Rejected
            </h2>
            <p style={{ color: '#666', marginBottom: '12px', fontSize: '16px' }}>
              Your order #{orderData.order_id} has been rejected by the restaurant.
            </p>
            <p style={{ color: '#999', marginBottom: '24px', fontSize: '14px' }}>
              If you have any questions or concerns, please contact us.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => navigate('/contact')}
                style={{
                  padding: '12px 24px',
                  background: '#ffb800',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#03081f',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Contact Us
              </button>
              <button 
                onClick={() => navigate('/menu')}
                style={{
                  padding: '12px 24px',
                  background: '#03081f',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Order Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !orderData) {
    return (
      <div className="order-tracking-page">
        <div className="order-tracking-container">
          <div className="error-container" style={{
            textAlign: 'center',
            padding: '60px 40px',
            background: '#fff5f5',
            borderRadius: '16px',
            border: '2px solid #ffcccc',
            margin: '40px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#cc0000', marginBottom: '12px' }}>
              {error || 'Order Not Found'}
            </h2>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              {error || 'Unable to load order details. Please check the order ID and try again.'}
            </p>
            <button 
              onClick={() => navigate('/orders')}
              style={{
                padding: '12px 24px',
                background: '#ffb800',
                border: 'none',
                borderRadius: '8px',
                color: '#03081f',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              View All Orders
            </button>
          </div>
        </div>
      </div>
    )
  }

  const orderStatus = getOrderStatusTimeline(orderData.status)
  const estimatedDelivery = getEstimatedDeliveryTime(orderData.created_at)
  const deliveryInfo = orderData.delivery_info
  const paymentInfo = orderData.payment
  const customerInfo = orderData.customer

  // Calculate totals (for now, using order total_amount)
  const subtotal = orderData.total_amount || 0
  const discount = 0
  const deliveryFee = 150
  const total = subtotal

  return (
    <div className="order-tracking-page">
      <div className="order-tracking-container">
        <div className="order-tracking-header">
          <h1>Track Your Order</h1>
          <p className="order-number">Order #{orderData.order_id}</p>
        </div>

        <div className="order-tracking-content">
          <div className="tracking-main">
            <div className="delivery-time-card">
              <div className="delivery-time-icon">
                <span style={{ fontSize: '48px' }}>⏰</span>
              </div>
              <div className="delivery-time-info">
                <p className="delivery-time-label">Estimated Delivery Time</p>
                <p className="delivery-time-value">{estimatedDelivery}</p>
                <p className="delivery-time-note">
                  {orderData.status === 'completed' 
                    ? 'Order has been delivered' 
                    : 'Your order will arrive soon'}
                </p>
              </div>
            </div>

            <div className="order-status-card">
              <h3 className="status-card-title">Order Status</h3>
              {(orderData.status === 'accepted' || orderData.status === 'completed' || orderData.status === 'pending' || orderData.status === 'paid' || orderData.status === 'awaiting_approval' || orderData.status === 'location_verified') ? (
                <div className="status-timeline">
                  {orderStatus.map((item, index) => (
                    <div key={index} className={`status-item ${item.completed ? 'completed' : 'pending'}`}>
                      <div className={`status-icon ${item.completed ? 'completed' : 'pending'}`}>
                        {item.completed ? (
                          <span style={{ fontSize: '24px' }}>✓</span>
                        ) : (
                          <span style={{ fontSize: '24px', opacity: 0.5 }}>○</span>
                        )}
                      </div>
                      <div className="status-content">
                        <div className="status-header">
                          <p className="status-name">{item.status}</p>
                          {orderData.created_at && item.completed && (
                            <p className="status-time">{formatTime(orderData.created_at)}</p>
                          )}
                        </div>
                        <p className="status-description">{item.description}</p>
                      </div>
                      {index < orderStatus.length - 1 && (
                        <div className={`status-connector ${item.completed ? 'completed' : ''}`}></div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  padding: '20px', 
                  textAlign: 'center',
                  background: '#f5f5f5',
                  borderRadius: '8px'
                }}>
                  <p style={{ fontSize: '16px', color: '#666' }}>
                    Current Status: <strong>{orderData.status === 'pending' ? 'Pending' : orderData.status}</strong>
                  </p>
                  <p style={{ fontSize: '14px', color: '#999', marginTop: '8px' }}>
                    {orderData.status === 'pending' 
                      ? 'Your order has been placed and is waiting for admin approval.'
                      : 'Your order is being processed. You\'ll be able to track it once it\'s accepted.'}
                  </p>
                </div>
              )}
            </div>

            {/* Feedback Form - Show when order is completed */}
            {orderData.status === 'completed' && !feedbackSubmitted && (
              <div className="feedback-card" style={{
                marginTop: '20px',
                padding: '24px',
                background: '#fff',
                borderRadius: '12px',
                border: '2px solid #ffb800'
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#03081f' }}>
                  How was your order?
                </h3>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                  We'd love to hear about your experience!
                </p>
                
                {!showFeedback ? (
                  <button
                    onClick={() => setShowFeedback(true)}
                    style={{
                      padding: '12px 24px',
                      background: '#ffb800',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#03081f',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    Leave Feedback
                  </button>
                ) : (
                  <form onSubmit={handleSubmitFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#03081f' }}>
                        Rating
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            style={{
                              fontSize: '32px',
                              color: star <= (hoveredRating || rating) ? '#ffb800' : '#ddd',
                              cursor: 'pointer',
                              transition: 'color 0.2s'
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#03081f' }}>
                        Your Feedback (optional)
                      </label>
                      <textarea
                        value={feedbackMessage}
                        onChange={(e) => setFeedbackMessage(e.target.value)}
                        placeholder="Tell us about your experience..."
                        rows={4}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #e0e0e0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontFamily: 'inherit',
                          resize: 'vertical'
                        }}
                      />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        type="submit"
                        disabled={rating === 0 || submittingFeedback}
                        style={{
                          padding: '12px 24px',
                          background: rating === 0 || submittingFeedback ? '#ccc' : '#ffb800',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#03081f',
                          fontWeight: '600',
                          cursor: rating === 0 || submittingFeedback ? 'not-allowed' : 'pointer',
                          fontSize: '16px',
                          flex: 1
                        }}
                      >
                        {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowFeedback(false)
                          setRating(0)
                          setFeedbackMessage('')
                        }}
                        style={{
                          padding: '12px 24px',
                          background: 'transparent',
                          border: '2px solid #e0e0e0',
                          borderRadius: '8px',
                          color: '#666',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '16px'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {feedbackSubmitted && (
              <div className="feedback-success" style={{
                marginTop: '20px',
                padding: '24px',
                background: '#f0f9f0',
                borderRadius: '12px',
                border: '2px solid #4CAF50',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>✓</div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#4CAF50', marginBottom: '8px' }}>
                  Thank You for Your Feedback!
                </h3>
                <p style={{ color: '#666', fontSize: '14px' }}>
                  Your feedback has been submitted successfully.
                </p>
              </div>
            )}

            {deliveryInfo && (
              <div className="delivery-info-card">
                <h3 className="info-card-title">Delivery Information</h3>
                <div className="delivery-address">
                  <div className="address-icon">
                    <span style={{ fontSize: '32px' }}>📍</span>
                  </div>
                  <div className="address-details">
                    <p className="address-label">Delivery Address</p>
                    <p className="address-text">
                      {deliveryInfo.address}
                    </p>
                    {deliveryInfo.is_within_range === false && (
                      <p style={{ color: '#ff4444', fontSize: '14px', marginTop: '8px' }}>
                        ⚠️ Location is outside delivery range
                      </p>
                    )}
                  </div>
                </div>
                {customerInfo && (
                  <div className="delivery-driver">
                    <div className="driver-avatar">
                      <span style={{ fontSize: '32px' }}>👤</span>
                    </div>
                    <div className="driver-details">
                      <p className="driver-name">{customerInfo.name}</p>
                      <p className="driver-role">Customer</p>
                    </div>
                    {customerInfo.phone && (
                      <div className="driver-contact">
                        <p className="driver-phone">{customerInfo.phone}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="order-details-sidebar">
            <div className="order-details-header">
              <h3>Order Details</h3>
              <p className="restaurant-name">Muncheese</p>
              <p className="order-placed-time">
                Order placed at {orderData.created_at ? formatDateTime(orderData.created_at) : 'N/A'}
              </p>
            </div>
            
            <div className="order-items-list">
              {orderData.items && orderData.items.length > 0 ? (
                orderData.items.map((item, index) => (
                  <div key={item.order_item_id || index} className="order-detail-item">
                    <div className="order-item-info">
                      <p className="order-item-name">{item.product_name || item.name || 'Unknown Item'}</p>
                      {item.size && <p className="order-item-notes">Size: {item.size}</p>}
                      {item.description && <p className="order-item-notes">{item.description}</p>}
                      <p className="order-item-price">
                        Rs{(item.price || 0).toFixed(2)} x {item.quantity || 1} = Rs{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="order-detail-item">
                  <div className="order-item-info">
                    <p className="order-item-name">Order #{orderData.order_id}</p>
                    <p className="order-item-notes">Status: {orderData.status}</p>
                    <p className="order-item-price">RS {orderData.total_amount?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="order-summary">
              <div className="summary-row">
                <span>Sub Total:</span>
                <span>RS {subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row">
                  <span>Discounts:</span>
                  <span>-RS {discount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Delivery Fee:</span>
                <span>RS {deliveryFee.toFixed(2)}</span>
              </div>
              <div className="summary-total">
                <span>Total Paid</span>
                <span className="total-amount">RS {total.toFixed(2)}</span>
              </div>
            </div>

            {paymentInfo && (
              <div className="payment-method">
                <div className="payment-icon">
                  <span>{paymentInfo.method === 'online' ? '💳' : '💵'}</span>
                </div>
                <div className="payment-details">
                  <p className="payment-label">Payment Method</p>
                  <p className="payment-type">
                    {paymentInfo.method === 'online' ? 'Online Payment' : 'Cash on Delivery'}
                  </p>
                  {paymentInfo.payment_date && (
                    <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      Paid on {formatDateTime(paymentInfo.payment_date)}
                    </p>
                  )}
                </div>
              </div>
            )}

            <button 
              className="need-help-btn"
              onClick={() => navigate('/contact')}
            >
              Need Help?
            </button>
          </div>
        </div>

        <div className="tracking-actions">
          <button className="checkout-btn" onClick={() => navigate('/menu')}>
            Order More
          </button>
          <button className="order-tracking-btn active">
            Order Tracking
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderTracking
