import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (item) => {
    setCart((prevCart) => {
      // Check if item already exists in cart (by item_id and size)
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.item_id === item.item_id && cartItem.size === item.size
      )

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].quantity += item.quantity || 1
        return updatedCart
      } else {
        // Add new item
        return [...prevCart, { ...item, quantity: item.quantity || 1 }]
      }
    })
  }

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId))
  }

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem('cart')
  }

  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => {
    const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0
    return sum + price * (item.quantity || 1)
  }, 0)

  // Delivery fee (can be made configurable)
  const deliveryFee = 2.50

  // Discount (can be calculated based on promotions)
  const discount = 0 // For now, no discount. Can be updated based on backend logic

  // Total calculation
  const total = subtotal - discount + deliveryFee

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    deliveryFee,
    total,
    itemCount: cart.reduce((sum, item) => sum + (item.quantity || 1), 0),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}



