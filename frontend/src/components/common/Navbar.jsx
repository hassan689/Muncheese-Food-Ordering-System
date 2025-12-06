import { Link } from 'react-router-dom'
import weblogo from '../../assets/images/logo/weblogo.png'
import '../../styles/components/common/Navbar.css'

const Navbar = () => {
  // Simple check for admin login
  const adminToken = localStorage.getItem('adminToken')
  const adminUser = localStorage.getItem('adminUser')
  
  let isAdmin = false
  try {
    if (adminUser) {
      const user = JSON.parse(adminUser)
      isAdmin = user.role === 'admin'
    }
  } catch {
    // Invalid admin user data
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    window.location.href = '/'
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={weblogo} alt="Muncheese Logo" className="logo-img" />
        </Link>
        <div className="navbar-title">
          <h1>Muncheese</h1>
        </div>
        <ul className="navbar-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/orders">Orders</Link></li>
          {isAdmin && (
            <>
              <li><Link to="/admin">Admin</Link></li>
              <li><Link to="/admin/orders">Orders</Link></li>
              <li><Link to="/admin/customers">Customers</Link></li>
            </>
          )}
          {isAdmin ? (
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          ) : (
            <li><Link to="/login">Admin Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar

