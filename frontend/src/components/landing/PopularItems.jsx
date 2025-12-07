import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiLocationMarker } from 'react-icons/hi'
import { productService } from '../../services/productService'
import '../../styles/components/landing/PopularItems.css'

const PopularItems = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const getImageUrl = (item) => {
    // Use image_url from API if available
    if (item.image_url) {
      return item.image_url
    }
    // Fallback to category-based images
    const imageMap = {
      'Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      'Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
      'Wrap': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
      'Fries': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
      'Broast': 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop',
      'Hotwings': 'https://images.unsplash.com/photo-1527477396000-e27137b2c13f?w=400&h=300&fit=crop',
      'Chicken': 'https://images.unsplash.com/photo-1606755962773-d324e7882f35?w=400&h=300&fit=crop',
      'Dessert': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
      'Drink': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
      'Drinks': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
    }
    const category = item.category || ''
    // Try to match category
    for (const [key, url] of Object.entries(imageMap)) {
      if (category.toLowerCase().includes(key.toLowerCase())) {
        return url
      }
    }
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&q=80'
  }

  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        // Get 4 popular items from API
        const popularItemsData = await productService.getPopularItems(4)
        
        if (popularItemsData && popularItemsData.length > 0) {
          const formattedItems = popularItemsData.map((item) => ({
            id: item.item_id,
            name: item.product_name,
            location: `${item.category} Category`,
            price: `Rs${parseFloat(item.price).toFixed(0)}`,
            category: item.category,
            item_id: item.item_id,
            image_url: item.image_url
          }))
          
          setItems(formattedItems)
        } else {
          // Fallback to default items if no data
          setItems([
            { id: 1, name: 'Burger', location: 'Burger Arena', price: 'Rs388', category: 'Burgers' },
            { id: 2, name: 'Pizza', location: 'Pizza Arena', price: 'Rs100', category: 'Pizza' },
            { id: 3, name: 'Wrap', location: 'Wrap Arena', price: 'Rs232', category: 'Wraps' },
            { id: 4, name: 'Fries', location: 'Fries Arena', price: 'Rs500', category: 'Fries' },
          ])
        }
      } catch (error) {
        console.error('Error fetching popular items:', error)
        // Fallback to default items on error
        setItems([
          { id: 1, name: 'Burger', location: 'Burger Arena', price: 'Rs388', category: 'Burgers' },
          { id: 2, name: 'Pizza', location: 'Pizza Arena', price: 'Rs100', category: 'Pizza' },
          { id: 3, name: 'Wrap', location: 'Wrap Arena', price: 'Rs232', category: 'Wraps' },
          { id: 4, name: 'Fries', location: 'Fries Arena', price: 'Rs500', category: 'Fries' },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchPopularItems()
  }, [])

  if (loading) {
    return (
      <section className="popular-items">
        <div className="popular-items-container">
          <h2 className="section-title">Popular items</h2>
          <div className="items-grid">
            <p>Loading popular items...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="popular-items">
      <div className="popular-items-container">
        <h2 className="section-title">Popular items</h2>
        <div className="items-grid">
          {items.map(item => (
            <div key={item.id} className="item-card">
              <div className="item-image">
                <img 
                  src={getImageUrl(item)} 
                  alt={item.name}
                  className="item-image-img"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&q=80'
                  }}
                />
              </div>
              <div className="item-info">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-location"><HiLocationMarker className="location-icon" />{item.location}</p>
                <span className="item-price">{item.price}</span>
                <div className="item-footer">
                  <button className="order-btn" onClick={() => navigate('/menu')}>Order Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PopularItems
