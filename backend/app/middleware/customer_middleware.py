# middleware/customer_middleware.py
from functools import wraps
from flask import request, jsonify
from app.services.user_service import UserService

def customer_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user_id = request.headers.get("user_id")

        if not user_id:
            return jsonify({"message": "Missing authentication header"}), 401
        
        try:
            user_id = int(user_id)
        except (ValueError, TypeError):
            return jsonify({"message": "Invalid user_id format"}), 400
        
        user = UserService.get_user(user_id)
        
        if not user:
            return jsonify({"message": "User not found"}), 404

        if user.role != "customer":
            return jsonify({"message": "Customer access only"}), 403

        return f(*args, **kwargs)
        
    return decorated

