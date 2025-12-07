import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaShoppingBag } from 'react-icons/fa'
import { MdRestaurantMenu } from 'react-icons/md'
import weblogo from '../../assets/images/logo/weblogo.png'
import '../../styles/components/common/Navbar.css'

const Navbar = () => {
  const location = useLocation()
  
  // Hide navbar on login page
  if (location.pathname === '/login') {
    return null
  }
  
  // Pages with yellow backgrounds (navbar should be white)
  const yellowBackgroundPages = ['/', '/home', '/register', '/contact', '/feedback']
  
  // Check if current page has yellow background
  const hasYellowBackground = yellowBackgroundPages.includes(location.pathname)
  
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
    <nav className={`navbar ${hasYellowBackground ? 'navbar-white' : 'navbar-yellow'}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={weblogo} alt="Muncheese Logo" className="logo-img" />
        </Link>
        <div className="navbar-title">
          <h1>Muncheese</h1>
        </div>
        <ul className="navbar-menu">
          <li>
            <Link to="/">
              <FaHome className="nav-icon" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/menu">
              <MdRestaurantMenu className="nav-icon" />
              <span>Menu</span>
            </Link>
          </li>
          <li>
            <Link to="/orders">
              <FaShoppingBag className="nav-icon" />
              <span>Orders</span>
            </Link>
          </li>
          {isAdmin && (
            <>
              <li><Link to="/admin">Admin</Link></li>
              <li><Link to="/admin/orders">Orders</Link></li>
              <li><Link to="/admin/customers">Customers</Link></li>
            </>
          )}
          {isAdmin && (
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar

