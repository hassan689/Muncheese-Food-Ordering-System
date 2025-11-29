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




