import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import weblogo from '../assets/images/logo/weblogo.png'
import '../styles/pages/Menu.css'

const Menu = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState([
    { id: 1, name: '12" Vegitarian Pizza', price: 500, quantity: 1, notes: 'No Mushrooms + green peppers' },
    { id: 2, name: '17" Tandoori Pizza', price: 1000, quantity: 1, notes: 'No Mushrooms + green peppers' },
    { id: 3, name: '12" Vegitarian Pizza', price: 800, quantity: 1, notes: 'No Mushrooms + green peppers' }
  ])

  const menuItems = [
    {
      id: 1,
      name: 'Burgers',
      description: '1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks',
      price: { small: 300, medium: 500, large: 1000, xl: 1500 },
      image: '/src/assets/images/fastfood_landingPage.jpg',
      rating: 4,
      favorite: false
    },
  
  ]

  const categories = ['Pizza', 'Burgers', 'Fries', 'Drinks']
  const [selectedCategory, setSelectedCategory] = useState('Burgers')
  const [selectedSizes, setSelectedSizes] = useState({})

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discount = 3.00
  const deliveryFee = 2.50
  const total = subtotal - discount + deliveryFee

  const handleSizeSelect = (itemId, size) => {
    setSelectedSizes({
      ...selectedSizes,
      [itemId]: size
    })
  }

  const handleAddToCart = (item) => {
    const selectedSize = selectedSizes[item.id] || 'small'
    const price = item.price[selectedSize]
    const newItem = {
      id: Date.now(),
      name: item.name,
      price: price,
      quantity: 1,
      notes: `${selectedSize.charAt(0).toUpperCase() + selectedSize.slice(1)} size`
    }
    setCart([...cart, newItem])
  }

  const handleCheckout = () => {
    navigate('/checkout')
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
                <p className="menu-section-title">Menu</p>
              </div>
              <div className="sort-filter">
                <select className="sort-select">
                  <option>Sort by Pricing</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
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
            {menuItems.map((item) => (
              <div key={item.id} className="menu-item-card">
                <div className="menu-item-image">
                  <img src={item.image} alt={item.name} />
                  {item.favorite && <span className="favorite-icon">❤️</span>}
                </div>
                <div className="menu-item-info">
                  <h3 className="menu-item-name">{item.name}</h3>
                  {item.rating > 0 && (
                    <div className="menu-item-rating">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`star ${i < item.rating ? 'filled' : ''}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="menu-item-description">{item.description}</p>
                  <div className="menu-item-sizes">
                    <button 
                      className={`size-btn ${selectedSizes[item.id] === 'small' ? 'active' : ''}`}
                      onClick={() => handleSizeSelect(item.id, 'small')}
                    >
                      Small RS {item.price.small}
                    </button>
                    <button 
                      className={`size-btn ${selectedSizes[item.id] === 'medium' ? 'active' : ''}`}
                      onClick={() => handleSizeSelect(item.id, 'medium')}
                    >
                      Medium RS {item.price.medium}
                    </button>
                    <button 
                      className={`size-btn ${selectedSizes[item.id] === 'large' ? 'active' : ''}`}
                      onClick={() => handleSizeSelect(item.id, 'large')}
                    >
                      Large RS {item.price.large}
                    </button>
                    <button 
                      className={`size-btn ${selectedSizes[item.id] === 'xl' ? 'active' : ''}`}
                      onClick={() => handleSizeSelect(item.id, 'xl')}
                    >
                      XL Large with Sauces RS {item.price.xl}
                    </button>
                  </div>
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(item)}
                  >
                    <span className="cart-icon-btn">🛒</span>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="menu-cart-sidebar">
          <div className="cart-header">
            <h2>Order Summary</h2>
          </div>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-quantity">{item.quantity}x</div>
                <div className="cart-item-details">
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-notes">{item.notes}</p>
                  <p className="cart-item-price">RS {item.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="cart-summary-row">
              <span>Sub Total:</span>
              <span>RS {subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Discounts:</span>
              <span>-{discount.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Delivery Fee:</span>
              <span>{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="cart-total">
              <span>Total to pay</span>
              <span className="cart-total-amount">RS {total.toFixed(2)}</span>
            </div>
          </div>
          <button className="order-confirmed-btn" onClick={handleCheckout} data-checkout-button>
            <span className="card-icon">💳</span>
            Order Confirmed
          </button>
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

