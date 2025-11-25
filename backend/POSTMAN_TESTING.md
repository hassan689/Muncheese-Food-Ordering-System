# Postman Testing Guide - Product API

## Base URL
```
http://localhost:5000/api/products
```

---

## 1. Get All Product Items

**Method:** `GET`  
**URL:** `http://localhost:5000/api/products/items`  
**Headers:** None required

**Response:**
```json
[
  {
    "item_id": 1,
    "product_id": 1,
    "product_name": "Pizza",
    "category": "Pizza",
    "size": "Small",
    "price": 10.99
  },
  {
    "item_id": 2,
    "product_id": 1,
    "product_name": "Pizza",
    "category": "Pizza",
    "size": "Medium",
    "price": 12.99
  }
]
```

---

## 2. Create Product with Items (Recommended - Frontend Flow)

### 2a. Create Product WITH Sizes (3 prices)

**Method:** `POST`  
**URL:** `http://localhost:5000/api/products/products`  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "product_name": "Pizza",
  "description": "Delicious pizza with cheese",
  "category": "Pizza",
  "has_sizes": true,
  "prices": {
    "Small": 10.99,
    "Medium": 12.99,
    "Large": 15.99
  }
}
```

**Response (201 Created):**
```json
{
  "product": {
    "product_id": 1,
    "name": "Pizza",
    "description": "Delicious pizza with cheese",
    "category": "Pizza",
    "items": [
      {
        "item_id": 1,
        "product_id": 1,
        "product_name": "Pizza",
        "category": "Pizza",
        "size": "Small",
        "price": 10.99
      },
      {
        "item_id": 2,
        "product_id": 1,
        "product_name": "Pizza",
        "category": "Pizza",
        "size": "Medium",
        "price": 12.99
      },
      {
        "item_id": 3,
        "product_id": 1,
        "product_name": "Pizza",
        "category": "Pizza",
        "size": "Large",
        "price": 15.99
      }
    ]
  },
  "items": [
    {
      "item_id": 1,
      "product_id": 1,
      "product_name": "Pizza",
      "category": "Pizza",
      "size": "Small",
      "price": 10.99
    },
    {
      "item_id": 2,
      "product_id": 1,
      "product_name": "Pizza",
      "category": "Pizza",
      "size": "Medium",
      "price": 12.99
    },
    {
      "item_id": 3,
      "product_id": 1,
      "product_name": "Pizza",
      "category": "Pizza",
      "size": "Large",
      "price": 15.99
    }
  ],
  "message": "Product created successfully"
}
```

### 2b. Create Product WITHOUT Sizes (1 price)

**Method:** `POST`  
**URL:** `http://localhost:5000/api/products/products`  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "product_name": "Coke",
  "description": "Refreshing cola drink",
  "category": "Drinks",
  "has_sizes": false,
  "price": 2.99
}
```

**Response (201 Created):**
```json
{
  "product": {
    "product_id": 2,
    "name": "Coke",
    "description": "Refreshing cola drink",
    "category": "Drinks",
    "items": [
      {
        "item_id": 4,
        "product_id": 2,
        "product_name": "Coke",
        "category": "Drinks",
        "size": null,
        "price": 2.99
      }
    ]
  },
  "items": [
    {
      "item_id": 4,
      "product_id": 2,
      "product_name": "Coke",
      "category": "Drinks",
      "size": null,
      "price": 2.99
    }
  ],
  "message": "Product created successfully"
}
```

---

## 3. Create Single Item (Alternative Method)

### 3a. Create Item for New Product

**Method:** `POST`  
**URL:** `http://localhost:5000/api/products/items`  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "product_name": "Burger",
  "description": "Juicy burger",
  "category": "Burgers",
  "size": "Small",
  "price": 8.99
}
```

### 3b. Create Item for Existing Product (by name)

**Method:** `POST`  
**URL:** `http://localhost:5000/api/products/items`  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "product_name": "Burger",
  "category": "Burgers",
  "size": "Medium",
  "price": 10.99
}
```

### 3c. Create Item for Existing Product (by ID)

**Method:** `POST`  
**URL:** `http://localhost:5000/api/products/items`  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "product_id": 1,
  "size": "Large",
  "price": 12.99
}
```

**Response (201 Created):**
```json
{
  "item_id": 5,
  "product_id": 1,
  "product_name": "Burger",
  "category": "Burgers",
  "size": "Large",
  "price": 12.99
}
```

---

## 4. Update Product Item

**Method:** `PUT`  
**URL:** `http://localhost:5000/api/products/items/{item_id}`  
**Example:** `http://localhost:5000/api/products/items/1`  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON) - Update price only:**
```json
{
  "price": 11.99
}
```

**Body (JSON) - Update multiple fields:**
```json
{
  "size": "Medium",
  "price": 13.99
}
```

**Body (JSON) - Update product name and item price:**
```json
{
  "product_name": "Margherita Pizza",
  "price": 14.99
}
```

**Response (200 OK):**
```json
{
  "item_id": 1,
  "product_id": 1,
  "product_name": "Margherita Pizza",
  "category": "Pizza",
  "size": "Medium",
  "price": 14.99
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Item not found"
}
```

---

## 5. Delete Product Item

**Method:** `DELETE`  
**URL:** `http://localhost:5000/api/products/items/{item_id}`  
**Example:** `http://localhost:5000/api/products/items/1`  
**Headers:** None required

**Response (200 OK):**
```json
{
  "message": "Item deleted successfully"
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Item not found"
}
```

---

## 6. Get All Categories

**Method:** `GET`  
**URL:** `http://localhost:5000/api/products/categories`  
**Headers:** None required

**Response (200 OK):**
```json
{
  "categories": ["Pizza", "Burgers", "Drinks", "Desserts"],
  "count": 4
}
```

---

## 7. Get Items by Category

**Method:** `GET`  
**URL:** `http://localhost:5000/api/products/items/category?category=Pizza`  
**Headers:** None required

**Query Parameters:**
- `category` (required): The category name to filter by

**Response (200 OK):**
```json
[
  {
    "item_id": 1,
    "product_id": 1,
    "product_name": "Pizza",
    "category": "Pizza",
    "size": "Small",
    "price": 10.99
  },
  {
    "item_id": 2,
    "product_id": 1,
    "product_name": "Pizza",
    "category": "Pizza",
    "size": "Medium",
    "price": 12.99
  }
]
```

**Error Response (400 Bad Request):**
```json
{
  "message": "category parameter is required"
}
```

---

## 8. Get Products by Category

**Method:** `GET`  
**URL:** `http://localhost:5000/api/products/products/category?category=Drinks`  
**Headers:** None required

**Query Parameters:**
- `category` (required): The category name to filter by

**Response (200 OK):**
```json
[
  {
    "product_id": 2,
    "name": "Coke",
    "description": "Refreshing cola drink",
    "category": "Drinks",
    "items": [
      {
        "item_id": 4,
        "product_id": 2,
        "product_name": "Coke",
        "category": "Drinks",
        "size": null,
        "price": 2.99
      }
    ]
  }
]
```

**Error Response (400 Bad Request):**
```json
{
  "message": "category parameter is required"
}
```

---

## Testing Scenarios

### Scenario 1: Create a Pizza with 3 sizes
1. Use endpoint **2a** to create Pizza with Small ($10.99), Medium ($12.99), Large ($15.99)
2. Use endpoint **1** to verify all 3 items were created

### Scenario 2: Create a Drink without size
1. Use endpoint **2b** to create Coke with price $2.99
2. Use endpoint **1** to verify the item was created

### Scenario 3: Update item price
1. Create an item using endpoint **2a** or **3a**
2. Note the `item_id` from response
3. Use endpoint **4** to update the price
4. Use endpoint **1** to verify the update

### Scenario 4: Delete an item
1. Create an item using endpoint **2a** or **3a**
2. Note the `item_id` from response
3. Use endpoint **5** to delete the item
4. Use endpoint **1** to verify deletion

### Scenario 5: Filter by category (Frontend Menu)
1. Use endpoint **6** to get all available categories
2. Display categories as filter buttons/tabs in frontend
3. When user clicks a category (e.g., "Pizza"), use endpoint **7** to get items
4. Display filtered items in the menu

### Scenario 6: Get products grouped by category
1. Use endpoint **6** to get all categories
2. For each category, use endpoint **8** to get products
3. Display products organized by category sections

---

## Error Cases

### Missing required field (category)
**Request:**
```json
{
  "product_name": "Pizza",
  "has_sizes": true,
  "prices": {
    "Small": 10.99,
    "Medium": 12.99,
    "Large": 15.99
  }
  // Missing "category" field
}
```
**Response (400 Bad Request):**
```json
{
  "message": "category is required"
}
```

### Missing required field (prices)
**Request:**
```json
{
  "product_name": "Pizza",
  "category": "Pizza",
  "has_sizes": true
  // Missing "prices" field
}
```
**Response (400 Bad Request):**
```json
{
  "message": "Price for 'Small' size is required"
}
```

### Product already exists
**Request:**
```json
{
  "product_name": "Pizza",
  "has_sizes": false,
  "price": 2.99
}
```
**Response (400 Bad Request):**
```json
{
  "message": "Product 'Pizza' already exists. Use update instead."
}
```

### Invalid item ID
**Request:** `PUT /api/products/items/999`  
**Response (404 Not Found):**
```json
{
  "message": "Item not found"
}
```

---

# Postman Testing Guide - Feedback API

## Base URL
```
http://localhost:5000/api/feedback
```

---

## 1. Add Feedback (After Order Completes)

**Method:** `POST`  
**URL:** `http://localhost:5000/api/feedback`  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "item_id": 1,
  "customer_id": 1,
  "no_of_stars": 5,
  "feedback_message": "Amazing pizza! Best I've ever had. Will definitely order again."
}
```

**Response (201 Created):**
```json
{
  "message": "Feedback added successfully",
  "feedback": {
    "feedback_id": 1,
    "item_id": 1,
    "item_name": "Pizza",
    "item_size": "Small",
    "customer_id": 1,
    "customer_name": "John Doe",
    "date": "2025-01-20T12:00:00.000000",
    "no_of_stars": 5,
    "feedback_message": "Amazing pizza! Best I've ever had. Will definitely order again."
  }
}
```

**Error Response (400 Bad Request) - Missing required field:**
```json
{
  "message": "item_id is required"
}
```

**Error Response (400 Bad Request) - Invalid rating:**
```json
{
  "message": "Rating must be between 1 and 5"
}
```

**Error Response (400 Bad Request) - Item not found:**
```json
{
  "message": "Product item not found"
}
```

**Error Response (400 Bad Request) - Customer not found:**
```json
{
  "message": "Customer not found"
}
```

---

## 2. Get Reviews by Product Item (Display with Menu Items)

**Method:** `GET`  
**URL:** `http://localhost:5000/api/feedback/item/{item_id}`  
**Example:** `http://localhost:5000/api/feedback/item/1`  
**Headers:** None required

**Response (200 OK):**
```json
{
  "item_id": 1,
  "item_name": "Pizza",
  "item_size": "Small",
  "average_rating": 4.5,
  "review_count": 10,
  "reviews": [
    {
      "feedback_id": 1,
      "item_id": 1,
      "item_name": "Pizza",
      "item_size": "Small",
      "customer_id": 1,
      "customer_name": "John Doe",
      "date": "2025-01-20T12:00:00.000000",
      "no_of_stars": 5,
      "feedback_message": "Amazing pizza! Best I've ever had. Will definitely order again."
    },
    {
      "feedback_id": 2,
      "item_id": 1,
      "item_name": "Pizza",
      "item_size": "Small",
      "customer_id": 2,
      "customer_name": "Jane Smith",
      "date": "2025-01-19T10:30:00.000000",
      "no_of_stars": 4,
      "feedback_message": "Great taste, but delivery was a bit slow."
    },
    {
      "feedback_id": 3,
      "item_id": 1,
      "item_name": "Pizza",
      "item_size": "Small",
      "customer_id": 3,
      "customer_name": "Bob Johnson",
      "date": "2025-01-18T15:45:00.000000",
      "no_of_stars": 5,
      "feedback_message": "Perfect! Highly recommended."
    }
  ]
}
```

**Response (200 OK) - No reviews yet:**
```json
{
  "item_id": 5,
  "item_name": "Coke",
  "item_size": null,
  "average_rating": 0.0,
  "review_count": 0,
  "reviews": []
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Product item not found"
}
```

---

## 3. Get Top 5 Featured Reviews (For Landing Page)

**Method:** `GET`  
**URL:** `http://localhost:5000/api/feedback/featured`  
**Headers:** None required

**Query Parameters (Optional):**
- `limit` (default: 5): Number of featured reviews to return
  - Example: `http://localhost:5000/api/feedback/featured?limit=3`

**Response (200 OK):**
```json
{
  "featured_reviews": [
    {
      "feedback_id": 1,
      "item_id": 1,
      "item_name": "Pizza",
      "item_size": "Small",
      "customer_id": 1,
      "customer_name": "John Doe",
      "date": "2025-01-20T12:00:00.000000",
      "no_of_stars": 5,
      "feedback_message": "Amazing pizza! Best I've ever had. Will definitely order again."
    },
    {
      "feedback_id": 5,
      "item_id": 2,
      "item_name": "Pizza",
      "item_size": "Medium",
      "customer_id": 4,
      "customer_name": "Alice Brown",
      "date": "2025-01-19T14:20:00.000000",
      "no_of_stars": 5,
      "feedback_message": "Absolutely delicious! The perfect size for sharing."
    },
    {
      "feedback_id": 8,
      "item_id": 3,
      "item_name": "Burger",
      "item_size": "Large",
      "customer_id": 5,
      "customer_name": "Charlie Wilson",
      "date": "2025-01-18T16:10:00.000000",
      "no_of_stars": 5,
      "feedback_message": "Best burger in town! Juicy and flavorful."
    },
    {
      "feedback_id": 12,
      "item_id": 4,
      "item_name": "Coke",
      "item_size": null,
      "customer_id": 6,
      "customer_name": "Diana Prince",
      "date": "2025-01-17T11:30:00.000000",
      "no_of_stars": 5,
      "feedback_message": "Refreshing and cold, exactly what I needed!"
    },
    {
      "feedback_id": 15,
      "item_id": 1,
      "item_name": "Pizza",
      "item_size": "Small",
      "customer_id": 7,
      "customer_name": "Edward Lee",
      "date": "2025-01-16T09:15:00.000000",
      "no_of_stars": 4,
      "feedback_message": "Great pizza, good value for money."
    }
  ],
  "count": 5
}
```

**Response (200 OK) - No reviews available:**
```json
{
  "featured_reviews": [],
  "count": 0
}
```

---

## 4. Get All Feedbacks (Admin/Management)

**Method:** `GET`  
**URL:** `http://localhost:5000/api/feedback`  
**Headers:** None required

**Response (200 OK):**
```json
{
  "feedbacks": [
    {
      "feedback_id": 1,
      "item_id": 1,
      "item_name": "Pizza",
      "item_size": "Small",
      "customer_id": 1,
      "customer_name": "John Doe",
      "date": "2025-01-20T12:00:00.000000",
      "no_of_stars": 5,
      "feedback_message": "Amazing pizza! Best I've ever had. Will definitely order again."
    },
    {
      "feedback_id": 2,
      "item_id": 1,
      "item_name": "Pizza",
      "item_size": "Small",
      "customer_id": 2,
      "customer_name": "Jane Smith",
      "date": "2025-01-19T10:30:00.000000",
      "no_of_stars": 4,
      "feedback_message": "Great taste, but delivery was a bit slow."
    }
  ],
  "count": 2
}
```

---

## Testing Scenarios

### Scenario 1: Complete Feedback Flow
1. **Create a customer** (if not exists) using customer registration endpoint
2. **Get product items** using `GET /api/products/items` to find an `item_id`
3. **Add feedback** using endpoint **1** with valid `item_id`, `customer_id`, `no_of_stars` (1-5), and optional `feedback_message`
4. **Verify feedback** using endpoint **2** to see the review appears in the item's reviews

### Scenario 2: Display Reviews with Menu Items (Frontend)
1. **Get all product items** using `GET /api/products/items`
2. For each item, **get reviews** using endpoint **2** with the `item_id`
3. Display the `average_rating` and `review_count` next to each menu item
4. Show individual reviews when user clicks to view details

### Scenario 3: Featured Reviews on Landing Page
1. **Get featured reviews** using endpoint **3** (default limit: 5)
2. Display the top 5 reviews on the landing page
3. Optionally use `?limit=3` to show only 3 featured reviews

### Scenario 4: Multiple Reviews for Same Item
1. **Add multiple feedbacks** for the same `item_id` with different ratings
2. **Get reviews by item** using endpoint **2**
3. Verify that `average_rating` is calculated correctly
4. Verify that `review_count` matches the number of reviews

### Scenario 5: Feedback Without Message
1. **Add feedback** with only required fields (no `feedback_message`):
```json
{
  "item_id": 1,
  "customer_id": 1,
  "no_of_stars": 4
}
```
2. Verify feedback is created successfully with `feedback_message: null`

---

## Error Cases

