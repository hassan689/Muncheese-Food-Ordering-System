import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiLocationMarker } from 'react-icons/hi'
import { MdMyLocation } from 'react-icons/md'
import { ImSpinner2 } from 'react-icons/im'
import '../../styles/components/landing/Hero.css'

const Hero = () => {
  const navigate = useNavigate()
  const [address, setAddress] = useState('')
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [locationError, setLocationError] = useState('')
  const [orderType, setOrderType] = useState('delivery')

  // Load saved address from localStorage on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem('userAddress')
    if (savedAddress) {
      setAddress(savedAddress)
    }
  }, [])

  // Function to get address from coordinates using reverse geocoding
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      // Using Nominatim (OpenStreetMap) - free and no API key required
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Muncheese Food Ordering App'
          }
        }
      )
      
      if (!response.ok) {
        throw new Error('Geocoding failed')
      }
      
      const data = await response.json()
      if (data && data.address) {
        const addr = data.address
        const addressParts = []
        if (addr.road) addressParts.push(addr.road)
        if (addr.house_number) addressParts.push(addr.house_number)
        if (addr.suburb || addr.neighbourhood) addressParts.push(addr.suburb || addr.neighbourhood)
        if (addr.city || addr.town || addr.village) addressParts.push(addr.city || addr.town || addr.village)
        if (addr.postcode) addressParts.push(addr.postcode)
        
        return addressParts.length > 0 
          ? addressParts.join(', ')
          : data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      }
      
      // Fallback to display_name or coordinates
      return data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
    } catch (error) {
      console.error('Geocoding error:', error)
      // Fallback to coordinates if geocoding fails
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
    }
  }

  // Function to get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      return
    }

    setIsGettingLocation(true)
    setLocationError('')

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        // Store coordinates in localStorage
        localStorage.setItem('userLatitude', latitude.toString())
        localStorage.setItem('userLongitude', longitude.toString())
        
        try {
          // Try to get address from coordinates
          const addressText = await getAddressFromCoordinates(latitude, longitude)
          setAddress(addressText)
          localStorage.setItem('userAddress', addressText)
        } catch (error) {
          // If geocoding fails, use coordinates
          const coordAddress = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          setAddress(coordAddress)
          localStorage.setItem('userAddress', coordAddress)
        }
        
        setIsGettingLocation(false)
      },
      (error) => {
        setIsGettingLocation(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please enable location permissions.')
            break
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.')
            break
          case error.TIMEOUT:
            setLocationError('Location request timed out.')
            break
          default:
            setLocationError('An unknown error occurred while getting location.')
            break
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  const handleFindFood = () => {
    if (address.trim()) {
      // Navigate to menu page with address
      navigate('/menu')
    } else {
      setLocationError('Please enter an address or use current location')
    }
  }

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Are you starving?</h1>
          <p className="hero-subtitle">Within a few clicks, find meals that are accessible near you</p>
          
          <div className="hero-order-card">
            <div className="order-tabs">
              <button 
                className={`tab ${orderType === 'delivery' ? 'active' : ''}`}
                onClick={() => setOrderType('delivery')}
              >
                Delivery
              </button>
              <button 
                className={`tab ${orderType === 'pickup' ? 'active' : ''}`}
                onClick={() => setOrderType('pickup')}
              >
                Pickup
              </button>
            </div>
            
            <div className="order-form">
              <div className="address-input">
                <HiLocationMarker className="icon" />
                <input 
                  type="text" 
                  placeholder="Enter Your Address" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <button 
                  className="get-location-btn"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  title="Get current location"
                >
                  {isGettingLocation ? <ImSpinner2 className="spinner-icon" /> : <MdMyLocation />}
                </button>
              </div>
              <button 
                className="find-food-btn"
                onClick={handleFindFood}
              >
                Find Food
              </button>
            </div>
            {locationError && (
              <div className="location-error">
                {locationError}
              </div>
            )}
            {isGettingLocation && (
              <div className="location-loading">
                Getting your location...
              </div>
            )}
          </div>
        </div>
        
        <div className="hero-image">
          <div className="food-image-placeholder">
            <img src="/src/assets/images/fastfood_landingPage.jpg" alt="Food Image" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

