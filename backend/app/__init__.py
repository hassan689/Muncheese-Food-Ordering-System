

from flask import Flask
from .extensions import db, migrate

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

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
        from .models.payment import Payment
        from .models.delivery_info import DeliveryInfo
        # -------------------------------------------------

        # Register Blueprints
        from .routes import register_blueprints
        register_blueprints(app)

        db.create_all() # Optional if using migrations, but good for safety

    return app