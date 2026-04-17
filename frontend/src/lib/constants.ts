export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  PRODUCTS: '/products',
  PRODUCT_NEW: '/products/new',
  PRODUCT_EDIT: '/products/:id',
} as const

export const DEFAULT_PAGE_SIZE = 20
