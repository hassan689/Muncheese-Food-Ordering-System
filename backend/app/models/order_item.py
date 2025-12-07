# models/order_item.py
from app.extensions import db

class OrderItem(db.Model):
    __tablename__ = "order_items"

    order_item_id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.order_id"), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey("product_items.item_id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    price = db.Column(db.Numeric(10, 2), nullable=False)  # Price at time of order
    
    # Relationships
    order = db.relationship("Order", backref="order_items")
    product_item = db.relationship("ProductItem", lazy=True)

    def to_dict(self):
        product_item = self.product_item
        return {
            "order_item_id": self.order_item_id,
            "order_id": self.order_id,
            "item_id": self.item_id,
            "quantity": self.quantity,
            "price": float(self.price) if self.price else None,
            "name": product_item.product.name if product_item and product_item.product else None,
            "description": product_item.product.description if product_item and product_item.product else None,
            "size": product_item.size if product_item else None,
            "product_name": product_item.product.name if product_item and product_item.product else None,
            "category": product_item.product.category if product_item and product_item.product else None,
            "image_url": product_item.image_url if product_item else None
        }

