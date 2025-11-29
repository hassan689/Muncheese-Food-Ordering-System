import { FaStar } from 'react-icons/fa'
import { HiTag, HiLocationMarker } from 'react-icons/hi'
import { MdLocalShipping } from 'react-icons/md'
import '../../styles/components/landing/Reviews.css'

const Reviews = () => {
  const reviews = [
    {
      id: 1,
      name: 'Ali Khan',
      location: 'Kota, Rajasthan',
      rating: 5,
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Hassan',
      location: 'New Delhi',
      rating: 4,
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Ahmed',
      location: 'Mumbai',
      rating: 3,
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop&crop=face'
    }
  ]

  const benefits = [
    {
      id: 1,
      title: 'Daily Discounts',
      icon: HiTag
    },
    {
      id: 2,
      title: 'Live Tracing',
      icon: HiLocationMarker
    },
    {
      id: 3,
      title: 'Quick Delivery',
      icon: MdLocalShipping
    }
  ]

  return (
    <section className="reviews">
      <div className="reviews-container">
        <h2 className="section-title">What people are saying about us</h2>
        <div className="reviews-grid">
          {reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={`star ${i < review.rating ? 'filled' : ''}`} />
                ))}
              </div>
              <p className="review-comment">{review.comment}</p>
              <div className="review-author">
                <img 
                  src={review.avatar} 
                  alt={review.name}
                  className="review-avatar"
                  onError={(e) => {
                    e.target.src = 'https://ui-avatars.com/api/?name=' + review.name + '&background=ffb800&color=fff'
                  }}
                />
                <div className="review-author-info">
                  <p className="review-name">{review.name}</p>
                  <p className="review-location">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="benefits-card">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <div key={benefit.id} className={`benefit-item ${index < benefits.length - 1 ? 'with-divider' : ''}`}>
                <IconComponent className="benefit-icon" />
                <div className="benefit-title">{benefit.title}</div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="reviews-wave"></div>
    </section>
  )
}

export default Reviews




