

from flask import Flask
from flask_cors import CORS
from .extensions import db, migrate

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    
    # Enable CORS for all routes
    CORS(app, resources={
        r"/api/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "user-id"]
        },
        r"/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "user-id"]
        }
    })

    # Initialize Plugins
    db.init_app(app)
    migrate.init_app(app, db)

    with app.app_context():
        # --- IMPORT MODELS HERE SO MIGRATION SEES THEM ---
        from .models.user import User
        from .models.product import Product
        from .models.feedback import Feedback
        
        # ADD THESE NEW ONES:
        from .models.order import Order
        from .models.order_item import OrderItem
        from .models.payment import Payment
        from .models.delivery_info import DeliveryInfo
        # -------------------------------------------------

        # Register Blueprints
        from .routes import register_blueprints
        register_blueprints(app)

        # Try to create tables, but don't crash if database is not available
        try:
            db.create_all() # Optional if using migrations, but good for safety
        except Exception as e:
            print(f"[WARNING] Database initialization warning: {str(e)}")
            print("   App will continue, but database features may not work.")

    return app