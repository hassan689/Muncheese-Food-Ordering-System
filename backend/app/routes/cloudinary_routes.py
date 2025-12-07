# routes/cloudinary_routes.py
from flask import Blueprint
from app.controllers.cloudinary_controller import CloudinaryController

cloudinary_bp = Blueprint("cloudinary", __name__)

# Upload image
cloudinary_bp.route("/upload", methods=["POST"])(CloudinaryController.upload_image)

# Delete image
cloudinary_bp.route("/delete", methods=["DELETE"])(CloudinaryController.delete_image)

# Get image info
cloudinary_bp.route("/info", methods=["GET"])(CloudinaryController.get_image_info)

# List images in folder
cloudinary_bp.route("/list", methods=["GET"])(CloudinaryController.list_images)

