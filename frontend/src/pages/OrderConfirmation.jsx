import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { orderService } from '../services/orderService'
import '../styles/pages/OrderConfirmation.css'

const OrderConfirmation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [orderData, setOrderData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Get order data from location state or fetch from API
  useEffect(() => {
    const fetchOrderData = async () => {
      // If order data is passed via navigation state, use it
      if (location.state?.orderData) {
        setOrderData(location.state.orderData)
        setLoading(false)
        return
      }

      // Otherwise, try to get the latest order from API
      // TODO: Implement fetching latest order or order by ID
      // For now, show a message
      setLoading(false)
    }

    fetchOrderData()
  }, [location])

  // Calculate totals from order data
  const calculateTotals = (items) => {
    if (!items || items.length === 0) return { subtotal: 0, discount: 0, deliveryFee: 2.50, total: 2.50 }
    
    const subtotal = items.reduce((sum, item) => {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0
      const quantity = item.quantity || 1
      return sum + (price * quantity)
    }, 0)
    
    const discount = 0 // Can be calculated from backend
    const deliveryFee = 2.50 // Can be fetched from backend
    const total = subtotal - discount + deliveryFee
    
    return { subtotal, discount, deliveryFee, total }
  }

  if (loading) {
    return (
      <div className="order-confirmation-page">
        <div className="loading-container">
          <p>Loading order confirmation...</p>
        </div>
      </div>
    )
  }

  // If no order data, show message
  if (!orderData) {
    return (
      <div className="order-confirmation-page">
        <div className="order-confirmation-container">
          <div className="order-confirmation-message">
            <h2>Order Confirmed!</h2>
            <p>Thank you for your order. We've received your order and will start preparing it right away.</p>
            <div className="confirmation-actions">
              <button className="home-btn" onClick={() => navigate('/')}>
                Home
              </button>
              <button className="tracking-btn" onClick={() => navigate('/order-tracking')}>
                Track Order
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const { subtotal, discount, deliveryFee, total } = calculateTotals(orderData.items || [])

  return (
    <div className="order-confirmation-page">
      <div className="order-confirmation-container">
        <div className="order-confirmation-header">
          <h1>Order Confirmed!</h1>
          <p>Thank you for your order from Muncheese</p>
        </div>

        <div className="order-confirmation-content">
          <div className="order-confirmation-message">
            <div className="confirmation-section">
              <h2 className="section-title">Order Confirmed!</h2>
              <p className="confirmation-text">
                Thank you for your order. We've received your order and will start preparing it right away.
              </p>
              {orderData.order_id && (
                <p className="order-id">Order ID: #{orderData.order_id}</p>
              )}
            </div>
          </div>

          <div className="checkout-summary">
            <h2 className="section-title">Order Summary</h2>
            <div className="summary-items">
              {(orderData.items || []).map((item, index) => (
                <div key={item.id || index} className="summary-item">
                  <div className="summary-item-quantity">{item.quantity || 1}x</div>
                  <div className="summary-item-details">
                    <p className="summary-item-name">{item.name}</p>
                    {item.notes && <p className="summary-item-notes">{item.notes}</p>}
                    <p className="summary-item-price">
                      RS {((typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0) * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="summary-totals">
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
                <span>Total to pay</span>
                <span className="summary-total-amount">RS {total.toFixed(2)}</span>
              </div>
            </div>
            <div className="delivery-estimate">
              <p>Estimated Delivery</p>
              <p className="delivery-time">30-45 minutes</p>
            </div>
            <div className="confirmation-actions">
              <button className="feedback-btn" onClick={() => navigate('/feedback')}>
                Leave Feedback
              </button>
              <button className="home-btn" onClick={() => navigate('/')}>
                Home
              </button>
              <button 
                className="tracking-btn" 
                onClick={() => navigate(orderData.order_id ? `/order-tracking/${orderData.order_id}` : '/order-tracking')}
              >
                Track Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation
