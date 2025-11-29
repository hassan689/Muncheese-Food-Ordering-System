import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/pages/LocationEntry.css'

const LocationEntry = () => {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')

  const handleConfirm = () => {
    if (location.trim()) {
      navigate('/order-tracking')
    }
  }
  return (
    <div className="location-entry-page">
      <div className="location-entry-overlay">
        <div className="location-entry-modal">
          <div className="location-entry-header">
            <h2>Enter Location</h2>
            <div className="location-marker-icon">
              <img src="/src/assets/images/fastfood_landingPage.jpg" alt="Location marker" />
            </div>
          </div>
          <div className="location-entry-content">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your delivery address"
              className="location-input"
            />
            <button 
              className="confirm-location-btn"
              onClick={handleConfirm}
              disabled={!location.trim()}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocationEntry

