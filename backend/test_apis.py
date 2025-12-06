"""
API Testing Script
Run this script to test all your backend APIs and see if they're returning data.

Usage:
    python test_apis.py
"""

import requests
import json
from datetime import datetime

# Base URL - change if your server runs on a different port
BASE_URL = "http://localhost:5000"

def print_section(title):
    """Print a formatted section header"""
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)

def print_result(name, response, show_data=True):
    """Print formatted API test result"""
    status = "✅ PASS" if response.status_code < 400 else "❌ FAIL"
    print(f"\n{status} - {name}")
    print(f"   Status Code: {response.status_code}")
    
    if show_data:
        try:
            data = response.json()
            print(f"   Response: {json.dumps(data, indent=2)}")
        except:
            print(f"   Response: {response.text[:200]}")
    else:
        print(f"   Response: {response.text[:100]}...")

def test_home_endpoint():
    """Test the home/health check endpoint"""
    print_section("Testing Home Endpoint")
    try:
        response = requests.get(f"{BASE_URL}/")
        print_result("GET /", response)
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        print("❌ FAIL - Cannot connect to server")
        print("   Make sure your Flask server is running: python run.py")
        return False

def test_database_endpoint():
    """Test the database connection endpoint"""
    print_section("Testing Database Connection")
    try:
        response = requests.get(f"{BASE_URL}/test-db")
        print_result("GET /test-db", response)
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        print("❌ FAIL - Cannot connect to server")
        return False

def test_product_endpoints():
    """Test all product-related endpoints"""
    print_section("Testing Product Endpoints")
    results = []
    
    # Test GET all product items
    try:
        response = requests.get(f"{BASE_URL}/api/products/items")
        print_result("GET /api/products/items", response)
        results.append(response.status_code == 200)
    except Exception as e:
        print(f"❌ FAIL - GET /api/products/items - Error: {e}")
        results.append(False)
    
    # Test GET categories
    try:
        response = requests.get(f"{BASE_URL}/api/products/categories")
        print_result("GET /api/products/categories", response)
        results.append(response.status_code == 200)
    except Exception as e:
        print(f"❌ FAIL - GET /api/products/categories - Error: {e}")
        results.append(False)
    
    # Test GET items by category (if categories exist)
    try:
        response = requests.get(f"{BASE_URL}/api/products/categories")
        if response.status_code == 200:
            categories = response.json().get('categories', [])
            if categories:
                category = categories[0]
                response = requests.get(f"{BASE_URL}/api/products/items/category?category={category}")
                print_result(f"GET /api/products/items/category?category={category}", response)
                results.append(response.status_code == 200)
            else:
                print("\n⚠️  SKIP - GET /api/products/items/category (no categories available)")
        else:
            print("\n⚠️  SKIP - GET /api/products/items/category (could not fetch categories)")
    except Exception as e:
        print(f"❌ FAIL - GET /api/products/items/category - Error: {e}")
        results.append(False)
    
    return all(results)

def test_customer_endpoints():
    """Test customer-related endpoints"""
    print_section("Testing Customer Endpoints")
    results = []
    
    # Test customer registration (POST)
    test_user = {
        "name": f"Test User {datetime.now().strftime('%H%M%S')}",
        "phone": f"0300{datetime.now().strftime('%H%M%S')}",
        "address": "Test Address"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/customers/register",
            json=test_user,
            headers={"Content-Type": "application/json"}
        )
        print_result("POST /api/customers/register", response)
        results.append(response.status_code in [200, 201])
        
        # Save user_id if registration successful
        if response.status_code in [200, 201]:
            user_data = response.json()
            return user_data.get('user_id') or user_data.get('user', {}).get('user_id')
    except Exception as e:
        print(f"❌ FAIL - POST /api/customers/register - Error: {e}")
        results.append(False)
    
    return None

