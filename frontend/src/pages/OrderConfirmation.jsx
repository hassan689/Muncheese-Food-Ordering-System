import { useNavigate } from 'react-router-dom'
import '../styles/pages/OrderConfirmation.css'

const OrderConfirmation = () => {
  const navigate = useNavigate()

  const orderItems = [
    { id: 1, name: '12" Vegitarian Pizza', price: 500, quantity: 1, notes: 'No Mushrooms + green peppers' },
    { id: 2, name: '17" Tandoori Pizza', price: 1000, quantity: 1, notes: 'No Mushrooms + green peppers' },
    { id: 3, name: '12" Vegitarian Pizza', price: 800, quantity: 1, notes: 'No Mushrooms + green peppers' }
  ]

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discount = 3.00
  const deliveryFee = 2.50
  const total = subtotal - discount + deliveryFee

  return (
    <div className="order-confirmation-page">
      <div className="order-confirmation-container">
        <div className="order-confirmation-header">
          <h1>Checkout</h1>
          <p>Complete your order from Tandoori Pizza London</p>
        </div>

        <div className="order-confirmation-content">
          <div className="order-confirmation-message">
            <div className="confirmation-section">
              <h2 className="section-title">Order Confirmed!</h2>
              <p className="confirmation-text">
                Thank you for your order. We've received your order and will start preparing it right away.
              </p>
            </div>
          </div>

          <div className="checkout-summary">
            <h2 className="section-title">Order Summary</h2>
            <div className="summary-items">
              {orderItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <div className="summary-item-quantity">{item.quantity}x</div>
                  <div className="summary-item-details">
                    <p className="summary-item-name">{item.name}</p>
                    <p className="summary-item-notes">{item.notes}</p>
                    <p className="summary-item-price">RS {item.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="summary-totals">
              <div className="summary-row">
                <span>Sub Total:</span>
                <span>RS {subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Discounts:</span>
                <span>-RS {discount.toFixed(2)}</span>
              </div>
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
            <button className="order-confirmed-btn">
              Order Confirmed
            </button>
            <div className="confirmation-actions">
              <button className="feedback-btn" onClick={() => navigate('/feedback')}>
                Leave Feedback
              </button>
              <button className="home-btn" onClick={() => navigate('/')}>
                Home
              </button>
              <button className="tracking-btn" onClick={() => navigate('/order-tracking')}>
                Order Tracking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation

