# routes/product_routes.py
from flask import Blueprint
from app.controllers.product_controller import ProductController

product_bp = Blueprint("products", __name__)

@product_bp.route("/items", methods=["GET"])
def get_all_items():
    return ProductController.get_all_items()

@product_bp.route("/items", methods=["POST"])
def create_item():
    return ProductController.create_item()

@product_bp.route("/items/<int:item_id>", methods=["PUT"])
def update_item(item_id):
    return ProductController.update_item(item_id)

@product_bp.route("/items/<int:item_id>", methods=["DELETE"])
def delete_item(item_id):
    return ProductController.delete_item(item_id)

@product_bp.route("/products", methods=["POST"])
def create_product():
    return ProductController.create_product()

@product_bp.route("/items/category", methods=["GET"])
def get_items_by_category():
    return ProductController.get_items_by_category()

@product_bp.route("/products/category", methods=["GET"])
def get_products_by_category():
    return ProductController.get_products_by_category()

@product_bp.route("/categories", methods=["GET"])
def get_all_categories():
    return ProductController.get_all_categories()

