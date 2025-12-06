import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { userService } from '../services/userService'
import { orderService } from '../services/orderService'
import '../styles/pages/Checkout.css'

const Checkout = () => {
  const navigate = useNavigate()
  const { cart, subtotal, discount, deliveryFee, total, clearCart } = useCart()
  
  // Load saved customer info from localStorage if available
  const savedCustomer = localStorage.getItem('customerInfo')
  const initialFormData = savedCustomer ? JSON.parse(savedCustomer) : {
    fullName: '',
    phoneNumber: '',
    deliveryAddress: '',
    city: '',
    postcode: ''
  }
  
  const [formData, setFormData] = useState(initialFormData)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [locationData, setLocationData] = useState(null)

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/menu')
    }
  }, [cart, navigate])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handlePlaceOrder = async () => {
    if (!formData.fullName || !formData.phoneNumber || !formData.deliveryAddress) {
      alert('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      // Step 1: Register/Create customer (or get existing)
      let customerId = localStorage.getItem('customerId')
      let customer = null

      if (!customerId) {
        // Register new customer
        const customerData = {
          name: formData.fullName,
          phone: formData.phoneNumber,
          address: formData.deliveryAddress
        }
        customer = await userService.register(customerData)
        customerId = customer.user_id || customer.user?.user_id
        
        // Save customer info for future orders
        localStorage.setItem('customerId', customerId.toString())
        localStorage.setItem('customerPhone', formData.phoneNumber)
        localStorage.setItem('customerInfo', JSON.stringify(formData))
      }

      // Step 2: Create order
      const orderData = {
        customer_id: parseInt(customerId),
        total_amount: total
      }
      const orderResponse = await orderService.createOrder(orderData)
      const orderId = orderResponse.order_id

      // Step 3: Get user's location (if available) or use address
      // For now, we'll use default coordinates (you can enhance this with geolocation)
      const defaultLat = 24.8607  // Muncheese location
      const defaultLng = 67.0011
      
      // Step 4: Add delivery location
      try {
        await orderService.addLocation(orderId, {
          address: formData.deliveryAddress,
          lat: defaultLat,
          lng: defaultLng
        })
      } catch (locationError) {
        console.warn('Location validation failed:', locationError)
        // Continue anyway - location might be added later
      }

      // Step 5: Process payment
      const paymentData = {
        order_id: orderId,
        amount: total,
        method: paymentMethod
      }

      if (paymentMethod === 'online') {
        // For online payment, you'd need to upload screenshot
        // For now, we'll just record the payment method
        paymentData.file = null // Would be file upload in real implementation
      }

      try {
        await orderService.makePayment(paymentData)
      } catch (paymentError) {
        console.warn('Payment processing:', paymentError)
        // Continue - payment might be processed later
      }

      // Step 6: Clear cart and navigate to confirmation
      clearCart()
      navigate('/order-confirmation', {
        state: {
          orderData: {
            order_id: orderId,
            items: cart,
            total: total,
            customer_id: customerId
          }
        }
      })
    } catch (error) {
      console.error('Error placing order:', error)
      const errorMessage = error.response?.data?.error || error.message || 'Failed to place order. Please try again.'
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cart.length === 0) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Complete your order from Muncheese</p>
        </div>

        <div className="checkout-content">
          <div className="checkout-forms">
            <div className="checkout-section">
              <h2 className="section-title">Delivery Information</h2>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div className="form-group">
                <label>Delivery Address *</label>
                <textarea
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleInputChange}
                  placeholder="Enter your complete address"
                  rows="3"
                  required
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
                <label className={`payment-option ${paymentMethod === 'online' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Online Payment</span>
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
              {cart.map((item) => (
                <div key={item.id} className="summary-item">
                  <div className="summary-item-quantity">{item.quantity || 1}x</div>
                  <div className="summary-item-details">
                    <p className="summary-item-name">{item.name}</p>
                    {item.size && <p className="summary-item-notes">{item.size}</p>}
                    {item.notes && <p className="summary-item-notes">{item.notes}</p>}
                    <p className="summary-item-price">RS {(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}</p>
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
            <button 
              className="place-order-btn" 
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
