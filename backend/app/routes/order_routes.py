from flask import Blueprint
from app.controllers.order_controller import OrderController
from app.controllers.payment_controller import PaymentController

order_bp = Blueprint("order", __name__)

# Step 1: Create Order (Pending)
@order_bp.route("/", methods=["POST"])
def create_order():
    return OrderController.create_order()

# Step 2: Add Delivery Location
@order_bp.route("/<int:order_id>/location", methods=["POST"])
def add_location(order_id):
    return OrderController.add_location(order_id)

# Step 3: Make Payment (Uses PaymentController or OrderController)
@order_bp.route("/payment", methods=["POST"])
def make_payment():
    return PaymentController.make_payment()

# Get order details by ID (for customers)
@order_bp.route("/<int:order_id>", methods=["GET"])
def get_order_details(order_id):
    return OrderController.get_order_details(order_id)

# Get all orders for a customer
@order_bp.route("/customer", methods=["GET"])
def get_customer_orders():
    return OrderController.get_customer_orders()

# Update order (general update)
@order_bp.route("/<int:order_id>", methods=["PUT"])
def update_order(order_id):
    return OrderController.update_order(order_id)