from app.extensions import db
from datetime import datetime

class Payment(db.Model):
    __tablename__ = "payments"
    
    payment_id = db.Column(db.Integer, primary_key=True)
    
    # Foreign Key: Links to 'orders' table
    order_id = db.Column(db.Integer, db.ForeignKey("orders.order_id"), nullable=False)
    
    method = db.Column(db.String(20)) # e.g., 'cash', 'online'
    
    # Nullable=True because 'cash' payments won't have a screenshot
    screenshot_url = db.Column(db.String(255), nullable=True) 
    
    amount = db.Column(db.Float, nullable=False)
    payment_date = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "payment_id": self.payment_id,
            "method": self.method,
            "amount": self.amount,
            "screenshot": self.screenshot_url,
            "date": self.payment_date.isoformat()
        }