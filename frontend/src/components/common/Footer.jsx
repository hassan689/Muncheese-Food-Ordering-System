import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/components/common/Footer.css'

const Footer = () => {
  const [email, setEmail] = useState('')

  const cities = [
    'Lahore'
  ]

  const handleSubscribe = (e) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log('Subscribed:', email)
    setEmail('')
    alert('Thank you for subscribing!')
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top Cities Section */}
        <div className="footer-top-cities">
          <h3 className="cities-heading">Our top cities</h3>
          <div className="cities-grid">
            {cities.map((city, index) => (
              <a key={index} href="#" className="city-link">{city}</a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Bottom Section */}
        <div className="footer-bottom-section">
          {/* Left Side - Links */}
          <div className="footer-links-section">
            <div className="footer-link-column">
              <h4 className="footer-column-heading">Company</h4>
              <ul className="footer-link-list">
                <li><Link to="/">About us</Link></li>
                <li><Link to="/">Team</Link></li>
                <li><Link to="/">Careers</Link></li>
                <li><Link to="/">Blog</Link></li>
              </ul>
            </div>

            <div className="footer-link-column">
              <h4 className="footer-column-heading">Contact</h4>
              <ul className="footer-link-list">
                <li><Link to="/contact">Help & Support</Link></li>
                <li><Link to="/">Partner with us</Link></li>
                <li><Link to="/">Ride with us</Link></li>
              </ul>
            </div>

            <div className="footer-link-column">
              <h4 className="footer-column-heading">Legal</h4>
              <ul className="footer-link-list">
                <li><Link to="/">Terms & Conditions</Link></li>
                <li><Link to="/">Refund & Cancellation</Link></li>
                <li><Link to="/">Privacy Policy</Link></li>
                <li><Link to="/">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>

          {/* Right Side - Social & Newsletter */}
          <div className="footer-social-section">
            <h4 className="footer-column-heading">FOLLOW US</h4>
            <div className="social-icons">
              <a href="#" className="social-icon instagram" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="#" className="social-icon facebook" aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 5.013 3.693 9.153 8.505 9.876v-6.988H8.031V12h2.474V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.888h-2.33v6.988C18.307 21.153 22 17.013 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </a>
              <a href="#" className="social-icon twitter" aria-label="Twitter">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </a>
            </div>
            <p className="newsletter-text">Receive exclusive offers in your mailbox</p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <div className="newsletter-input-wrapper">
                <svg className="envelope-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  type="email"
                  placeholder="Enter Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                  required
                />
              </div>
              <button type="submit" className="subscribe-btn">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