def test_order_endpoints():
    """Test order-related endpoints"""
    print_section("Testing Order Endpoints")
    results = []
    
    # First, we need a customer_id to create an order
    # Try to create a test customer first
    test_user = {
        "name": f"Order Test User {datetime.now().strftime('%H%M%S')}",
        "phone": f"0301{datetime.now().strftime('%H%M%S')}",
        "address": "Test Address for Order"
    }
    
    customer_id = None
    try:
        response = requests.post(
            f"{BASE_URL}/api/customers/register",
            json=test_user,
            headers={"Content-Type": "application/json"}
        )
        if response.status_code in [200, 201]:
            user_data = response.json()
            customer_id = user_data.get('user_id') or user_data.get('user', {}).get('user_id')
    except:
        pass
    
    if not customer_id:
        print("\n⚠️  SKIP - Order endpoints (could not create test customer)")
        return False
    
    # Test POST create order
    try:
        order_data = {
            "customer_id": customer_id,
            "total_amount": 1500.00
        }
        response = requests.post(
            f"{BASE_URL}/api/orders/",
            json=order_data,
            headers={"Content-Type": "application/json"}
        )
        print_result("POST /api/orders/", response)
        results.append(response.status_code in [200, 201])
        
        # Save order_id if order created successfully
        order_id = None
        if response.status_code in [200, 201]:
            order_data = response.json()
            order_id = order_data.get('order_id')
    except Exception as e:
        print(f"❌ FAIL - POST /api/orders/ - Error: {e}")
        results.append(False)
        order_id = None
    
    # Test POST add location (if order was created)
    if order_id:
        try:
            location_data = {
                "address": "DHA Phase 6, Karachi",
                "lat": 24.8000,
                "lng": 67.0500
            }
            response = requests.post(
                f"{BASE_URL}/api/orders/{order_id}/location",
                json=location_data,
                headers={"Content-Type": "application/json"}
            )
            print_result(f"POST /api/orders/{order_id}/location", response)
            results.append(response.status_code == 200)
        except Exception as e:
            print(f"❌ FAIL - POST /api/orders/{order_id}/location - Error: {e}")
            results.append(False)
    
    return all(results) if results else False

def test_feedback_endpoints():
    """Test feedback-related endpoints"""
    print_section("Testing Feedback Endpoints")
    results = []
    
    # Test GET featured feedback
    try:
        response = requests.get(f"{BASE_URL}/api/feedback/featured")
        print_result("GET /api/feedback/featured", response)
        results.append(response.status_code == 200)
    except Exception as e:
        print(f"❌ FAIL - GET /api/feedback/featured - Error: {e}")
        results.append(False)
    
    # Test GET all feedback
    try:
        response = requests.get(f"{BASE_URL}/api/feedback")
        print_result("GET /api/feedback", response)
        results.append(response.status_code == 200)
    except Exception as e:
        print(f"❌ FAIL - GET /api/feedback - Error: {e}")
        results.append(False)
    
    return all(results)

def main():
    """Run all API tests"""
    print("\n" + "=" * 60)
    print("  API Testing Script")
    print("  Testing Backend APIs")
    print("=" * 60)
    print(f"\nBase URL: {BASE_URL}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Check if server is running
    print("\n🔍 Checking if server is running...")
    try:
        response = requests.get(f"{BASE_URL}/", timeout=2)
        print("✅ Server is running!")
    except requests.exceptions.ConnectionError:
        print("❌ Server is NOT running!")
        print("\nPlease start your Flask server first:")
        print("  cd backend")
        print("  python run.py")
        return
    except Exception as e:
        print(f"❌ Error connecting to server: {e}")
        return
    
    # Run tests
    test_results = {
        "Home Endpoint": test_home_endpoint(),
        "Database Connection": test_database_endpoint(),
        "Product Endpoints": test_product_endpoints(),
        "Customer Endpoints": test_customer_endpoints(),
        "Order Endpoints": test_order_endpoints(),
        "Feedback Endpoints": test_feedback_endpoints(),
    }
    
    # Print summary
    print_section("Test Summary")
    total_tests = len(test_results)
    passed_tests = sum(1 for result in test_results.values() if result)
    
    for test_name, result in test_results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    print(f"\nTotal: {passed_tests}/{total_tests} test suites passed")
    
    if passed_tests == total_tests:
        print("\n🎉 All tests passed!")
    else:
        print(f"\n⚠️  {total_tests - passed_tests} test suite(s) failed")

if __name__ == "__main__":
    main()

