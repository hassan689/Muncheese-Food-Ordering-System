
from app.extensions import db
from datetime import datetime

class Order(db.Model):
    __tablename__ = "orders"

    # Primary Key: Unique ID for every order
    order_id = db.Column(db.Integer, primary_key=True)
    
    # Foreign Key: Links this order to a specific row in the 'users' table
    customer_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    
    # Status: Tracks the lifecycle (pending -> location_verified -> paid -> completed)
    status = db.Column(db.String(20), default="pending") 
    
    # Financials
    total_amount = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    # Notice we use STRINGS "DeliveryInfo" and "Payment" instead of importing the classes.
    # This prevents Python from getting confused by circular imports.
    # UPDATE THESE LINES:
    delivery_info = db.relationship(
        "DeliveryInfo", 
        backref="order", 
        uselist=False, 
        cascade="all, delete-orphan" # <--- ADD THIS
    )
    
    payment = db.relationship(
        "Payment", 
        backref="order", 
        uselist=False, 
        cascade="all, delete-orphan" # <--- ADD THIS
    )
    # Relationship to User (Optional, but helps you do order.customer.name)
    customer = db.relationship("User", backref="orders", lazy=True)

    def to_dict(self):
        payment_info = None
        if self.payment:
            payment_info = {
                "method": self.payment.method,
                "amount": float(self.payment.amount) if self.payment.amount else None,
                "screenshot": self.payment.screenshot_url,
                "date": self.payment.payment_date.isoformat() if self.payment.payment_date else None
            }
        
        return {
            "order_id": self.order_id,
            "status": self.status,
            "total_amount": self.total_amount,
            "created_at": self.created_at.isoformat(),
            "customer_id": self.customer_id,
            "payment": payment_info
        }