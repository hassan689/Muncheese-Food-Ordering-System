# repositories/feedback_repository.py
from app.models.feedback import Feedback
from app.models.product import ProductItem
from app.extensions import db
from sqlalchemy import func, desc
from datetime import datetime

class FeedbackRepository:
    @staticmethod
    def create(data):
        """Create a new feedback"""
        feedback = Feedback(**data)
        db.session.add(feedback)
        db.session.commit()
        return feedback

    @staticmethod
    def get_by_item_id(item_id):
        """Get all feedbacks for a specific product item"""
        return Feedback.query.filter_by(item_id=item_id).order_by(desc(Feedback.date)).all()

    @staticmethod
    def get_by_customer_id(customer_id):
        """Get all feedbacks by a specific customer"""
        return Feedback.query.filter_by(customer_id=customer_id).order_by(desc(Feedback.date)).all()

    @staticmethod
    def get_featured_reviews(limit=5):
        """Get top 5 featured reviews based on highest average rating on menu items"""
        # First, calculate average rating for each item
        item_ratings = db.session.query(
            Feedback.item_id,
            func.avg(Feedback.no_of_stars).label('avg_rating'),
            func.count(Feedback.feedback_id).label('review_count')
        ).group_by(Feedback.item_id).having(func.count(Feedback.feedback_id) > 0).order_by(
            desc('avg_rating'), desc('review_count')
        ).limit(limit).all()

        # Get item_ids from the top rated items
        top_item_ids = [item.item_id for item in item_ratings]

        # Get one feedback from each of these top-rated items
        featured_feedbacks = []
        for item_id in top_item_ids:
            # Get the most recent feedback for this item
            feedback = Feedback.query.filter_by(item_id=item_id).order_by(
                desc(Feedback.date)
            ).first()
            if feedback:
                featured_feedbacks.append(feedback)
        
        # If we have less than limit, fill with other high-rated reviews
        if len(featured_feedbacks) < limit:
            remaining = limit - len(featured_feedbacks)
            existing_item_ids = [f.item_id for f in featured_feedbacks]
            additional = Feedback.query.filter(
                ~Feedback.item_id.in_(existing_item_ids) if existing_item_ids else True
            ).order_by(
                desc(Feedback.no_of_stars), desc(Feedback.date)
            ).limit(remaining).all()
            featured_feedbacks.extend(additional)

        return featured_feedbacks[:limit]

    @staticmethod
    def get_average_rating_by_item_id(item_id):
        """Get average rating for a specific item"""
        result = db.session.query(
            func.avg(Feedback.no_of_stars).label('avg_rating'),
            func.count(Feedback.feedback_id).label('review_count')
        ).filter_by(item_id=item_id).first()
        
        if result and result.avg_rating:
            return {
                'avg_rating': float(result.avg_rating),
                'review_count': result.review_count
            }
        return {
            'avg_rating': 0.0,
            'review_count': 0
        }

    @staticmethod
    def get_all():
        """Get all feedbacks"""
        return Feedback.query.order_by(desc(Feedback.date)).all()

