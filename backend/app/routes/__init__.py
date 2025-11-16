from .admin_routes import admin_bp
from .customer_routes import customer_bp

def register_blueprints(app):
    app.register_blueprint(admin_bp, url_prefix="/api")
    app.register_blueprint(customer_bp, url_prefix="/api/customers")