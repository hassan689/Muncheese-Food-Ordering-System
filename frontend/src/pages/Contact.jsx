import { useNavigate } from 'react-router-dom'
import '../styles/pages/Contact.css'

const Contact = () => {
  const navigate = useNavigate()

  const contactInfo = [
    {
      id: 1,
      title: 'OUR MAIN OFFICE',
      icon: '📍',
      details: ['SoHo 94 Broadway St', 'New York, NY 1001']
    },
    {
      id: 2,
      title: 'PHONE NUMBER',
      icon: '📞',
      details: ['234-9876-5400', '888-0123-4567 (Toll Free)']
    },
    {
      id: 3,
      title: 'FAX',
      icon: '📠',
      details: ['1-234-567-8900']
    },
    {
      id: 4,
      title: 'EMAIL',
      icon: '✉️',
      details: ['hello@theme.com']
    }
  ]

  return (
    <div className="contact-page">
      <div className="contact-header">
        <div className="contact-nav">
          <button className="nav-btn" onClick={() => navigate('/checkout')}>
            Checkout
          </button>
          <button className="nav-btn" onClick={() => navigate('/order-tracking')}>
            Order Tracking
          </button>
          <button className="nav-btn" onClick={() => navigate('/menu')}>
            Menu
          </button>
        </div>
      </div>

      <div className="contact-container">
        <div className="contact-content">
          <h1 className="contact-title">How can we help you?</h1>
          <p className="contact-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>

          <div className="contact-cards-grid">
            {contactInfo.map((info) => (
              <div key={info.id} className="contact-card">
                <div className="contact-card-icon">
                  {info.icon}
                </div>
                <h3 className="contact-card-title">{info.title}</h3>
                <div className="contact-card-details">
                  {info.details.map((detail, index) => (
                    <p key={index} className="contact-detail-text">{detail}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact

