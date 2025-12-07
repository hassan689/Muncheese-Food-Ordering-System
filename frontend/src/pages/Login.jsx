import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { userService } from '../services/userService'
import weblogo from '../assets/images/logo/weblogo.png'
import '../styles/pages/Login.css'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await userService.adminLogin(formData.username, formData.password)
      
      // Store admin login info
      localStorage.setItem('adminToken', response.token || 'admin_token')
      localStorage.setItem('adminUser', JSON.stringify(response.user))
      localStorage.setItem('adminUserId', response.user_id || response.user.user_id)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-content">
            <Link to="/" className="login-logo">
              <img src={weblogo} alt="Muncheese Logo" className="logo-img" />
              <span className="logo-text">Muncheese</span>
            </Link>
            
            <h1 className="login-heading">Admin Login</h1>
            <p className="login-subtitle">This page is for restaurant administrators only. Customers can order directly without login.</p>
            
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="login-input"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="login-input"
                  required
                />
              </div>
              {error && <div className="login-error">{error}</div>}
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
        
        <div className="login-right">
          <div className="login-right-content">
            <div className="admin-icon-wrapper">
              <svg className="admin-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H11V21H5V3H13V9H21ZM14 10V12H22V10H14ZM14 14V16H22V14H14ZM14 18V20H19V18H14Z" fill="currentColor"/>
              </svg>
            </div>
            <h2 className="login-right-title">Admin Portal</h2>
            <p className="login-right-subtitle">Manage your restaurant operations with ease</p>
            <div className="feature-list">
              <div className="feature-item">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
                </svg>
                <span>Order Management</span>
              </div>
              <div className="feature-item">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
                </svg>
                <span>Analytics & Reports</span>
              </div>
              <div className="feature-item">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
                </svg>
                <span>Menu Control</span>
              </div>
            </div>
          </div>
          <div className="login-right-pattern"></div>
        </div>
      </div>
    </div>
  )
}

export default Login

