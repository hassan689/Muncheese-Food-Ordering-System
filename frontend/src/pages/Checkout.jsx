import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/pages/Checkout.css'

const Checkout = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    deliveryAddress: '',
    city: '',
    postcode: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [specialInstructions, setSpecialInstructions] = useState('')

  const orderItems = [
    { id: 1, name: '12" Vegitarian Pizza', price: 500, quantity: 1, notes: 'No Mushrooms + green peppers' },
    { id: 2, name: '17" Tandoori Pizza', price: 1000, quantity: 1, notes: 'No Mushrooms + green peppers' },
    { id: 3, name: '12" Vegitarian Pizza', price: 800, quantity: 1, notes: 'No Mushrooms + green peppers' }
  ]

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discount = 3.00
  const deliveryFee = 2.50
  const total = subtotal - discount + deliveryFee

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handlePlaceOrder = () => {
    // Here you would typically send the order to the backend
    navigate('/order-confirmation')
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Complete your order from Tandoori Pizza London</p>
        </div>

        <div className="checkout-content">
          <div className="checkout-forms">
            <div className="checkout-section">
              <h2 className="section-title">Delivery Information</h2>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="form-group">
                <label>Delivery Address</label>
                <textarea
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleInputChange}
                  placeholder="Enter your complete address"
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                  />
                </div>
                <div className="form-group">
                  <label>Postcode</label>
                  <input
                    type="text"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    placeholder="Postcode"
                  />
                </div>
              </div>
            </div>

            <div className="checkout-section">
              <h2 className="section-title">Payment Method</h2>
              <div className="payment-options">
                <label className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Cash on Delivery</span>
                </label>
                <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Credit/Debit Card</span>
                </label>
                <label className={`payment-option ${paymentMethod === 'wallet' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Digital Wallet</span>
                </label>
              </div>
              <div className="form-group">
                <label>Special Instructions (Optional)</label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Add any special instructions for your order..."
                  rows="3"
                />
              </div>
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
            <button className="place-order-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

