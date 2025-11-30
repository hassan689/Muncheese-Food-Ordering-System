# routes/admin_routes.py
from flask import Blueprint
from app.middleware.admin_middleware import admin_required
from app.controllers.user_controller import UserController

# Reuse your existing controllers!
from app.controllers.user_controller import UserController
from app.controllers.order_controller import OrderController

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


