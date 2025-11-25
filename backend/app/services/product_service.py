# services/product_service.py
from app.repositories.product_repository import ProductRepository

class ProductService:
    @staticmethod
    def get_all_items():
        """Get all product items"""
        return ProductRepository.get_all_items()

    @staticmethod
    def get_item_by_id(item_id):
        """Get a product item by ID"""
        return ProductRepository.get_item_by_id(item_id)

    @staticmethod
    def create_item(data):
        """Create a new product item"""
        return ProductRepository.create_item(data)

    @staticmethod
    def update_item(item_id, data):
        """Update a product item"""
        item = ProductRepository.get_item_by_id(item_id)
        if not item:
            return None
        return ProductRepository.update_item(item, data)

    @staticmethod
    def delete_item(item_id):
        """Delete a product item"""
        item = ProductRepository.get_item_by_id(item_id)
        if not item:
            return False
        ProductRepository.delete_item(item)
        return True

    @staticmethod
    def create_product_with_items(data):
        """Create a product with all its items"""
        return ProductRepository.create_product_with_items(data)

    @staticmethod
    def get_items_by_category(category):
        """Get all product items filtered by category"""
        return ProductRepository.get_items_by_category(category)

    @staticmethod
    def get_products_by_category(category):
        """Get all products filtered by category"""
        return ProductRepository.get_products_by_category(category)

    @staticmethod
    def get_all_categories():
        """Get all unique categories"""
        return ProductRepository.get_all_categories()

