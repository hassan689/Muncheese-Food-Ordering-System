from .admin_routes import admin_bp
from .customer_routes import customer_bp
from .product_routes import product_bp
from .feedback_routes import feedback_bp

def register_blueprints(app):
    app.register_blueprint(admin_bp, url_prefix="/api")
    app.register_blueprint(customer_bp, url_prefix="/api/customers")
    app.register_blueprint(product_bp, url_prefix="/api/products")
    app.register_blueprint(feedback_bp, url_prefix="/api/feedback")