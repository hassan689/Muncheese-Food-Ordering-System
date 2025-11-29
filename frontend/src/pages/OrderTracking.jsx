import { useNavigate } from 'react-router-dom'
import '../styles/pages/OrderTracking.css'

const OrderTracking = () => {
  const navigate = useNavigate()

  const orderStatus = [
    { status: 'Order Confirmed', time: '3:00 PM', description: 'Your order has been received', completed: true },
    { status: 'Preparing', time: '3:05 PM', description: 'Your food is being prepared', completed: true },
    { status: 'Out for Delivery', time: '3:20 PM', description: 'Your order is on the way', completed: true },
    { status: 'Delivered', time: '3:45 PM', description: 'Expected by 3:45 PM', completed: false }
  ]

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
    <div className="order-tracking-page">
      <div className="order-tracking-container">
        <div className="order-tracking-header">
          <h1>Track Your Order</h1>
          <p className="order-number">Order #TND-2024-1847</p>
        </div>

        <div className="order-tracking-content">
          <div className="tracking-main">
            <div className="delivery-time-card">
              <div className="delivery-time-icon">
                <img src="/src/assets/images/fastfood_landingPage.jpg" alt="Clock" />
              </div>
              <div className="delivery-time-info">
                <p className="delivery-time-label">Estimated Delivery Time</p>
                <p className="delivery-time-value">3:45 PM</p>
                <p className="delivery-time-note">Your order will arrive in approximately 25 minutes</p>
              </div>
            </div>

            <div className="order-status-card">
              <h3 className="status-card-title">Order Status</h3>
              <div className="status-timeline">
                {orderStatus.map((item, index) => (
                  <div key={index} className={`status-item ${item.completed ? 'completed' : 'pending'}`}>
                    <div className={`status-icon ${item.completed ? 'completed' : 'pending'}`}>
                      {item.completed ? (
                        <img src="/src/assets/images/fastfood_landingPage.jpg" alt="Completed" />
                      ) : (
                        <img src="/src/assets/images/fastfood_landingPage.jpg" alt="Pending" />
                      )}
                    </div>
                    <div className="status-content">
                      <div className="status-header">
                        <p className="status-name">{item.status}</p>
                        <p className="status-time">{item.time}</p>
                      </div>
                      <p className="status-description">{item.description}</p>
                    </div>
                    {index < orderStatus.length - 1 && (
                      <div className={`status-connector ${item.completed ? 'completed' : ''}`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="delivery-info-card">
              <h3 className="info-card-title">Delivery Information</h3>
              <div className="delivery-address">
                <div className="address-icon">
                  <img src="/src/assets/images/fastfood_landingPage.jpg" alt="Address" />
                </div>
                <div className="address-details">
                  <p className="address-label">Delivery Address</p>
                  <p className="address-text">
                    123 Baker Street<br />
                    London, NW1 6XE<br />
                    United Kingdom
                  </p>
                </div>
              </div>
              <div className="delivery-driver">
                <div className="driver-avatar">
                  <img src="/src/assets/images/fastfood_landingPage.jpg" alt="Driver" />
                </div>
                <div className="driver-details">
                  <p className="driver-name">John Driver</p>
                  <p className="driver-role">Delivery Partner</p>
                </div>
                <div className="driver-contact">
                  <button className="call-driver-btn">
                    <img src="/src/assets/images/fastfood_landingPage.jpg" alt="Call" />
                  </button>
                  <p className="driver-phone">030904228**</p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-details-sidebar">
            <div className="order-details-header">
              <h3>Order Details</h3>
              <p className="restaurant-name">Tandoori Pizza London</p>
              <p className="order-placed-time">Order placed at 3:00 PM</p>
            </div>
            <div className="order-items-list">
              {orderItems.map((item) => (
                <div key={item.id} className="order-detail-item">
                  <div className="order-item-quantity">{item.quantity}x</div>
                  <div className="order-item-info">
                    <p className="order-item-name">{item.name}</p>
                    <p className="order-item-notes">{item.notes}</p>
                    <p className="order-item-price">RS {item.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-summary">
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
                <span>Total Paid</span>
                <span className="total-amount">RS {total.toFixed(2)}</span>
              </div>
            </div>
            <div className="payment-method">
              <div className="payment-icon">
                <span>💵</span>
              </div>
              <div className="payment-details">
                <p className="payment-label">Payment Method</p>
                <p className="payment-type">Cash on Delivery</p>
              </div>
            </div>
            <button className="need-help-btn">Need Help?</button>
          </div>
        </div>

        <div className="tracking-actions">
          <button className="checkout-btn" onClick={() => navigate('/checkout')}>
            Checkout
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

