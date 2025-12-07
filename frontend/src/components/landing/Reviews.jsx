import { useState, useEffect } from 'react'
import { FaStar } from 'react-icons/fa'
import { HiTag, HiLocationMarker } from 'react-icons/hi'
import { MdLocalShipping } from 'react-icons/md'
import { feedbackService } from '../../services/feedbackService'
import '../../styles/components/landing/Reviews.css'

const Reviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await feedbackService.getFeaturedReviews(3)
        if (data.featured_reviews && data.featured_reviews.length > 0) {
          // Transform API data to match component structure
          const transformedReviews = data.featured_reviews.map((review, index) => ({
            id: review.feedback_id,
            name: review.customer_name || 'Customer',
            location: 'Lahore, Pakistan', // Default location
            rating: review.no_of_stars || 5,
            comment: review.feedback_message || 'Great food and service!',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(review.customer_name || 'Customer')}&background=ffb800&color=fff`,
            itemName: review.item_name
          }))
          setReviews(transformedReviews)
        } else {
          // Fallback to default reviews if no data
          setReviews([
            {
              id: 1,
              name: 'Ali Khan',
              location: 'Kota, Rajasthan',
              rating: 5,
              comment: 'Excellent food quality and fast delivery. Highly recommended!',
              avatar: 'https://ui-avatars.com/api/?name=Ali+Khan&background=ffb800&color=fff'
            },
            {
              id: 2,
              name: 'Hassan',
              location: 'New Delhi',
              rating: 4,
              comment: 'Great service and tasty food. Will order again!',
              avatar: 'https://ui-avatars.com/api/?name=Hassan&background=ffb800&color=fff'
            },
            {
              id: 3,
              name: 'Ahmed',
              location: 'Mumbai',
              rating: 5,
              comment: 'Amazing experience! The food was fresh and delicious.',
              avatar: 'https://ui-avatars.com/api/?name=Ahmed&background=ffb800&color=fff'
            }
          ])
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
        // Fallback to default reviews on error
        setReviews([
          {
            id: 1,
            name: 'Ali Khan',
            location: 'Karachi, Pakistan',
            rating: 5,
            comment: 'Excellent food quality and fast delivery. Highly recommended!',
            avatar: 'https://ui-avatars.com/api/?name=Ali+Khan&background=ffb800&color=fff'
          },
          {
            id: 2,
            name: 'Hassan',
            location: 'Lahore, Pakistan',
            rating: 4,
            comment: 'Great service and tasty food. Will order again!',
            avatar: 'https://ui-avatars.com/api/?name=Hassan&background=ffb800&color=fff'
          },
          {
            id: 3,
            name: 'Ahmed',
            location: 'Islamabad, Pakistan',
            rating: 5,
            comment: 'Amazing experience! The food was fresh and delicious.',
            avatar: 'https://ui-avatars.com/api/?name=Ahmed&background=ffb800&color=fff'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

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

  if (loading) {
    return (
      <section className="reviews">
        <div className="reviews-container">
          <h2 className="section-title">What people are saying about us</h2>
          <div className="reviews-grid">
            <p>Loading reviews...</p>
          </div>
        </div>
      </section>
    )
  }

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
              {review.itemName && (
                <p className="review-item" style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                  Ordered: {review.itemName}
                </p>
              )}
              <div className="review-author">
                <img 
                  src={review.avatar} 
                  alt={review.name}
                  className="review-avatar"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=ffb800&color=fff`
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
