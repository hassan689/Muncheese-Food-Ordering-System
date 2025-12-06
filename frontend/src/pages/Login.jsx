import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { userService } from '../services/userService'
import weblogo from '../assets/images/logo/weblogo.png'
import '../styles/pages/Login.css'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    address: '',
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
      // For now, use address as phone/email identifier
      const loginData = {
        phone: formData.address,
        password: formData.password
      }
      
      const response = await userService.login(loginData)
      
      // Only allow admin login
      if (response.user.role === 'admin') {
        // Store admin login info
        localStorage.setItem('adminToken', response.token)
        localStorage.setItem('adminUser', JSON.stringify(response.user))
        navigate('/admin')
      } else {
        setError('Only admin users can login')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
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
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
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
          <div className="login-illustration">
            <div className="food-item soda">
              <span>🥤</span>
            </div>
            <div className="food-item nuggets">
              <span>🍗</span>
            </div>
            <div className="food-item burger">
              <span>🍔</span>
            </div>
            <div className="food-item fries">
              <span>🍟</span>
            </div>
            <div className="curved-shape"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