### Missing Required Field - item_id
**Request:**
```json
{
  "customer_id": 1,
  "no_of_stars": 5,
  "feedback_message": "Great food!"
}
```
**Response (400 Bad Request):**
```json
{
  "message": "item_id is required"
}
```

### Missing Required Field - customer_id
**Request:**
```json
{
  "item_id": 1,
  "no_of_stars": 5,
  "feedback_message": "Great food!"
}
```
**Response (400 Bad Request):**
```json
{
  "message": "customer_id is required"
}
```

### Missing Required Field - no_of_stars
**Request:**
```json
{
  "item_id": 1,
  "customer_id": 1,
  "feedback_message": "Great food!"
}
```
**Response (400 Bad Request):**
```json
{
  "message": "no_of_stars is required"
}
```

### Invalid Rating - Below 1
**Request:**
```json
{
  "item_id": 1,
  "customer_id": 1,
  "no_of_stars": 0,
  "feedback_message": "Not good"
}
```
**Response (400 Bad Request):**
```json
{
  "message": "Rating must be between 1 and 5"
}
```

### Invalid Rating - Above 5
**Request:**
```json
{
  "item_id": 1,
  "customer_id": 1,
  "no_of_stars": 6,
  "feedback_message": "Excellent!"
}
```
**Response (400 Bad Request):**
```json
{
  "message": "Rating must be between 1 and 5"
}
```

### Invalid Rating - Not an Integer
**Request:**
```json
{
  "item_id": 1,
  "customer_id": 1,
  "no_of_stars": "five",
  "feedback_message": "Great!"
}
```
**Response (400 Bad Request):**
```json
{
  "message": "Rating must be between 1 and 5"
}
```

### Invalid Item ID
**Request:** `POST /api/feedback`  
**Body:**
```json
{
  "item_id": 999,
  "customer_id": 1,
  "no_of_stars": 5
}
```
**Response (400 Bad Request):**
```json
{
  "message": "Product item not found"
}
```

### Invalid Customer ID
**Request:** `POST /api/feedback`  
**Body:**
```json
{
  "item_id": 1,
  "customer_id": 999,
  "no_of_stars": 5
}
```
**Response (400 Bad Request):**
```json
{
  "message": "Customer not found"
}
```

### Get Reviews for Non-existent Item
**Request:** `GET /api/feedback/item/999`  
**Response (404 Not Found):**
```json
{
  "message": "Product item not found"
}
```

---

## Sample Test Data Setup

### Step 1: Create Customers
Use customer registration endpoint to create test customers:
```json
POST /api/customers/register
{
  "name": "John Doe",
  "phone": "1234567890",
  "address": "123 Main St"
}
```

### Step 2: Create Products and Items
Use product endpoints to create items (refer to Product API documentation)

### Step 3: Add Sample Feedbacks
```json
POST /api/feedback
{
  "item_id": 1,
  "customer_id": 1,
  "no_of_stars": 5,
  "feedback_message": "Excellent! Highly recommended."
}

POST /api/feedback
{
  "item_id": 1,
  "customer_id": 2,
  "no_of_stars": 4,
  "feedback_message": "Very good, will order again."
}

POST /api/feedback
{
  "item_id": 2,
  "customer_id": 1,
  "no_of_stars": 5,
  "feedback_message": "Perfect size and taste!"
}
```

### Step 4: Test Featured Reviews
```json
GET /api/feedback/featured
```
This should return reviews from items with highest average ratings.

---

## Integration Notes

### Frontend Integration Points:

1. **Menu Display:**
   - When displaying menu items, call `GET /api/feedback/item/{item_id}` for each item
   - Show `average_rating` (e.g., ⭐ 4.5) and `review_count` (e.g., "10 reviews")
   - Allow users to click to see all reviews

2. **Order Completion:**
   - After order is marked as completed, show feedback form
   - Pre-fill `item_id` and `customer_id` from the order
   - Allow customer to rate (1-5 stars) and optionally add message
   - Submit using `POST /api/feedback`

3. **Landing Page:**
   - On page load, call `GET /api/feedback/featured?limit=5`
   - Display the 5 featured reviews in a carousel or grid
   - Show customer name, rating stars, and feedback message

4. **Product Detail Page:**
   - When viewing a specific product item, call `GET /api/feedback/item/{item_id}`
   - Display all reviews sorted by date (newest first)
   - Show average rating prominently at the top

