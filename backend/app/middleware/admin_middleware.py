# middleware/admin_middleware.py
from functools import wraps
from flask import request, jsonify
from app.services.user_service import UserService

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user_id = request.headers.get("user_id") or request.headers.get("user-id")

        if not user_id:
            return jsonify({"message": "Missing authentication header"}), 401
        
        try:
            user_id = int(user_id)
        except (ValueError, TypeError):
            return jsonify({"message": "Invalid user_id format"}), 400
        
        user = UserService.get_customer(user_id)
        
        if not user:
            return jsonify({"message": "User not found"}), 404

        print(user.name)
        if user.role != "admin":
            return jsonify({"message": "Admin access only"}), 403

        return f(*args, **kwargs)
        
    return decorated
