# repositories/product_repository.py
from app.models.product import Product, ProductItem
from app.models.feedback import Feedback
from app.extensions import db
from sqlalchemy import func, desc

class ProductRepository:
    @staticmethod
    def get_all_items():
        """Get all product items"""
        return ProductItem.query.all()

    @staticmethod
    def get_item_by_id(item_id):
        """Get a product item by ID"""
        return ProductItem.query.get(item_id)

    @staticmethod
    def create_item(data):
        """Create a new product item"""
        # Handle product_id or product_name
        if "product_id" not in data or not data["product_id"]:
            if "product_name" in data:
                # Check if product with this name already exists
                product = Product.query.filter_by(name=data["product_name"]).first()
                if product:
                    # Use existing product
                    data["product_id"] = product.product_id
                    # Update description if provided and different
                    if "description" in data and data["description"]:
                        product.description = data["description"]
                else:
                    # Create new product
                    if "category" not in data:
                        raise ValueError("category is required when creating a new product")
                    product = Product(
                        name=data["product_name"], 
                        description=data.get("description"),
                        category=data["category"]
                    )
                    db.session.add(product)
                    db.session.flush()  # Get the product_id without committing
                    data["product_id"] = product.product_id
            else:
                raise ValueError("Either product_id or product_name must be provided")
        
        # Remove product_name, description, and category from item data
        item_data = {k: v for k, v in data.items() if k not in ["product_name", "description", "category"]}
        item = ProductItem(**item_data)
        db.session.add(item)
        db.session.commit()
        return item

    @staticmethod
    def update_item(item, data):
        """Update a product item"""
        # Handle product update if product_name, description, or category is provided
        if "product_name" in data and item.product:
            item.product.name = data.pop("product_name")
        if "description" in data and item.product:
            item.product.description = data.pop("description")
        if "category" in data and item.product:
            item.product.category = data.pop("category")
        
        # Update item fields
        for key, value in data.items():
            if hasattr(item, key):
                setattr(item, key, value)
        db.session.commit()
        return item

    @staticmethod
    def delete_item(item):
        """Delete a product item"""
        db.session.delete(item)
        db.session.commit()

    @staticmethod
    def get_all_products():
        """Get all products"""
        return Product.query.all()

    @staticmethod
    def get_product_by_id(product_id):
        """Get a product by ID"""
        return Product.query.get(product_id)

    @staticmethod
    def create_product_with_items(data):
        """Create a product with all its items in one go"""
        product_name = data.get("product_name")
        description = data.get("description")
        category = data.get("category")
        has_sizes = data.get("has_sizes", False)
        
        if not product_name:
            raise ValueError("product_name is required")
        if not category:
            raise ValueError("category is required")
        
        # Check if product already exists
        product = Product.query.filter_by(name=product_name).first()
        if product:
            raise ValueError(f"Product '{product_name}' already exists. Use update instead.")
        
        # Create the product
        product = Product(name=product_name, description=description, category=category)
        db.session.add(product)
        db.session.flush()  # Get the product_id without committing
        
        items = []
        
        if has_sizes:
            # Create 3 items for Small, Medium, Large
            prices = data.get("prices", {})
            image_urls = data.get("image_urls", {})  # Optional: {"Small": "url1", "Medium": "url2", "Large": "url3"}
            sizes = ["Small", "Medium", "Large"]
            
            for size in sizes:
                if size not in prices:
                    raise ValueError(f"Price for '{size}' size is required")
                
                item = ProductItem(
                    product_id=product.product_id,
                    size=size,
                    price=prices[size],
                    image_url=image_urls.get(size) if image_urls else None
                )
                items.append(item)
                db.session.add(item)
        else:
            # Create 1 item without size
            price = data.get("price")
            if price is None:
                raise ValueError("price is required when has_sizes is false")
            
            item = ProductItem(
                product_id=product.product_id,
                size=None,
                price=price,
                image_url=data.get("image_url")  # Optional single image URL
            )
            items.append(item)
            db.session.add(item)
        
        db.session.commit()
        return product, items

    @staticmethod
    def get_items_by_category(category):
        """Get all product items filtered by category"""
        return ProductItem.query.join(Product).filter(Product.category == category).all()

    @staticmethod
    def get_products_by_category(category):
        """Get all products filtered by category"""
        return Product.query.filter_by(category=category).all()

    @staticmethod
    def get_all_categories():
        """Get all unique categories"""
        categories = db.session.query(Product.category).distinct().all()
        return [cat[0] for cat in categories if cat[0]]  # Return list of category strings

    @staticmethod
    def get_popular_items(limit=4):
        """
        Get popular items for landing page.
        Returns one item from each category with highest reviews (average rating).
        If there are fewer than 4 categories, fills remaining slots with highest-rated items.
        """
        # Get all categories
        categories = db.session.query(Product.category).distinct().all()
        categories = [cat[0] for cat in categories if cat[0]]
        
        if not categories:
            return []
        
        popular_items = []
        used_categories = set()
        
        # For each category, find the item with highest average rating
        for category in categories:
            if len(popular_items) >= limit:
                break
            
            # Get items in this category with their average ratings
            category_items = db.session.query(
                ProductItem,
                func.avg(Feedback.no_of_stars).label('avg_rating'),
                func.count(Feedback.feedback_id).label('review_count')
            ).join(
                Product, ProductItem.product_id == Product.product_id
            ).outerjoin(
                Feedback, ProductItem.item_id == Feedback.item_id
            ).filter(
                Product.category == category
            ).group_by(
                ProductItem.item_id
            ).having(
                func.count(Feedback.feedback_id) > 0  # Only items with at least one review
            ).order_by(
                desc('avg_rating'), desc('review_count')
            ).all()
            
            if category_items:
                # Get the item with highest rating (first in the ordered list)
                item_with_rating = category_items[0]
                item = item_with_rating[0]
                popular_items.append(item)
                used_categories.add(category)
            else:
                # If no items with reviews in this category, get the cheapest item
                fallback_item = db.session.query(ProductItem).join(
                    Product, ProductItem.product_id == Product.product_id
                ).filter(
                    Product.category == category
                ).order_by(ProductItem.price).first()
                
                if fallback_item:
                    popular_items.append(fallback_item)
                    used_categories.add(category)
        
        # If we have fewer than limit items, fill with highest-rated items from any category
        if len(popular_items) < limit:
            remaining = limit - len(popular_items)
            
            # Get all items with ratings, excluding already selected ones
            selected_item_ids = [item.item_id for item in popular_items]
            
            additional_items = db.session.query(
                ProductItem,
                func.avg(Feedback.no_of_stars).label('avg_rating'),
                func.count(Feedback.feedback_id).label('review_count')
            ).outerjoin(
                Feedback, ProductItem.item_id == Feedback.item_id
            ).filter(
                ~ProductItem.item_id.in_(selected_item_ids) if selected_item_ids else True
            ).group_by(
                ProductItem.item_id
            ).having(
                func.count(Feedback.feedback_id) > 0  # Only items with at least one review
            ).order_by(
                desc('avg_rating'), desc('review_count')
            ).limit(remaining).all()
            
            for item_with_rating in additional_items:
                if len(popular_items) >= limit:
                    break
                popular_items.append(item_with_rating[0])
        
        # If still fewer than limit, add items without reviews (by price, lowest first)
        if len(popular_items) < limit:
            remaining = limit - len(popular_items)
            selected_item_ids = [item.item_id for item in popular_items]
            
            items_without_reviews = ProductItem.query.filter(
                ~ProductItem.item_id.in_(selected_item_ids) if selected_item_ids else True
            ).order_by(ProductItem.price).limit(remaining).all()
            
            popular_items.extend(items_without_reviews)
        
        return popular_items[:limit]

