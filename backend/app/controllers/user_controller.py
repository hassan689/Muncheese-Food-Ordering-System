# controllers/user_controller.py
from flask import request, jsonify
from app.services.user_service import UserService

class UserController:

    @staticmethod
    def register():
        data = request.json
        data.setdefault("role", "customer")
        user = UserService.register_customer(data)
        return jsonify(user.to_dict()), 201

    @staticmethod
    def get_all():
        users = UserService.get_all()
        return jsonify([user.to_dict() for user in users]), 200

    @staticmethod
    def get_all_phones():
        phones = UserService.get_all_phones()
        if not phones:
            return jsonify({"message": "No phone numbers found"}), 404
        return jsonify({"phones": phones, "count": len(phones)}), 200

    @staticmethod
    def update(customer_id):
        data = request.json
        user = UserService.update_customer(customer_id, data)
        if not user:
            return jsonify({"message": "User not found"}), 404
        return jsonify(user.to_dict()), 200

