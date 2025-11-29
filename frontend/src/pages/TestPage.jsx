import { useNavigate } from 'react-router-dom'
import '../styles/pages/TestPage.css'

const TestPage = () => {
  const navigate = useNavigate()

  const pages = [
    { path: '/', name: 'Home', description: 'Landing page with geolocation', category: 'Main' },
    { path: '/contact', name: 'Contact', description: 'Contact/Help page with office info', category: 'Main' },
    { path: '/register', name: 'Register', description: 'User registration page', category: 'Auth' },
    { path: '/login', name: 'Login', description: 'User login page', category: 'Auth' },
    { path: '/dashboard', name: 'Dashboard', description: 'User dashboard', category: 'User' },
    { path: '/orders', name: 'Orders', description: 'Orders list page', category: 'User' },
    { path: '/menu', name: 'Menu', description: 'Menu page with items and cart', category: 'Ordering' },
    { path: '/checkout', name: 'Checkout', description: 'Checkout page with delivery info', category: 'Ordering' },
    { path: '/order-confirmation', name: 'Order Confirmation', description: 'Order confirmation page', category: 'Ordering' },
    { path: '/order-confirmation-popup', name: 'Order Confirmation Popup', description: 'Order confirmation popup screen', category: 'Ordering' },
    { path: '/location-entry', name: 'Location Entry', description: 'Location entry modal', category: 'Ordering' },
    { path: '/order-tracking', name: 'Order Tracking', description: 'Order tracking with status timeline', category: 'Ordering' },
    { path: '/feedback', name: 'Feedback', description: 'Feedback page for completed orders', category: 'Ordering' },
    { path: '/admin', name: 'Admin Dashboard', description: 'Admin dashboard (protected)', category: 'Admin' },
    { path: '/admin/customers', name: 'Admin Customers', description: 'Admin customers page (protected)', category: 'Admin' }
  ]

  const categories = ['Main', 'Auth', 'User', 'Ordering', 'Admin']

  return (
    <div className="test-page">
      <div className="test-page-container">
        <div className="test-page-header">
          <h1>🧪 Test Page</h1>
          <p>Navigate to any page in the application</p>
        </div>

        {categories.map((category) => (
          <div key={category} className="test-category-section">
            <h2 className="test-category-title">{category}</h2>
            <div className="test-pages-grid">
              {pages
                .filter((page) => page.category === category)
                .map((page) => (
                  <div key={page.path} className="test-page-card">
                    <div className="test-page-card-content">
                      <h3 className="test-page-name">{page.name}</h3>
                      <p className="test-page-description">{page.description}</p>
                      <p className="test-page-path">{page.path}</p>
                    </div>
                    <button
                      className="test-page-button"
                      onClick={() => navigate(page.path)}
                    >
                      Go to Page
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}

        <div className="test-page-footer">
          <button className="test-home-button" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default TestPage

