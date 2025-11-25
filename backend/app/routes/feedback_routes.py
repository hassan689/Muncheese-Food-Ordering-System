# routes/feedback_routes.py
from flask import Blueprint
from app.controllers.feedback_controller import FeedbackController

feedback_bp = Blueprint("feedback", __name__)

# Add feedback after order completes
feedback_bp.route("", methods=["POST"])(FeedbackController.add_feedback)

# Get reviews for a specific product item (to display with menu items)
feedback_bp.route("/item/<int:item_id>", methods=["GET"])(FeedbackController.get_reviews_by_item)

# Get top 5 featured reviews (for landing page)
feedback_bp.route("/featured", methods=["GET"])(FeedbackController.get_featured_reviews)

# Get all feedbacks (optional, for admin)
feedback_bp.route("", methods=["GET"])(FeedbackController.get_all_feedbacks)

