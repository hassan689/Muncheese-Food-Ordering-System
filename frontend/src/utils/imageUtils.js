/**
 * Utility functions for fetching food images
 */

// Food image mapping - using food image API endpoints
// Using TheMealDB API (free, no API key needed) for food images
// Using Unsplash for drinks and other items
const FOOD_IMAGE_MAP = {
  // Pizza variations - using TheMealDB pizza images
  'pizza': 'https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg',
  'deluxe pizza': 'https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg',
  'farm house': 'https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg',
  'farmhouse': 'https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg',
  'margherita': 'https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg',
  'pepperoni': 'https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg',
  'veggie': 'https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg',
  'tandoori': 'https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg',
  'chicken tikka': 'https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg',
  'fajita': 'https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg',
  'bbq chicken': 'https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg',
  
  // Burgers - using TheMealDB burger images
  'burger': 'https://www.themealdb.com/images/media/meals/xxpqsy1511452222.jpg',
  'cheeseburger': 'https://www.themealdb.com/images/media/meals/xxpqsy1511452222.jpg',
  'chicken burger': 'https://www.themealdb.com/images/media/meals/xxpqsy1511452222.jpg',
  'beef burger': 'https://www.themealdb.com/images/media/meals/xxpqsy1511452222.jpg',
  'zinger': 'https://www.themealdb.com/images/media/meals/xxpqsy1511452222.jpg',
  'fish burger': 'https://www.themealdb.com/images/media/meals/xxpqsy1511452222.jpg',
  
  // Fries - using TheMealDB fries images
  'fries': 'https://www.themealdb.com/images/media/meals/15qdrr1582484696.jpg',
  'french fries': 'https://www.themealdb.com/images/media/meals/15qdrr1582484696.jpg',
  'regular fries': 'https://www.themealdb.com/images/media/meals/15qdrr1582484696.jpg',
  'masala fries': 'https://www.themealdb.com/images/media/meals/15qdrr1582484696.jpg',
  'garlic mayo fries': 'https://www.themealdb.com/images/media/meals/15qdrr1582484696.jpg',
  
  // Drinks - using Unsplash for drinks
  'drink': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop&auto=format',
  'cola': 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop&auto=format',
  'coca-cola': 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop&auto=format',
  'coke': 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop&auto=format',
  'sprite': 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=400&fit=crop&auto=format',
  'fanta': 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop&auto=format',
  'juice': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&auto=format',
  'soda': 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop&auto=format',
  'fresh lime': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&auto=format',
  'lime': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&auto=format',
  
  // Desserts - using TheMealDB dessert images
  'dessert': 'https://www.themealdb.com/images/media/meals/vrspxv1511722107.jpg',
  'ice cream': 'https://www.themealdb.com/images/media/meals/vrspxv1511722107.jpg',
  'cake': 'https://www.themealdb.com/images/media/meals/vrspxv1511722107.jpg',
  'chocolate lava cake': 'https://www.themealdb.com/images/media/meals/vrspxv1511722107.jpg',
  'lava cake': 'https://www.themealdb.com/images/media/meals/vrspxv1511722107.jpg',
  
  // Wings - using TheMealDB chicken images
  'wings': 'https://www.themealdb.com/images/media/meals/1529447463.jpg',
  'chicken wings': 'https://www.themealdb.com/images/media/meals/1529447463.jpg',
  'hot wings': 'https://www.themealdb.com/images/media/meals/1529447463.jpg',
  'bbq wings': 'https://www.themealdb.com/images/media/meals/1529447463.jpg',
  
  // Pasta - using TheMealDB pasta images
  'pasta': 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg',
  'spaghetti': 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg',
  'creamy pasta': 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg',
  'spicy pasta': 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg',
  
  // Salad - using TheMealDB salad images
  'salad': 'https://www.themealdb.com/images/media/meals/1549542994.jpg',
  'garden salad': 'https://www.themealdb.com/images/media/meals/1549542994.jpg',
  'fresh garden salad': 'https://www.themealdb.com/images/media/meals/1549542994.jpg',
}

