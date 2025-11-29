import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  HiViewGrid, 
  HiMenu, 
  HiShoppingBag, 
  HiDocumentText,
  HiArrowLeft,
  HiBell
} from 'react-icons/hi'
import weblogo from '../../assets/images/logo/weblogo.png'
import '../../styles/components/admin/AdminLayout.css'

const AdminLayout = ({ children, title }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: HiViewGrid },
    { path: '/admin/menu', label: 'Menu', icon: HiMenu },
    { path: '/admin/orders', label: 'Orders', icon: HiShoppingBag },
    { path: '/admin/reports', label: 'Reports', icon: HiDocumentText }
  ]

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/login')
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <img src={weblogo} alt="Muncheese Logo" className="logo-img" />
          <span className="logo-text">Muncheese</span>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="nav-icon" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          <span className="logout-icon">→</span>
          <span>Logout</span>
        </button>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <HiArrowLeft />
            </button>
            <h1 className="page-title">{title}</h1>
          </div>
          <div className="header-right">
            <button className="notification-btn">
              <HiBell />
            </button>
            <div className="profile-picture">
              <img 
                src="https://ui-avatars.com/api/?name=Admin&background=ffb800&color=fff" 
                alt="Profile" 
              />
            </div>
          </div>
        </header>

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

