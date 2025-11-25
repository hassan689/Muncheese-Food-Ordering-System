# models/product.py
from app.extensions import db

class Product(db.Model):
    __tablename__ = "products"

    product_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(50), nullable=False)  # e.g., "Pizza", "Burgers", "Drinks", "Desserts"
    
    # Relationship to ProductItems
    items = db.relationship("ProductItem", back_populates="product", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "product_id": self.product_id,
            "name": self.name,
            "description": self.description,
            "category": self.category,
            "items": [item.to_dict() for item in self.items] if self.items else []
        }

class ProductItem(db.Model):
    __tablename__ = "product_items"

    item_id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.product_id"), nullable=False)
    size = db.Column(db.String(50), nullable=True)  # e.g., "Small", "Medium", "Large" or None
    price = db.Column(db.Numeric(10, 2), nullable=False)
    
    # Relationship to Product
    product = db.relationship("Product", back_populates="items")

    def to_dict(self):
        return {
            "item_id": self.item_id,
            "product_id": self.product_id,
            "product_name": self.product.name if self.product else None,
            "category": self.product.category if self.product else None,
            "size": self.size,
            "price": float(self.price) if self.price else None,
        }