/**
 * Get food image URL based on product name and category
 * @param {string} productName - Name of the product
 * @param {string} category - Category of the product
 * @returns {string} Image URL
 */
export const getFoodImage = (productName, category) => {
  if (!productName) return null
  
  const nameLower = productName.toLowerCase().trim()
  const categoryLower = category?.toLowerCase()?.trim() || ''
  
  // First, try to find exact or partial match in the map by product name
  // Sort by key length (longest first) to match more specific names first
  const sortedKeys = Object.keys(FOOD_IMAGE_MAP).sort((a, b) => b.length - a.length)
  
  for (const key of sortedKeys) {
    if (nameLower.includes(key) || key.includes(nameLower)) {
      return FOOD_IMAGE_MAP[key]
    }
  }
  
  // If no match found, use category-based fallback
  if (categoryLower) {
    if (categoryLower.includes('pizza')) {
      return FOOD_IMAGE_MAP['pizza']
    } else if (categoryLower.includes('burger')) {
      return FOOD_IMAGE_MAP['burger']
    } else if (categoryLower.includes('fries') || categoryLower.includes('fry')) {
      return FOOD_IMAGE_MAP['fries']
    } else if (categoryLower.includes('drink') || categoryLower.includes('beverage')) {
      return FOOD_IMAGE_MAP['drink']
    } else if (categoryLower.includes('dessert')) {
      return FOOD_IMAGE_MAP['dessert']
    } else if (categoryLower.includes('wings')) {
      return FOOD_IMAGE_MAP['wings']
    } else if (categoryLower.includes('pasta')) {
      return FOOD_IMAGE_MAP['pasta']
    } else if (categoryLower.includes('salad')) {
      return FOOD_IMAGE_MAP['salad']
    }
  }
  
  // Default food image
  return FOOD_IMAGE_MAP['pizza']
}

/**
 * Generate a food image URL based on product name
 * Uses TheMealDB API or fallback to category-based image
 * @param {string} productName - Product name
 * @param {string} category - Food category
 * @returns {string} Image URL
 */
export const generateFoodImageUrl = (productName, category) => {
  // Try to get category-based image first
  const categoryLower = category?.toLowerCase() || ''
  
  if (categoryLower.includes('pizza')) {
    return FOOD_IMAGE_MAP['pizza']
  } else if (categoryLower.includes('burger')) {
    return FOOD_IMAGE_MAP['burger']
  } else if (categoryLower.includes('fries') || categoryLower.includes('fry')) {
    return FOOD_IMAGE_MAP['fries']
  } else if (categoryLower.includes('drink') || categoryLower.includes('beverage')) {
    return FOOD_IMAGE_MAP['drink']
  } else if (categoryLower.includes('dessert')) {
    return FOOD_IMAGE_MAP['dessert']
  } else if (categoryLower.includes('wings')) {
    return FOOD_IMAGE_MAP['wings']
  } else if (categoryLower.includes('pasta')) {
    return FOOD_IMAGE_MAP['pasta']
  } else if (categoryLower.includes('salad')) {
    return FOOD_IMAGE_MAP['salad']
  }
  
  // Default food image
  return FOOD_IMAGE_MAP['pizza']
}

/**
 * Get image URL with fallback strategy
 * @param {string} productName - Product name
 * @param {string} category - Product category
 * @param {string} existingImageUrl - Existing image URL from backend
 * @returns {string} Image URL
 */
export const getProductImage = (productName, category, existingImageUrl = null) => {
  // If backend provides image, use it
  if (existingImageUrl && existingImageUrl.trim() !== '') {
    return existingImageUrl
  }
  
  // Try to get from our mapping first
  const mappedImage = getFoodImage(productName, category)
  if (mappedImage && !mappedImage.includes('seed/food-')) {
    return mappedImage
  }
  
  // Otherwise, generate a consistent image based on product name
  return generateFoodImageUrl(productName, category)
}

