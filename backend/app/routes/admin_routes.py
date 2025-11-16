# routes/admin_routes.py
from flask import Blueprint
from app.middleware.admin_middleware import admin_required
from app.controllers.user_controller import UserController

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/customers", methods=["GET"])
@admin_required
def get_all_customers():
    return UserController.get_all()

@admin_bp.route("/admin/phones", methods=["GET"])
@admin_required
def get_all_phones():
    return UserController.get_all_phones()

admin_bp.route("/admin/<int:customer_id>", methods=["PUT"])(UserController.update)
