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

/**
 * A sales customer. Mirrors the raw Mongoose doc the API returns — the id is
 * `_id` (customer responses have no serializer, like products). `name` and
 * `phone` are required; `email`/`address` are optional contact details.
 */
export interface Customer {
  _id: string
  name: string
  phone: string
  email?: string
  address?: string
  createdAt: string
  updatedAt: string
}

/** `data` of GET /customers. */
export type CustomerListResponse = Paginated<Customer>

/**
 * Body of POST /sales. The server validates with `z.strictObject`, so ONLY
 * these fields may be sent per line — every display field (name, price, totals)
 * must be stripped before submit. `quantity` must serialise as a real number.
 */
export interface CreateSalePayload {
  customer: string
  items: { product: string; quantity: number }[]
}

/**
 * One line of a completed sale. `unitPrice` is a server snapshot of the
 * product's `sellingPrice` at sale time; `lineTotal` = unitPrice * quantity.
 * The subdocument has no own `_id`.
 */
export interface SaleLine {
  product: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

/**
 * A completed, immutable sale returned by POST /sales. `grandTotal` is always
 * server-computed (Σ lineTotal) — the client's live total is advisory only.
 */
export interface Sale {
  _id: string
  customer: string
  items: SaleLine[]
  grandTotal: number
  soldBy: string
  createdAt: string
  updatedAt: string
}
