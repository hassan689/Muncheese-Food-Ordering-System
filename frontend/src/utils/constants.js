export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
}

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
}

// Constants defined for Admin Pages
export const ADMIN_COLORS = {
  Primary: "#FFB800",
  Secondary: "#FFFBE9",
  Hover: "#fbe3a5ff",
}