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

