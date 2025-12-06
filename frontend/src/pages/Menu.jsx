import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { productService } from '../services/productService'
import { getProductImage } from '../utils/imageUtils'
import { FaShoppingCart, FaStar, FaPencilAlt, FaTrash } from 'react-icons/fa'
import { HiLocationMarker } from 'react-icons/hi'
import { MdRestaurantMenu, MdAccessTime } from 'react-icons/md'
import { FiShoppingCart } from 'react-icons/fi'
import { BsArrowRight } from 'react-icons/bs'
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
  const [selectedSizes, setSelectedSizes] = useState({}) // Track selected size for each product
  const [editingItem, setEditingItem] = useState(null) // Track which item is being edited
  const [editQuantity, setEditQuantity] = useState(1) // Quantity for editing
  const [editSize, setEditSize] = useState(null) // Selected size for editing
  const [sortBy, setSortBy] = useState('default') // Sort option
  const [currentTime, setCurrentTime] = useState(new Date()) // Current time for estimates

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
          errorMessage += `Server error: ${err.response.status} - ${err.response.statusText}`
        } else if (err.request) {
          errorMessage += 'Cannot connect to server. Please make sure the backend is running on http://localhost:5000'
        } else {
          errorMessage += err.message || 'Please try again later.'
        }
        
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  // Calculate estimated collection time (15-20 minutes from now)
  const getCollectionTime = () => {
    const now = new Date(currentTime)
    const minTime = new Date(now.getTime() + 15 * 60000) // 15 minutes
    const maxTime = new Date(now.getTime() + 20 * 60000) // 20 minutes
    
    const formatTime = (date) => {
      const hours = date.getHours()
      const minutes = date.getMinutes()
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    }
    
    return `${formatTime(minTime)} - ${formatTime(maxTime)}`
  }

  // Calculate estimated delivery time (30-45 minutes from now)
  const getDeliveryTime = () => {
    const now = new Date(currentTime)
    const minTime = new Date(now.getTime() + 30 * 60000) // 30 minutes
    const maxTime = new Date(now.getTime() + 45 * 60000) // 45 minutes
    
    const formatTime = (date) => {
      const hours = date.getHours()
      const minutes = date.getMinutes()
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    }
    
    return `${formatTime(minTime)} - ${formatTime(maxTime)}`
  }

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
      const imageUrl = getProductImage(
        item.product_name,
        item.category,
        item.image_url
      )
      
      acc[productId] = {
        product_id: productId,
        product_name: item.product_name,
        category: item.category,
        image_url: imageUrl,
        description: item.description || 'Delicious food item',
        rating: Math.floor(Math.random() * 2) + 3, // Random rating 3-4 for demo
        items: []
      }
    }
    acc[productId].items.push(item)
    return acc
  }, {})

  // Sort products based on selected sort option
  const sortedProducts = Object.values(groupedProducts).sort((a, b) => {
    if (sortBy === 'price-low') {
      // Sort by lowest price (smallest size)
      const aMinPrice = Math.min(...a.items.map(item => parseFloat(item.price)))
      const bMinPrice = Math.min(...b.items.map(item => parseFloat(item.price)))
      return aMinPrice - bMinPrice
    } else if (sortBy === 'price-high') {
      // Sort by highest price (largest size)
      const aMaxPrice = Math.max(...a.items.map(item => parseFloat(item.price)))
      const bMaxPrice = Math.max(...b.items.map(item => parseFloat(item.price)))
      return bMaxPrice - aMaxPrice
    } else if (sortBy === 'small-size') {
      // Sort by smallest size price
      const aMinPrice = Math.min(...a.items.map(item => parseFloat(item.price)))
      const bMinPrice = Math.min(...b.items.map(item => parseFloat(item.price)))
      return aMinPrice - bMinPrice
    }
    // Default: no sorting
    return 0
  })

  // Auto-select first size for products with only one size
  useEffect(() => {
    const newSelectedSizes = {}
    Object.values(groupedProducts).forEach(product => {
      if (product.items.length === 1) {
        newSelectedSizes[product.product_id] = product.items[0]
      }
    })
    if (Object.keys(newSelectedSizes).length > 0) {
      setSelectedSizes(prev => {
        const updated = { ...prev }
        Object.keys(newSelectedSizes).forEach(productId => {
          if (!updated[productId]) {
            updated[productId] = newSelectedSizes[productId]
          }
        })
        return updated
      })
    }
  }, [filteredItems.length]) // Only run when filtered items change

  const handleSizeSelect = (productId, item) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: item
    }))
  }

  const handleAddToCart = (product) => {
    const selectedItem = selectedSizes[product.product_id]
    
    // If editing, remove the old item first
    if (editingItem) {
      removeFromCart(editingItem)
      setEditingItem(null)
    }
    
    if (!selectedItem) {
      // If no size selected, use the first available item
      if (product.items.length > 0) {
        const firstItem = product.items[0]
        addToCart({
          id: Date.now(),
          item_id: firstItem.item_id,
          name: product.product_name,
          price: parseFloat(firstItem.price),
          size: firstItem.size || null,
          quantity: editQuantity || 1,
          notes: firstItem.size ? `${firstItem.size} size` : '',
          category: product.category
        })
      }
      setEditQuantity(1)
      return
    }

    addToCart({
      id: Date.now(),
      item_id: selectedItem.item_id,
      name: product.product_name,
      price: parseFloat(selectedItem.price),
      size: selectedItem.size || null,
      quantity: editQuantity || 1,
      notes: selectedItem.size ? `${selectedItem.size} size` : '',
      category: product.category
    })
    
    setEditQuantity(1)
  }

  const handleEditItem = (cartItem) => {
    // Find the product for this cart item
    const product = Object.values(groupedProducts).find(
      p => p.product_name === cartItem.name
    )
    
    if (product) {
      // Find the matching item by size
      const matchingItem = product.items.find(
        item => item.size === cartItem.size || (!item.size && !cartItem.size)
      ) || product.items[0]
      
      setEditingItem(cartItem.id)
      setEditQuantity(cartItem.quantity || 1)
      setEditSize(matchingItem)
      
      // Pre-select the size in the product
      setSelectedSizes(prev => ({
        ...prev,
        [product.product_id]: matchingItem
      }))
      
      // Scroll to the product card after a short delay to ensure DOM is updated
      setTimeout(() => {
        const productCard = document.getElementById(`product-${product.product_id}`)
        if (productCard) {
          productCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
          // Highlight the card temporarily
          productCard.style.boxShadow = '0 0 0 3px #ffb800'
          setTimeout(() => {
            productCard.style.boxShadow = ''
          }, 2000)
        }
      }, 100)
    }
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items to cart first.')
      return
    }
    navigate('/checkout')
  }

  // Star rating component
  const StarRating = ({ rating }) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={star <= rating ? 'star-filled' : 'star-empty'}
          />
        ))}
      </div>
    )
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

      <div className="menu-main-wrapper">
        {/* Left Sidebar - Categories */}
        <div className="menu-categories-panel">
          <div className="menu-panel-header">
            <MdRestaurantMenu className="menu-panel-icon" />
            <h2 className="menu-panel-title">Menu</h2>
          </div>
          <div className="category-buttons-list">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Center - Products Section */}
        <div className="menu-products-area">
          <div className="menu-products-header">
            <h1 className="menu-main-title">
              {selectedCategory 
                ? `Order from ${selectedCategory} premium` 
                : 'Order from Menu premium'}
            </h1>
            <div className="menu-sort-dropdown">
              <select 
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Sort by Pricing</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="small-size">Small Size</option>
              </select>
            </div>
          </div>

          <div className="menu-products-grid">
            {sortedProducts.map((product) => (
              <div 
                key={product.product_id} 
                id={`product-${product.product_id}`}
                className="menu-product-card"
              >
                <div className="product-card-content">
                  {/* Left side - Product Info */}
                  <div className="product-info-section">
                    <h3 className="product-title">{product.product_name}</h3>
                    <StarRating rating={product.rating} />
                    <p className="product-description">{product.description}</p>
                    
                    {/* Size Options - Selectable */}
                    <div className="product-sizes-list">
                      {product.items.map((item) => {
                        const isSelected = selectedSizes[product.product_id]?.item_id === item.item_id
                        return (
                          <button
                            key={item.item_id}
                            className={`size-option-container ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleSizeSelect(product.product_id, item)}
                          >
                            <span className="size-text">{item.size || 'Standard'}</span>
                            <div className="price-badge-yellow">
                              <span className="price-amount">RS {parseFloat(item.price).toFixed(2)}</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                    
                    {/* Quantity Selector (shown when editing this product) */}
                    {editingItem && (() => {
                      // Check if this product is the one being edited
                      const cartItem = cart.find(item => item.id === editingItem)
                      const isEditingThisProduct = cartItem && cartItem.name === product.product_name
                      
                      return isEditingThisProduct ? (
                        <div className="edit-quantity-controls">
                          <label>Quantity:</label>
                          <div className="quantity-selector">
                            <button 
                              className="qty-btn-minus"
                              onClick={() => setEditQuantity(Math.max(1, editQuantity - 1))}
                            >
                              -
                            </button>
                            <span className="qty-display">{editQuantity}</span>
                            <button 
                              className="qty-btn-plus"
                              onClick={() => setEditQuantity(editQuantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ) : null
                    })()}
                    
                    {/* Single Add to Cart Button */}
                    {(() => {
                      const cartItem = cart.find(item => item.id === editingItem)
                      const isEditingThisProduct = cartItem && cartItem.name === product.product_name
                      
                      return (
                        <>
                          <button 
                            className={`add-to-cart-main-button ${isEditingThisProduct ? 'editing' : ''}`}
                            onClick={() => handleAddToCart(product)}
                          >
                            <FaShoppingCart className="cart-button-icon" />
                            {isEditingThisProduct ? 'Update Cart' : 'Add to Cart'}
                          </button>
                          
                          {isEditingThisProduct && (
                            <button 
                              className="cancel-edit-button"
                              onClick={() => {
                                setEditingItem(null)
                                setEditQuantity(1)
                                setEditSize(null)
                              }}
                            >
                              Cancel
                            </button>
                          )}
                        </>
                      )
                    })()}
                  </div>

                  {/* Right side - Product Image */}
                  <div className="product-image-section">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.product_name} 
                        className="product-image"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          const placeholder = e.target.nextElementSibling
                          if (placeholder) placeholder.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div 
                      className="product-image-placeholder"
                      style={{ display: product.image_url ? 'none' : 'flex' }}
                    >
                      {product.category === 'Pizza' ? '🍕' :
                       product.category === 'Burgers' ? '🍔' :
                       product.category === 'Fries' ? '🍟' :
                       product.category === 'Drinks' ? '🥤' :
                       product.category === 'Desserts' ? '🍰' :
                       product.category === 'Wings' ? '🍗' :
                       product.category === 'Pasta' ? '🍝' :
                       product.category === 'Salad' ? '🥗' : '🍽️'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredItems.length === 0 && (
              <div className="no-items-message">
                <p>No items found in this category.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Cart */}
        <div className="menu-cart-panel">
          <div className="cart-panel-header">
            <FiShoppingCart className="cart-panel-icon" />
            <h2 className="cart-panel-title">My Basket</h2>
          </div>

          <div className="cart-items-list">
            {cart.length === 0 ? (
              <p className="empty-cart-message">Your cart is empty</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <div className="cart-quantity-badge">
                    <span className="quantity-number">{item.quantity || 1}x</span>
                  </div>
                  <div className="cart-item-info">
                    <p className="cart-item-title">RS {parseFloat(item.price).toFixed(2)}, {item.name}</p>
                    {(item.size || item.notes) && (
                      <p className="cart-item-modifiers">
                        {item.size && item.size}
                        {item.size && item.notes && ' + '}
                        {item.notes && item.notes.replace(' size', '')}
                      </p>
                    )}
                  </div>
                  <div className="cart-item-actions">
                    <button 
                      className="cart-edit-btn"
                      onClick={() => handleEditItem(item)}
                      title="Edit item"
                    >
                      <FaPencilAlt />
                    </button>
                    <button 
                      className="cart-delete-btn"
                      onClick={() => removeFromCart(item.id)}
                      title="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <>
              <div className="cart-divider-line"></div>
              
              <div className="cart-summary-section">
                <div className="summary-row">
                  <span>Sub Total:</span>
                  <span className="summary-value">RS {subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="summary-row">
                    <span>Discounts:</span>
                    <span className="summary-value">-RS {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Delivery Fee:</span>
                  <span className="summary-value">RS {deliveryFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="cart-total-section">
                <span className="total-label">Total to pay</span>
                <span className="total-amount">RS {total.toFixed(2)}</span>
              </div>

              <button className="free-item-button">
                Choose your free item..
                <BsArrowRight className="arrow-icon" />
              </button>

              <button 
                className="checkout-button"
                onClick={handleCheckout}
                data-checkout-button
              >
                Checkout!
                <BsArrowRight className="checkout-arrow" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Menu
