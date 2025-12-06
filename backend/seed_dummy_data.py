"""
Seed Dummy Data Script
This script populates your database with sample data for testing.

Usage:
    python seed_dummy_data.py

Note: This script is safe to run multiple times. It checks if data exists before adding.
"""

from app import create_app, db
from app.models.user import User
from app.models.product import Product, ProductItem
from app.models.order import Order
from app.models.payment import Payment
from app.models.delivery_info import DeliveryInfo
from app.models.feedback import Feedback
from datetime import datetime, timedelta
import random

def seed_users():
    """Create dummy users"""
    print("\n📝 Seeding Users...")
    
    users_data = [
        {
            "name": "Ahmed Khan",
            "phone": "03001234567",
            "address": "DHA Phase 6, Karachi",
            "role": "customer"
        },
        {
            "name": "Fatima Ali",
            "phone": "03001234568",
            "address": "Gulshan-e-Iqbal, Karachi",
            "role": "customer"
        },
        {
            "name": "Hassan Sheikh",
            "phone": "03001234569",
            "address": "Clifton, Karachi",
            "role": "customer"
        },
        {
            "name": "Ayesha Malik",
            "phone": "03001234570",
            "address": "Bahadurabad, Karachi",
            "role": "customer"
        },
        {
            "name": "Admin User",
            "phone": "03000000001",
            "address": "Muncheese Restaurant, Valencia Town, Lahore",
            "role": "admin"
        }
    ]
    
    created_count = 0
    for user_data in users_data:
        existing_user = User.query.filter_by(phone=user_data["phone"]).first()
        if not existing_user:
            user = User(**user_data)
            db.session.add(user)
            created_count += 1
            print(f"   ✅ Created user: {user_data['name']}")
        else:
            print(f"   ⏭️  User already exists: {user_data['name']}")
    
    db.session.commit()
    print(f"   📊 Created {created_count} new users")
    return User.query.filter_by(role="customer").all()

def seed_products():
    """Create dummy products with items"""
    print("\n🍕 Seeding Products...")
    
    products_data = [
        {
            "name": "Margherita Pizza",
            "description": "Classic pizza with tomato sauce, mozzarella cheese, and fresh basil",
            "category": "Pizza",
            "items": [
                {"size": "Small", "price": 500.00},
                {"size": "Medium", "price": 800.00},
                {"size": "Large", "price": 1200.00}
            ]
        },
        {
            "name": "Pepperoni Pizza",
            "description": "Delicious pizza topped with pepperoni and mozzarella cheese",
            "category": "Pizza",
            "items": [
                {"size": "Small", "price": 600.00},
                {"size": "Medium", "price": 900.00},
                {"size": "Large", "price": 1300.00}
            ]
        },
        {
            "name": "Chicken Tikka Pizza",
            "description": "Spicy chicken tikka with onions and bell peppers",
            "category": "Pizza",
            "items": [
                {"size": "Small", "price": 700.00},
                {"size": "Medium", "price": 1000.00},
                {"size": "Large", "price": 1400.00}
            ]
        },
        {
            "name": "Classic Burger",
            "description": "Juicy beef patty with lettuce, tomato, and special sauce",
            "category": "Burgers",
            "items": [
                {"size": "Regular", "price": 400.00},
                {"size": "Large", "price": 550.00}
            ]
        },
        {
            "name": "Chicken Burger",
            "description": "Crispy chicken fillet with mayo and fresh vegetables",
            "category": "Burgers",
            "items": [
                {"size": "Regular", "price": 350.00},
                {"size": "Large", "price": 500.00}
            ]
        },
        {
            "name": "Zinger Burger",
            "description": "Spicy zinger chicken with coleslaw and special sauce",
            "category": "Burgers",
            "items": [
                {"size": "Regular", "price": 450.00},
                {"size": "Large", "price": 600.00}
            ]
        },
        {
            "name": "Coca Cola",
            "description": "Refreshing cola drink",
            "category": "Drinks",
            "items": [
                {"size": None, "price": 100.00}
            ]
        },
        {
            "name": "Pepsi",
            "description": "Classic pepsi cola",
            "category": "Drinks",
            "items": [
                {"size": None, "price": 100.00}
            ]
        },
        {
            "name": "Fresh Orange Juice",
            "description": "Freshly squeezed orange juice",
            "category": "Drinks",
            "items": [
                {"size": "Small", "price": 150.00},
                {"size": "Large", "price": 250.00}
            ]
        },
        {
            "name": "Chocolate Brownie",
            "description": "Rich chocolate brownie with fudge",
            "category": "Desserts",
            "items": [
                {"size": None, "price": 200.00}
            ]
        },
        {
            "name": "Ice Cream Sundae",
            "description": "Vanilla ice cream with chocolate sauce and nuts",
            "category": "Desserts",
            "items": [
                {"size": None, "price": 250.00}
            ]
        },
        {
            "name": "French Fries",
            "description": "Crispy golden french fries",
            "category": "Fries",
            "items": [
                {"size": "Small", "price": 150.00},
                {"size": "Medium", "price": 250.00},
                {"size": "Large", "price": 350.00}
            ]
        }
    ]
    
    created_products = 0
    created_items = 0
    
    for product_data in products_data:
        # Check if product already exists
        existing_product = Product.query.filter_by(name=product_data["name"]).first()
        
        if existing_product:
            print(f"   ⏭️  Product already exists: {product_data['name']}")
            continue
        
        # Create product
        product = Product(
            name=product_data["name"],
            description=product_data["description"],
            category=product_data["category"]
        )
        db.session.add(product)
        db.session.flush()  # Get the product_id
        
        # Create product items
        for item_data in product_data["items"]:
            item = ProductItem(
                product_id=product.product_id,
                size=item_data["size"],
                price=item_data["price"]
            )
            db.session.add(item)
            created_items += 1
        
        created_products += 1
        print(f"   ✅ Created product: {product_data['name']} with {len(product_data['items'])} items")
    
    db.session.commit()
    print(f"   📊 Created {created_products} products with {created_items} items")
    return ProductItem.query.all()

