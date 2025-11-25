# services/feedback_service.py
from app.repositories.feedback_repository import FeedbackRepository
from app.repositories.product_repository import ProductRepository
from app.repositories.user_repository import UserRepository
from datetime import datetime

class FeedbackService:
    @staticmethod
    def create_feedback(data):
        """Create a new feedback"""
        # Validate that item exists
        item = ProductRepository.get_item_by_id(data.get("item_id"))
        if not item:
            raise ValueError("Product item not found")
        
        # Validate that customer exists
        customer = UserRepository.get_by_id(data.get("customer_id"))
        if not customer:
            raise ValueError("Customer not found")
        
        # Validate rating is between 1 and 5
        no_of_stars = data.get("no_of_stars")
        if not no_of_stars or not isinstance(no_of_stars, int) or no_of_stars < 1 or no_of_stars > 5:
            raise ValueError("Rating must be between 1 and 5")
        
        # Set date if not provided
        if "date" not in data:
            data["date"] = datetime.utcnow()
        
        return FeedbackRepository.create(data)

    @staticmethod
    def get_reviews_by_item(item_id):
        """Get all reviews for a specific product item"""
        # Validate that item exists
        item = ProductRepository.get_item_by_id(item_id)
        if not item:
            return None
        
        feedbacks = FeedbackRepository.get_by_item_id(item_id)
        avg_rating_info = FeedbackRepository.get_average_rating_by_item_id(item_id)
        
        return {
            "item_id": item_id,
            "item_name": item.product.name if item.product else None,
            "item_size": item.size,
            "average_rating": avg_rating_info["avg_rating"],
            "review_count": avg_rating_info["review_count"],
            "reviews": [feedback.to_dict() for feedback in feedbacks]
        }

    @staticmethod
    def get_featured_reviews(limit=5):
        """Get top featured reviews"""
        return FeedbackRepository.get_featured_reviews(limit)

    @staticmethod
    def get_all_feedbacks():
        """Get all feedbacks"""
        return FeedbackRepository.get_all()

