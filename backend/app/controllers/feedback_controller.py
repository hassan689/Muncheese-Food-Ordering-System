# controllers/feedback_controller.py
from flask import request, jsonify
from app.services.feedback_service import FeedbackService

class FeedbackController:
    @staticmethod
    def add_feedback():
        """Add feedback after order completes"""
        data = request.json
        
        # Validate required fields
        required_fields = ["item_id", "customer_id", "no_of_stars"]
        for field in required_fields:
            if field not in data:
                return jsonify({"message": f"{field} is required"}), 400
        
        try:
            feedback = FeedbackService.create_feedback(data)
            return jsonify({
                "message": "Feedback added successfully",
                "feedback": feedback.to_dict()
            }), 201
        except ValueError as e:
            return jsonify({"message": str(e)}), 400
        except Exception as e:
            return jsonify({"message": "Error adding feedback", "error": str(e)}), 500

    @staticmethod
    def get_reviews_by_item(item_id):
        """Get reviews for a specific product item"""
        try:
            result = FeedbackService.get_reviews_by_item(item_id)
            if not result:
                return jsonify({"message": "Product item not found"}), 404
            return jsonify(result), 200
        except Exception as e:
            return jsonify({"message": "Error fetching reviews", "error": str(e)}), 500

    @staticmethod
    def get_featured_reviews():
        """Get top 5 featured reviews for landing page"""
        try:
            limit = request.args.get("limit", 5, type=int)
            feedbacks = FeedbackService.get_featured_reviews(limit)
            return jsonify({
                "featured_reviews": [feedback.to_dict() for feedback in feedbacks],
                "count": len(feedbacks)
            }), 200
        except Exception as e:
            return jsonify({"message": "Error fetching featured reviews", "error": str(e)}), 500

    @staticmethod
    def get_all_feedbacks():
        """Get all feedbacks (for admin purposes)"""
        try:
            feedbacks = FeedbackService.get_all_feedbacks()
            return jsonify({
                "feedbacks": [feedback.to_dict() for feedback in feedbacks],
                "count": len(feedbacks)
            }), 200
        except Exception as e:
            return jsonify({"message": "Error fetching feedbacks", "error": str(e)}), 500

