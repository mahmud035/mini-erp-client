/**
 * Response envelope returned by every Mini ERP API endpoint.
 * Mirrors the backend 1:1 so a contract change breaks TypeScript at
 * compile time, not runtime.
 */
export interface ApiResponse<T> {
  statusCode: number
  success: boolean
  message: string
  data: T
}

/**
 * The single client-facing user shape. Mirrors the backend `UserResponse`
 * exactly (produced by `toUserResponse`) — the password hash never crosses.
 */
export interface User {
  id: string
  name: string
  email: string
  role: { id: string; name: string }
  permissions: string[]
  isActive: boolean
}

/** `data` of POST /auth/login. */
export interface LoginResponse {
  user: User
  accessToken: string
}

/** `data` of POST /auth/refresh. */
export interface RefreshResponse {
  accessToken: string
}

/** `data` of GET /auth/me. */
export type MeResponse = User

/** A low-stock product summary surfaced on the dashboard (no id — key by sku). */
export interface LowStockProduct {
  name: string
  sku: string
  stockQuantity: number
}

/** `data` of GET /dashboard. */
export interface DashboardStats {
  totalProducts: number
  totalCustomers: number
  totalSales: number
  lowStockProducts: LowStockProduct[]
}

/** A Cloudinary image reference stored on a product. */
export interface ProductImage {
  url: string
  publicId: string
}

/**
 * An inventory item. Mirrors the raw Mongoose doc the API returns — the id is
 * `_id` (product responses have no serializer, unlike auth's `id`).
 */
export interface Product {
  _id: string
  name: string
  sku: string
  category: string
  purchasePrice: number
  sellingPrice: number
  stockQuantity: number
  image: ProductImage
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/** Generic paginated list envelope from the shared backend QueryBuilder. */
export interface Paginated<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/** `data` of GET /products. */
export type ProductListResponse = Paginated<Product>
