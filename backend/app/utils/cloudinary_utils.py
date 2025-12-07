# utils/cloudinary_utils.py
import cloudinary
import cloudinary.uploader
import cloudinary.api
from flask import current_app

def configure_cloudinary():
    """Configure Cloudinary with credentials from app config"""
    cloudinary.config(
        cloud_name=current_app.config.get('CLOUDINARY_CLOUD_NAME'),
        api_key=current_app.config.get('CLOUDINARY_API_KEY'),
        api_secret=current_app.config.get('CLOUDINARY_API_SECRET')
    )

def upload_image_to_cloudinary(file_obj, folder="products", public_id=None):
    """
    Upload an image file to Cloudinary
    
    Args:
        file_obj: File object from Flask request.files
        folder: Folder name in Cloudinary (default: "products")
        public_id: Optional custom public_id for the image
    
    Returns:
        dict: Contains 'secure_url', 'public_id', 'format', etc.
    """
    configure_cloudinary()
    
    try:
        # Read file content
        file_obj.seek(0)  # Reset file pointer
        file_content = file_obj.read()
        file_obj.seek(0)  # Reset again for potential reuse
        
        # Upload options
        upload_options = {
            "folder": folder,
            "resource_type": "image"
        }
        
        if public_id:
            upload_options["public_id"] = public_id
        
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            file_content,
            **upload_options
        )
        
        return {
            "success": True,
            "url": result.get("secure_url"),
            "public_id": result.get("public_id"),
            "format": result.get("format"),
            "width": result.get("width"),
            "height": result.get("height"),
            "bytes": result.get("bytes")
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def delete_image_from_cloudinary(public_id):
    """
    Delete an image from Cloudinary
    
    Args:
        public_id: The public_id of the image to delete
    
    Returns:
        dict: Result of deletion
    """
    configure_cloudinary()
    
    try:
        result = cloudinary.uploader.destroy(public_id)
        return {
            "success": result.get("result") == "ok",
            "message": result.get("result")
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def get_image_info(public_id):
    """
    Get information about an image in Cloudinary
    
    Args:
        public_id: The public_id of the image
    
    Returns:
        dict: Image information
    """
    configure_cloudinary()
    
    try:
        result = cloudinary.api.resource(public_id)
        return {
            "success": True,
            "url": result.get("secure_url"),
            "public_id": result.get("public_id"),
            "format": result.get("format"),
            "width": result.get("width"),
            "height": result.get("height"),
            "bytes": result.get("bytes"),
            "created_at": result.get("created_at")
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def list_images_in_folder(folder="products", max_results=50):
    """
    List all images in a Cloudinary folder
    
    Args:
        folder: Folder name in Cloudinary
        max_results: Maximum number of results to return
    
    Returns:
        list: List of image information dictionaries
    """
    configure_cloudinary()
    
    try:
        result = cloudinary.api.resources(
            type="upload",
            prefix=folder,
            max_results=max_results
        )
        return {
            "success": True,
            "resources": result.get("resources", []),
            "total_count": result.get("total_count", 0)
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "resources": []
        }

