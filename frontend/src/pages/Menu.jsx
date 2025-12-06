import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { productService } from '../services/productService'
import weblogo from '../assets/images/logo/weblogo.png'
import '../styles/pages/Menu.css'

const Menu = () => {
  const navigate = useNavigate()
  const { cart, addToCart, subtotal, discount, deliveryFee, total, updateQuantity, removeFromCart } = useCart()
  const [searchQuery, setSearchQuery] = useState('')
  const [productItems, setProductItems] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch categories and products on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [categoriesData, itemsData] = await Promise.all([
          productService.getCategories(),
          productService.getProductItems()
        ])
        
        setCategories(categoriesData.categories || [])
        setProductItems(itemsData || [])
        
        // Set first category as selected if available
        if (categoriesData.categories && categoriesData.categories.length > 0) {
          setSelectedCategory(categoriesData.categories[0])
        }
      } catch (err) {
        console.error('Error fetching products:', err)
        let errorMessage = 'Failed to load menu items. '
        
        if (err.response) {
          // Server responded with error
          errorMessage += `Server error: ${err.response.status} - ${err.response.statusText}`
        } else if (err.request) {
          // Request was made but no response
          errorMessage += 'Cannot connect to server. Please make sure the backend is running on http://localhost:5000'
        } else {
          // Something else happened
          errorMessage += err.message || 'Please try again later.'
        }
        
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter products by category and search query
  const filteredItems = productItems.filter((item) => {
    const matchesCategory = !selectedCategory || item.category === selectedCategory
    const matchesSearch = !searchQuery || 
      item.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Group items by product for display
  const groupedProducts = filteredItems.reduce((acc, item) => {
    const productId = item.product_id
    if (!acc[productId]) {
      acc[productId] = {
        product_id: productId,
        product_name: item.product_name,
        category: item.category,
        items: []
      }
    }
    acc[productId].items.push(item)
    return acc
  }, {})

  const handleAddToCart = (item) => {
    addToCart({
      id: Date.now(), // Temporary ID for cart display
      item_id: item.item_id,
      name: item.product_name,
      price: parseFloat(item.price),
      size: item.size || null,
      quantity: 1,
      notes: item.size ? `${item.size} size` : '',
      category: item.category
    })
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items to cart first.')
      return
    }
    navigate('/checkout')
  }

  if (loading) {
    return (
      <div className="menu-page">
        <div className="loading-container">
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #ffb800',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <p style={{ fontSize: '18px', fontWeight: '600', color: '#03081f' }}>Loading menu...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="menu-page">
        <div className="error-container">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Error Loading Menu</p>
            <p style={{ fontSize: '14px', color: '#666' }}>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="menu-page">
      <div className="menu-header">
        <div className="menu-header-top">
          <div className="menu-logo">
            <img src={weblogo} alt="Muncheese Logo" className="logo-img" />
            <span className="logo-text">Mun cheese</span>
            <span className="cart-icon">🛒</span>
          </div>
          <div className="menu-search-section">
            <div className="menu-search">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search from menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="menu-search-input"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="menu-container">
        <div className="menu-left-section">
          <div className="menu-sidebar">
            <div className="menu-categories">
              <div className="menu-section-header">
                <span className="menu-icon">📋</span>
                <p className="menu-section-title">Categories</p>
              </div>
              <div className="category-buttons">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="menu-items-list">
            {Object.values(groupedProducts).map((product) => (
              <div key={product.product_id} className="menu-item-card">
                <div className="menu-item-info">
                  <h3 className="menu-item-name">{product.product_name}</h3>
                  <p className="menu-item-category">{product.category}</p>
                  
                  {/* Display all available sizes/prices for this product */}
                  <div className="menu-item-sizes">
                    {product.items.map((item) => (
                      <div key={item.item_id} className="menu-item-option">
                        <div className="size-price-info">
                          <span className="size-label">
                            {item.size || 'Standard'}
                          </span>
                          <span className="price-label">RS {parseFloat(item.price).toFixed(2)}</span>
                        </div>
                        <button 
                          className="add-to-cart-btn-small"
                          onClick={() => handleAddToCart(item)}
                        >
                          <span className="cart-icon-btn">🛒</span>
                          Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredItems.length === 0 && (
              <div className="no-items">
                <p>No items found in this category.</p>
              </div>
            )}
          </div>
        </div>

        <div className="menu-cart-sidebar">
          <div className="cart-header">
            <h2>Order Summary</h2>
          </div>
          <div className="cart-items">
            {cart.length === 0 ? (
              <p className="empty-cart">Your cart is empty</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-quantity">
                    <button 
                      className="qty-btn" 
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity || 1}x</span>
                    <button 
                      className="qty-btn" 
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-item-details">
                    <p className="cart-item-name">{item.name}</p>
                    {item.size && <p className="cart-item-notes">{item.size}</p>}
                    {item.notes && <p className="cart-item-notes">{item.notes}</p>}
                    <p className="cart-item-price">RS {(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}</p>
                  </div>
                  <button 
                    className="remove-item-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <>
              <div className="cart-summary">
                <div className="cart-summary-row">
                  <span>Sub Total:</span>
                  <span>RS {subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="cart-summary-row">
                    <span>Discounts:</span>
                    <span>-RS {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="cart-summary-row">
                  <span>Delivery Fee:</span>
                  <span>RS {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="cart-total">
                  <span>Total to pay</span>
                  <span className="cart-total-amount">RS {total.toFixed(2)}</span>
                </div>
              </div>
              <button 
                className="order-confirmed-btn" 
                onClick={handleCheckout} 
                data-checkout-button
              >
                <span className="card-icon">💳</span>
                Proceed to Checkout
              </button>
            </>
          )}
          <div className="estimated-delivery">
            <p>Estimated Delivery</p>
            <p className="delivery-time">30-45 minutes</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Menu
