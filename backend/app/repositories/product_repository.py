# repositories/product_repository.py
from app.models.product import Product, ProductItem
from app.extensions import db

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
        Returns one item per product (the one with the lowest price) up to the limit.
        """
        # Get all items
        all_items = ProductItem.query.all()
        
        if not all_items:
            return []
        
        # Group by product_id and get the cheapest item from each product
        product_map = {}
        
        for item in all_items:
            product_id = item.product_id
            
            if product_id not in product_map:
                product_map[product_id] = item
            else:
                # Keep the one with lower price
                existing = product_map[product_id]
                if float(item.price) < float(existing.price):
                    product_map[product_id] = item
        
        # Convert to list, sort by price (ascending), and take first 'limit' items
        popular_items = sorted(
            list(product_map.values()),
            key=lambda x: float(x.price)
        )[:limit]
        
        return popular_items

