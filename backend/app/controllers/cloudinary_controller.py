# controllers/cloudinary_controller.py
from flask import request, jsonify
from app.utils.cloudinary_utils import (
    upload_image_to_cloudinary,
    delete_image_from_cloudinary,
    get_image_info,
    list_images_in_folder
)

class CloudinaryController:
    @staticmethod
    def upload_image():
        """Upload an image to Cloudinary"""
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Get optional parameters
        folder = request.form.get('folder', 'products')
        public_id = request.form.get('public_id', None)
        
        # Upload image
        result = upload_image_to_cloudinary(file, folder=folder, public_id=public_id)
        
        if result.get("success"):
            return jsonify({
                "message": "Image uploaded successfully",
                "data": {
                    "url": result.get("url"),
                    "public_id": result.get("public_id"),
                    "format": result.get("format"),
                    "width": result.get("width"),
                    "height": result.get("height"),
                    "size_bytes": result.get("bytes")
                }
            }), 201
        else:
            return jsonify({"error": result.get("error", "Upload failed")}), 500
    
    @staticmethod
    def delete_image():
        """Delete an image from Cloudinary"""
        data = request.json
        
        if not data or 'public_id' not in data:
            return jsonify({"error": "public_id is required"}), 400
        
        public_id = data['public_id']
        result = delete_image_from_cloudinary(public_id)
        
        if result.get("success"):
            return jsonify({
                "message": "Image deleted successfully",
                "public_id": public_id
            }), 200
        else:
            return jsonify({"error": result.get("error", "Deletion failed")}), 500
    
    @staticmethod
    def get_image_info():
        """Get information about an image"""
        public_id = request.args.get('public_id')
        
        if not public_id:
            return jsonify({"error": "public_id parameter is required"}), 400
        
        result = get_image_info(public_id)
        
        if result.get("success"):
            return jsonify({
                "message": "Image info retrieved successfully",
                "data": result
            }), 200
        else:
            return jsonify({"error": result.get("error", "Failed to get image info")}), 404
    
    @staticmethod
    def list_images():
        """List all images in a folder"""
        folder = request.args.get('folder', 'products')
        max_results = request.args.get('max_results', 50, type=int)
        
        result = list_images_in_folder(folder=folder, max_results=max_results)
        
        if result.get("success"):
            return jsonify({
                "message": "Images retrieved successfully",
                "folder": folder,
                "total_count": result.get("total_count", 0),
                "images": result.get("resources", [])
            }), 200
        else:
            return jsonify({"error": result.get("error", "Failed to list images")}), 500

