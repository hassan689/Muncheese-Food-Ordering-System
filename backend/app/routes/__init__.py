from .admin_routes import admin_bp
from .customer_routes import customer_bp
from .product_routes import product_bp
from .feedback_routes import feedback_bp
from .order_routes import order_bp
from .cloudinary_routes import cloudinary_bp
from .routes import main as main_bp

def register_blueprints(app):
    # Register main routes (home, test-db) without prefix
    app.register_blueprint(main_bp)
    # Register API routes with prefixes
    app.register_blueprint(admin_bp, url_prefix="/api")
    app.register_blueprint(customer_bp, url_prefix="/api/customers")
    app.register_blueprint(product_bp, url_prefix="/api/products")
    app.register_blueprint(feedback_bp, url_prefix="/api/feedback")
    app.register_blueprint(order_bp, url_prefix="/api/orders")
    app.register_blueprint(cloudinary_bp, url_prefix="/api/cloudinary")
