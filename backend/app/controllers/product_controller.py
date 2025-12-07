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
        """Create a new product item - supports both JSON (with image_url) and form-data (with file upload)"""
        # Check if request has files (multipart/form-data) or is JSON
        if request.files:
            # Handle file upload - extract form data and files
            data = {}
            
            # Extract text fields
            for key in request.form:
                data[key] = request.form[key]
            
            # Extract files
            files = {}
            if 'file' in request.files:
                files['file'] = request.files['file']
            if 'file_small' in request.files:
                files['file_small'] = request.files['file_small']
            if 'file_medium' in request.files:
                files['file_medium'] = request.files['file_medium']
            if 'file_large' in request.files:
                files['file_large'] = request.files['file_large']
            
            data['files'] = files
            
            # Parse prices if they're in form data
            if 'prices' not in data and 'has_sizes' in data and data['has_sizes'].lower() == 'true':
                prices = {}
                if 'price_small' in request.form:
                    prices['Small'] = float(request.form['price_small'])
                if 'price_medium' in request.form:
                    prices['Medium'] = float(request.form['price_medium'])
                if 'price_large' in request.form:
                    prices['Large'] = float(request.form['price_large'])
                data['prices'] = prices
            
            # Parse has_sizes boolean
            if 'has_sizes' in data:
                data['has_sizes'] = data['has_sizes'].lower() == 'true'
            
            # Parse price for non-sized items
            if 'price' in data:
                data['price'] = float(data['price'])
        else:
            # Handle JSON request (backward compatibility)
            data = request.json or {}
        
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
        """Create a product with all its items in one request - supports file uploads"""
        # Check if request has files (multipart/form-data) or is JSON
        if request.files:
            # Handle file upload - extract form data and files
            data = {}
            
            # Extract text fields
            for key in request.form:
                data[key] = request.form[key]
            
            # Extract files
            files = {}
            if 'file' in request.files and request.files['file'].filename:
                files['file'] = request.files['file']
            if 'file_small' in request.files and request.files['file_small'].filename:
                files['file_small'] = request.files['file_small']
            if 'file_medium' in request.files and request.files['file_medium'].filename:
                files['file_medium'] = request.files['file_medium']
            if 'file_large' in request.files and request.files['file_large'].filename:
                files['file_large'] = request.files['file_large']
            
            data['files'] = files
            
            # Parse prices from form data
            if 'has_sizes' in data and data['has_sizes'].lower() == 'true':
                prices = {}
                if 'price_small' in request.form:
                    prices['Small'] = float(request.form['price_small'])
                if 'price_medium' in request.form:
                    prices['Medium'] = float(request.form['price_medium'])
                if 'price_large' in request.form:
                    prices['Large'] = float(request.form['price_large'])
                data['prices'] = prices
            elif 'price' in request.form:
                data['price'] = float(request.form['price'])
            
            # Parse has_sizes boolean
            if 'has_sizes' in data:
                data['has_sizes'] = data['has_sizes'].lower() == 'true'
        else:
            # Handle JSON request (backward compatibility)
            data = request.json or {}
        
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

    @staticmethod
    def get_popular_items():
        """Get 4 popular items for landing page"""
        try:
            limit = request.args.get("limit", 4, type=int)
            items = ProductService.get_popular_items(limit)
            return jsonify([item.to_dict() for item in items]), 200
        except Exception as e:
            return jsonify({"message": "Error fetching popular items", "error": str(e)}), 500

