import { useNavigate } from 'react-router-dom'
import '../styles/pages/OrderConfirmationPopup.css'

const OrderConfirmationPopup = () => {
  const navigate = useNavigate()

  const handleNext = () => {
    navigate('/location-entry')
  }

  return (
    <div className="order-confirmation-popup-page" onClick={handleNext}>
      <div className="confirmation-popup-content">
        <div className="confirmation-image">
          <img src="/src/assets/images/hot-trending.svg" alt="Order Confirmed" />
        </div>
        <h1 className="confirmation-title">Order is Confirmed</h1>
      </div>
    </div>
  )
}

export default OrderConfirmationPopup

