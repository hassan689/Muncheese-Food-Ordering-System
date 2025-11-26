from app.extensions import db

class DeliveryInfo(db.Model):
    __tablename__ = "delivery_info"
    
    # We remove the old 'id' column.
    
    # Make order_id BOTH the Foreign Key AND the Primary Key.
    order_id = db.Column(
        db.Integer, 
        db.ForeignKey("orders.order_id"), 
        primary_key=True,  # <--- This makes it the Primary Key
        nullable=False
    )
    
    address = db.Column(db.String(255), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    is_within_range = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "order_id": self.order_id, # This is now the identifier
            "address": self.address,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "valid": self.is_within_range
        }