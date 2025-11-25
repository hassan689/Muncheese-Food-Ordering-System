# models/feedback.py
from app.extensions import db
from datetime import datetime

class Feedback(db.Model):
    __tablename__ = "feedback"

    feedback_id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey("product_items.item_id"), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    no_of_stars = db.Column(db.Integer, nullable=False)  # Rating from 1 to 5
    feedback_message = db.Column(db.Text, nullable=True)

    # Relationships
    item = db.relationship("ProductItem", backref="feedbacks")
    customer = db.relationship("User", backref="feedbacks")

    def to_dict(self):
        return {
            "feedback_id": self.feedback_id,
            "item_id": self.item_id,
            "item_name": self.item.product.name if self.item and self.item.product else None,
            "item_size": self.item.size if self.item else None,
            "customer_id": self.customer_id,
            "customer_name": self.customer.name if self.customer else None,
            "date": self.date.isoformat() if self.date else None,
            "no_of_stars": self.no_of_stars,
            "feedback_message": self.feedback_message
        }

