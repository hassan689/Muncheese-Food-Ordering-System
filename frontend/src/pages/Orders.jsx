import { useNavigate } from 'react-router-dom'
import '../styles/pages/Orders.css'

const Orders = () => {
  const navigate = useNavigate()

  return (
    <div className="orders">
      <h1>Orders</h1>
      <p>View your order history or start a new order.</p>
      <button className="menu-btn" onClick={() => navigate('/menu')}>
        Browse Menu
      </button>
    </div>
  )
}

export default Orders

