# routes/admin_routes.py
from flask import Blueprint, request, jsonify
from app.middleware.admin_middleware import admin_required
from app.controllers.user_controller import UserController
from app.services.user_service import UserService

# Reuse your existing controllers!
from app.controllers.user_controller import UserController
from app.controllers.order_controller import OrderController

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/admin/login", methods=["POST"])
def admin_login():
    """Hardcoded admin login: username='admin', password='12345'"""
    data = request.json
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()
    
    # Hardcoded credentials
    if username == "admin" and password == "12345":
        # Find or create admin user
        admin_user = UserService.get_or_create_admin()
        return jsonify({
            "message": "Login successful",
            "user": admin_user.to_dict(),
            "token": "admin_token",  # Simple token for now
            "user_id": admin_user.user_id
        }), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401

@admin_bp.route("/customers", methods=["GET"])
@admin_required
def get_all_customers():
    return UserController.get_all()

@admin_bp.route("/admin/phones", methods=["GET"])
@admin_required
def get_all_phones():
    return UserController.get_all_phones()

@admin_bp.route("/admin/<int:customer_id>", methods=["PUT"])
@admin_required
def update_customer(customer_id):
    return UserController.update(customer_id)


# ==========================================
# 2. ORDER MANAGEMENT (Using OrderController)
# ==========================================

@admin_bp.route("/admin/orders", methods=["GET"])
@admin_required
def view_all_orders():
    # Calls OrderController.get_all_orders()
    return OrderController.get_all_orders()

@admin_bp.route("/admin/orders/<int:order_id>/review", methods=["POST"])
@admin_required
def review_order(order_id):
    # Calls OrderController.review_order() (Approve/Reject)
    return OrderController.review_order(order_id)

@admin_bp.route("/admin/reports/sales", methods=["GET"])
@admin_required
def sales_report():
    # If you put report logic in OrderController
    return OrderController.get_sales_report()

@admin_bp.route("/admin/dashboard/stats", methods=["GET"])
@admin_required
def dashboard_stats():
    return OrderController.get_dashboard_stats()

@admin_bp.route("/admin/reports/data", methods=["GET"])
@admin_required
def reports_data():
    return OrderController.get_reports_data()


