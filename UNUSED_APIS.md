# Unused APIs Analysis

This document lists all backend APIs and identifies which ones are NOT being used by the frontend.

## Backend API Endpoints

### 1. Main Routes (`/`)
- ✅ `GET /` - Used (home endpoint)
- ✅ `GET /test-db` - Used (database test)

### 2. Product Routes (`/api/products`)
- ✅ `GET /api/products/items` - **USED** (Menu.jsx, PopularItems.jsx)
- ❌ `POST /api/products/items` - **NOT USED** (Create item - Admin only)
- ❌ `PUT /api/products/items/<item_id>` - **NOT USED** (Update item - Admin only)
- ❌ `DELETE /api/products/items/<item_id>` - **NOT USED** (Delete item - Admin only)
- ❌ `POST /api/products/products` - **NOT USED** (Create product - Admin only)
- ✅ `GET /api/products/items/category` - **USED** (productService.getItemsByCategory)
- ✅ `GET /api/products/products/category` - **USED** (productService.getProductsByCategory)
- ✅ `GET /api/products/categories` - **USED** (Menu.jsx)
- ❌ `GET /api/products/items/<item_id>` - **NOT USED** (Get single item - defined in service but never called)

### 3. Customer Routes (`/api/customers`)
- ✅ `POST /api/customers/register` - **USED** (Register.jsx, Checkout.jsx)

### 4. Feedback Routes (`/api/feedback`)
- ✅ `POST /api/feedback` - **USED** (Feedback.jsx)
- ✅ `GET /api/feedback/item/<item_id>` - **USED** (feedbackService.getItemReviews)
- ✅ `GET /api/feedback/featured` - **USED** (Reviews.jsx)
- ✅ `GET /api/feedback` - **USED** (feedbackService.getAllFeedback)

### 5. Order Routes (`/api/orders`)
- ✅ `POST /api/orders/` - **USED** (Checkout.jsx)
- ❌ `GET /api/orders` - **NOT USED** (Get all orders - defined in service but never called)
- ✅ `GET /api/orders/<order_id>` - **USED** (OrderTracking.jsx)
- ✅ `GET /api/orders/customer?customer_id=X` - **USED** (Orders.jsx)
- ✅ `POST /api/orders/<order_id>/location` - **USED** (Checkout.jsx)
- ✅ `POST /api/orders/payment` - **USED** (Checkout.jsx)
- ❌ `PUT /api/orders/<order_id>` - **NOT USED** (Update order - defined in service but never called)
- ❌ `DELETE /api/orders/<order_id>` - **NOT USED** (Delete order - defined in service but never called)

### 6. Admin Routes (`/api`)
- ✅ `GET /api/customers` - **USED** (Customers.jsx)
- ✅ `GET /api/admin/phones` - **USED** (userService.getAllPhones)
- ✅ `PUT /api/admin/<customer_id>` - **USED** (userService.updateCustomer)
- ✅ `GET /api/admin/orders` - **NOT USED** (Admin dashboard doesn't fetch orders)
- ✅ `POST /api/admin/orders/<order_id>/review` - **NOT USED** (Admin dashboard doesn't review orders)
- ✅ `GET /api/admin/reports/sales` - **NOT USED** (Reports.jsx uses hardcoded data)

### 7. Login Route
- ❌ `POST /api/login` - **NOT USED** (Defined in userService but backend route doesn't exist!)
  - Frontend calls `/api/login` but this route is NOT defined in backend
  - Login.jsx tries to use it but it will fail

## Summary of Unused APIs

### Completely Unused (No Frontend Calls):
1. **Product Management (Admin)**
   - `POST /api/products/items` - Create item
   - `PUT /api/products/items/<item_id>` - Update item
   - `DELETE /api/products/items/<item_id>` - Delete item
   - `POST /api/products/products` - Create product
   - `GET /api/products/items/<item_id>` - Get single item

2. **Order Management**
   - `GET /api/orders` - Get all orders (without customer filter)
   - `PUT /api/orders/<order_id>` - Update order
   - `DELETE /api/orders/<order_id>` - Delete order

3. **Admin Dashboard**
   - `GET /api/admin/orders` - Get all orders for admin
   - `POST /api/admin/orders/<order_id>/review` - Review/approve orders
   - `GET /api/admin/reports/sales` - Sales reports

4. **Login**
   - `POST /api/login` - **MISSING ROUTE** (Frontend calls it but backend doesn't have it!)

### Partially Used (Defined in Service but Not Called):
1. `productService.getProductItem(itemId)` - Defined but never called
2. `orderService.getOrders()` - Defined but never called
3. `orderService.updateOrder()` - Defined but never called
4. `orderService.deleteOrder()` - Defined but never called
5. `feedbackService.getAllFeedback()` - Defined but never called
6. `feedbackService.getItemReviews()` - Defined but never called

## Recommendations

1. **Fix Login Route**: The frontend expects `/api/login` but it doesn't exist in backend. Either:
   - Create the login route in backend
   - Or update frontend to use a different authentication method

2. **Admin Dashboard**: The admin pages (AdminDashboard, Reports) don't use real APIs:
   - AdminDashboard.jsx - Just shows static content
   - Reports.jsx - Uses hardcoded data instead of `/api/admin/reports/sales`

3. **Product Management**: Admin needs UI to:
   - Create/Update/Delete products
   - Manage product items

4. **Order Management**: Admin needs UI to:
   - View all orders (`GET /api/admin/orders`)
   - Review/approve orders (`POST /api/admin/orders/<order_id>/review`)

5. **Remove Unused Service Methods**: Consider removing unused methods from services to reduce confusion.

