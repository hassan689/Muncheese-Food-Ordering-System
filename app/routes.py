from flask import Blueprint, jsonify
from app import db  # ← Make sure this line is here!


main = Blueprint('main', __name__)

@main.route('/')
def home():
    return jsonify({'message': 'Flask backend running successfully!'})
@main.route('/test-db')
def test_db():
    try:
        # Try to execute a simple query
        from sqlalchemy import text
        result = db.session.execute(text('SELECT 1'))
        return jsonify({
            'status': 'success',
            'message': 'Database connected!',
            'result': result.scalar()
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': 'Database NOT connected',
            'error': str(e)
        }), 500