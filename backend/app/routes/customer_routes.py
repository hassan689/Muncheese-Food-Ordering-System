# routes/customer_routes.py
from flask import Blueprint
from app.controllers.user_controller import UserController

customer_bp = Blueprint("customer", __name__)

# Customer registration route - customers register themselves
customer_bp.route("/register", methods=["POST"])(UserController.register)