def seed_orders(customers, product_items):
    """Create dummy orders"""
    print("\n📦 Seeding Orders...")
    
    if not customers or not product_items:
        print("   ⚠️  Cannot create orders: Need customers and products first")
        return []
    
    # Create a few orders
    orders_data = [
        {
            "customer": customers[0],
            "total_amount": 1500.00,
            "status": "accepted",
            "address": "DHA Phase 6, Karachi",
            "lat": 24.8000,
            "lng": 67.0500,
            "payment_method": "cash"
        },
        {
            "customer": customers[1],
            "total_amount": 2200.00,
            "status": "accepted",
            "address": "Gulshan-e-Iqbal, Karachi",
            "lat": 24.9000,
            "lng": 67.0600,
            "payment_method": "online"
        },
        {
            "customer": customers[2],
            "total_amount": 800.00,
            "status": "pending",
            "address": "Clifton, Karachi",
            "lat": 24.8100,
            "lng": 67.0400,
            "payment_method": "cash"
        }
    ]
    
    created_count = 0
    orders = []
    
    for order_data in orders_data:
        order = Order(
            customer_id=order_data["customer"].user_id,
            total_amount=order_data["total_amount"],
            status=order_data["status"],
            created_at=datetime.utcnow() - timedelta(days=random.randint(1, 7))
        )
        db.session.add(order)
        db.session.flush()  # Get order_id
        
        # Create delivery info
        delivery_info = DeliveryInfo(
            order_id=order.order_id,
            address=order_data["address"],
            latitude=order_data["lat"],
            longitude=order_data["lng"],
            is_within_range=True
        )
        db.session.add(delivery_info)
        
        # Create payment
        payment = Payment(
            order_id=order.order_id,
            method=order_data["payment_method"],
            amount=order_data["total_amount"],
            screenshot_url="https://example.com/screenshot.jpg" if order_data["payment_method"] == "online" else None
        )
        db.session.add(payment)
        
        orders.append(order)
        created_count += 1
        print(f"   ✅ Created order #{order.order_id} for {order_data['customer'].name}")
    
    db.session.commit()
    print(f"   📊 Created {created_count} orders")
    return orders

def seed_feedback(customers, product_items):
    """Create dummy feedback"""
    print("\n⭐ Seeding Feedback...")
    
    if not customers or not product_items:
        print("   ⚠️  Cannot create feedback: Need customers and products first")
        return
    
    feedback_messages = [
        "Excellent food! Very tasty and fresh.",
        "Great service and fast delivery. Highly recommended!",
        "The pizza was amazing, will definitely order again.",
        "Good quality food at reasonable prices.",
        "Delicious! The burger was perfectly cooked.",
        "Fast delivery and the food was still hot when it arrived.",
        "One of the best food ordering experiences I've had.",
        "The fries were crispy and the burger was juicy. Perfect!",
        "Great value for money. Will order from here again.",
        "The dessert was amazing! So rich and creamy."
    ]
    
    created_count = 0
    
    # Create feedback for random items
    for _ in range(15):
        customer = random.choice(customers)
        item = random.choice(product_items)
        
        # Check if feedback already exists for this combination
        existing = Feedback.query.filter_by(
            customer_id=customer.user_id,
            item_id=item.item_id
        ).first()
        
        if existing:
            continue
        
        feedback = Feedback(
            item_id=item.item_id,
            customer_id=customer.user_id,
            no_of_stars=random.randint(4, 5),  # Mostly positive reviews
            feedback_message=random.choice(feedback_messages),
            date=datetime.utcnow() - timedelta(days=random.randint(1, 30))
        )
        db.session.add(feedback)
        created_count += 1
    
    db.session.commit()
    print(f"   📊 Created {created_count} feedback entries")

def main():
    """Main function to seed all data"""
    print("=" * 60)
    print("  Database Seeding Script")
    print("  Adding Dummy Data for Testing")
    print("=" * 60)
    
    app = create_app()
    
    with app.app_context():
        try:
            # Check database connection
            db.session.execute(db.text("SELECT 1"))
            print("\n✅ Database connection successful!")
        except Exception as e:
            print(f"\n❌ Database connection failed: {e}")
            print("   Please check your database configuration in config.py")
            return
        
        # Seed data in order
        customers = seed_users()
        product_items = seed_products()
        orders = seed_orders(customers, product_items)
        seed_feedback(customers, product_items)
        
        # Print summary
        print("\n" + "=" * 60)
        print("  Seeding Complete!")
        print("=" * 60)
        print(f"\n📊 Summary:")
        print(f"   Users: {User.query.count()}")
        print(f"   Products: {Product.query.count()}")
        print(f"   Product Items: {ProductItem.query.count()}")
        print(f"   Orders: {Order.query.count()}")
        print(f"   Feedback: {Feedback.query.count()}")
        print("\n✅ All dummy data has been added successfully!")
        print("\n💡 You can now test your APIs:")
        print("   - GET http://localhost:5000/api/products/items")
        print("   - GET http://localhost:5000/api/products/categories")
        print("   - GET http://localhost:5000/api/feedback/featured")
        print("\n   Or run: python test_apis.py")

if __name__ == "__main__":
    main()

