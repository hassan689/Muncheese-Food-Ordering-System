# controllers/product_controller.py
from flask import request, jsonify
from app.services.product_service import ProductService

class ProductController:
    @staticmethod
    def get_all_items():
        """Get all product items"""
        items = ProductService.get_all_items()
        return jsonify([item.to_dict() for item in items]), 200

    @staticmethod
    def create_item():
        """Create a new product item"""
        data = request.json
        try:
            item = ProductService.create_item(data)
            return jsonify(item.to_dict()), 201
        except ValueError as e:
            return jsonify({"message": str(e)}), 400
        except Exception as e:
            return jsonify({"message": "Error creating item", "error": str(e)}), 500

    @staticmethod
    def update_item(item_id):
        """Update a product item"""
        data = request.json
        item = ProductService.update_item(item_id, data)
        if not item:
            return jsonify({"message": "Item not found"}), 404
        return jsonify(item.to_dict()), 200

    @staticmethod
    def delete_item(item_id):
        """Delete a product item"""
        success = ProductService.delete_item(item_id)
        if not success:
            return jsonify({"message": "Item not found"}), 404
        return jsonify({"message": "Item deleted successfully"}), 200

    @staticmethod
    def create_product():
        """Create a product with all its items in one request"""
        data = request.json
        try:
            product, items = ProductService.create_product_with_items(data)
            return jsonify({
                "product": product.to_dict(),
                "items": [item.to_dict() for item in items],
                "message": "Product created successfully"
            }), 201
        except ValueError as e:
            return jsonify({"message": str(e)}), 400
        except Exception as e:
            return jsonify({"message": "Error creating product", "error": str(e)}), 500

    @staticmethod
    def get_items_by_category():
        """Get all product items filtered by category"""
        category = request.args.get("category")
        if not category:
            return jsonify({"message": "category parameter is required"}), 400
        
        items = ProductService.get_items_by_category(category)
        return jsonify([item.to_dict() for item in items]), 200

    @staticmethod
    def get_products_by_category():
        """Get all products filtered by category"""
        category = request.args.get("category")
        if not category:
            return jsonify({"message": "category parameter is required"}), 400
        
        products = ProductService.get_products_by_category(category)
        return jsonify([product.to_dict() for product in products]), 200

    @staticmethod
    def get_all_categories():
        """Get all unique categories"""
        categories = ProductService.get_all_categories()
        return jsonify({"categories": categories, "count": len(categories)}), 200

