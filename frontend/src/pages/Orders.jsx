import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { orderService } from '../services/orderService'
import '../styles/pages/Orders.css'

const Orders = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [phoneNumber, setPhoneNumber] = useState(localStorage.getItem('customerPhone') || '')
  const [showPhoneInput, setShowPhoneInput] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      const customerId = localStorage.getItem('customerId')
      
      if (!customerId) {
        setLoading(false)
        setShowPhoneInput(true)
        return
      }

      try {
        setLoading(true)
        const data = await orderService.getCustomerOrders(parseInt(customerId))
        // Filter to show only active orders (pending, accepted, preparing, paid, awaiting_approval, location_verified)
        // Exclude completed and rejected orders
        const activeOrders = (data || []).filter(order => 
          order.status !== 'completed' && order.status !== 'rejected'
        )
        setOrders(activeOrders)
      } catch (err) {
        console.error('Error fetching orders:', err)
        setError('Failed to load orders. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
    
    // Poll for order status updates every 5 seconds
    const intervalId = setInterval(() => {
      const customerId = localStorage.getItem('customerId')
      if (customerId) {
        orderService.getCustomerOrders(parseInt(customerId))
          .then(data => {
            const activeOrders = (data || []).filter(order => 
              order.status !== 'completed' && order.status !== 'rejected'
            )
            setOrders(activeOrders)
          })
          .catch(err => console.error('Error polling orders:', err))
      }
    }, 5000) // Poll every 5 seconds
    
    return () => clearInterval(intervalId) // Cleanup on unmount
  }, [])

  const handlePhoneSubmit = async (e) => {
    e.preventDefault()
    if (!phoneNumber) {
      alert('Please enter your phone number')
      return
    }

    try {
      setLoading(true)
      setError(null)
      // First, try to find customer by phone (would need backend endpoint)
      // For now, show message that they need to place an order first
      setError('Please place an order first. Your phone number will be saved for future orders.')
      setLoading(false)
    } catch (err) {
      setError('Unable to find orders. Please place an order first.')
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getStatusColor = (status) => {
    const statusColors = {
      'pending': '#ffb800',
      'location_verified': '#4CAF50',
      'awaiting_approval': '#2196F3',
      'paid': '#4CAF50',
      'accepted': '#2196F3',
      'preparing': '#FF9800',
      'completed': '#4CAF50',
      'rejected': '#f44336'
    }
    return statusColors[status] || '#666'
  }

  const getStatusLabel = (status) => {
    const statusLabels = {
      'pending': 'Pending',
      'location_verified': 'Location Verified',
      'awaiting_approval': 'Awaiting Approval',
      'paid': 'Paid',
      'accepted': 'Accepted',
      'preparing': 'Preparing',
      'completed': 'Completed',
      'rejected': 'Rejected'
    }
    return statusLabels[status] || status
  }

  if (loading) {
    return (
      <div className="orders">
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
          <p style={{ fontSize: '18px', fontWeight: '600', color: '#03081f' }}>Loading orders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="orders">
        <div style={{
          textAlign: 'center',
          padding: '60px 40px',
          background: '#fff5f5',
          borderRadius: '16px',
          border: '2px solid #ffcccc',
          margin: '40px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#cc0000', marginBottom: '12px' }}>
            Error
          </h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>{error}</p>
          <button 
            onClick={() => navigate('/menu')}
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
            Browse Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="orders">
      <div className="orders-container">
        <div className="orders-header">
          <h1>Your Orders</h1>
          <button className="menu-btn" onClick={() => navigate('/menu')}>
            Browse Menu
          </button>
        </div>

        {showPhoneInput && !localStorage.getItem('customerId') ? (
          <div className="no-orders">
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📱</div>
            <h2>View Your Orders</h2>
            <p>Enter your phone number to view your order history, or place a new order.</p>
            <form onSubmit={handlePhoneSubmit} style={{ marginTop: '24px', maxWidth: '400px', margin: '24px auto 0' }}>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                style={{
                  width: '100%',
                  padding: '14px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  marginBottom: '12px'
                }}
              />
              <button type="submit" className="menu-btn" style={{ width: '100%' }}>
                View Orders
              </button>
            </form>
            <p style={{ marginTop: '16px', color: '#666' }}>or</p>
            <button className="menu-btn" onClick={() => navigate('/menu')} style={{ marginTop: '12px' }}>
              Place New Order
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="no-orders">
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📦</div>
            <h2>No Orders Yet</h2>
            <p>Start ordering delicious food from our menu!</p>
            <button className="menu-btn" onClick={() => navigate('/menu')}>
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div 
                key={order.order_id} 
                className="order-card"
                onClick={() => navigate(`/order-tracking/${order.order_id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="order-card-header">
                  <div>
                    <h3 className="order-card-title">Order #{order.order_id}</h3>
                    <p className="order-card-date">{formatDate(order.created_at)}</p>
                  </div>
                  <div 
                    className="order-status-badge"
                    style={{ 
                      background: getStatusColor(order.status),
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    {getStatusLabel(order.status)}
                  </div>
                </div>
                <div className="order-card-body">
                  <div className="order-card-info">
                    <div className="order-info-item">
                      <span className="order-info-label">Total Amount:</span>
                      <span className="order-info-value">RS {parseFloat(order.total_amount || 0).toFixed(2)}</span>
                    </div>
                    {order.delivery_info && (
                      <div className="order-info-item">
                        <span className="order-info-label">Delivery Address:</span>
                        <span className="order-info-value">{order.delivery_info.address}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="order-card-footer">
                  <button 
                    className="track-order-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/order-tracking/${order.order_id}`)
                    }}
                  >
                    Track Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
