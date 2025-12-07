# services/user_service.py
from app.repositories.user_repository import UserRepository

class UserService:

    @staticmethod
    def get_customer(user_id):
        return UserRepository.get_by_id(user_id)

    @staticmethod
    def get_user(user_id):
        return UserRepository.get_by_id(user_id)

    @staticmethod
    def get_user_by_phone(phone):
        return UserRepository.get_by_phone(phone)

    @staticmethod
    def register_customer(data):
        return UserRepository.get_or_create_by_phone(data)

    @staticmethod
    def update_customer(customer_id, data):
        user = UserRepository.get_by_id(customer_id)
        if not user:
            return None
        return UserRepository.update(user, data)

    @staticmethod
    def get_all_phones():
        phone_tuples = UserRepository.get_all_phones()
        return [phone[0] for phone in phone_tuples]

    @staticmethod
    def get_all():
        return UserRepository.get_all()

    @staticmethod
    def get_or_create_user(name, phone, address=None):
        user_data = {
            "name": name,
            "phone": phone,
            "address": address
        }
        return UserRepository.get_or_create_by_phone(user_data)

    @staticmethod
    def get_or_create_admin():
        """Get or create admin user with hardcoded credentials"""
        # Try to find existing admin user
        admin_user = UserRepository.get_admin_user()
        if admin_user:
            return admin_user
        
        # Create admin user if doesn't exist
        admin_data = {
            "name": "Admin",
            "phone": "00000000000",  # Unique phone for admin
            "address": "Restaurant",
            "role": "admin"
        }
        # Use create directly to ensure role is set
        return UserRepository.create(admin_data)

