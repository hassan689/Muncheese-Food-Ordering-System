# repositories/user_repository.py
from app.models.user import User
from app.extensions import db

class UserRepository:
    @staticmethod
    def get_by_id(user_id):
        return User.query.get(user_id)

    @staticmethod
    def get_by_phone(phone):
        return User.query.filter_by(phone=phone).first()

    @staticmethod
    def get_all_phones():
        return User.query.with_entities(User.phone).all()

    @staticmethod
    def get_all():
        return User.query.all()

    @staticmethod
    def create(data):
        data.setdefault("role", "customer")
        user = User(**data)
        db.session.add(user)
        db.session.commit()
        return user

    @staticmethod
    def get_or_create_by_phone(data):
        existing = UserRepository.get_by_phone(data["phone"])
        if existing:
            return existing  # Avoid duplicates
        data.setdefault("role", "customer")
        return UserRepository.create(data)

    @staticmethod
    def update(user, data):
        for key, value in data.items():
            setattr(user, key, value)
        db.session.commit()
        return user

    @staticmethod
    def delete(user):
        db.session.delete(user)
        db.session.commit()

