import { useNavigate } from 'react-router-dom'
import { HiLocationMarker } from 'react-icons/hi'
import '../../styles/components/landing/PopularItems.css'

const PopularItems = () => {
  const navigate = useNavigate()
  const getImageUrl = (itemName) => {
    const imageMap = {
      'Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      'Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
      'Wrap': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
      'Fries': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
      'Broast': 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop',
      'Hotwings': 'https://images.unsplash.com/photo-1527477396000-e27137b2c13f?w=400&h=300&fit=crop',
    }
    const cleanName = itemName.trim() 
    return imageMap[cleanName] || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&q=80`
  }
  const items = [
    { id: 1, name: 'Burger', location: 'Burger Arena', price: 'Rs388' },
    { id: 2, name: 'Pizza', location: 'Pizza Arena', price: 'Rs100' },
    { id: 3, name: 'Wrap', location: 'Wrap Arena', price: 'Rs232' },
    { id: 4, name: 'Fries', location: 'Burger Arena', price: 'Rs500' },
    { id: 5, name: 'Broast', location: 'Burger Arena', price: 'Rs2343' },
    { id: 6, name: 'Hotwings', location: 'Burger Arena', price: 'Rs1234' },
  ]
  return (
    <section className="popular-items">
      <div className="popular-items-container">
        <h2 className="section-title">Popular items</h2>
        <div className="items-grid">
          {items.map(item => (
            <div key={item.id} className="item-card">
              <div className="item-image">
                <img 
                  src={getImageUrl(item.name)} 
                  alt={item.name}
                  className="item-image-img"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to a default image if the image fails to load
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

