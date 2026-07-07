import { api } from '@/api/axios'
import type {
  ApiResponse,
  CreateSalePayload,
  Customer,
  CustomerListResponse,
  Product,
  ProductListResponse,
  Sale,
} from '@/api/types'

/**
 * GET /customers — the sale picker only needs the array, so we unwrap to
 * `items` and drop pagination. Demo-scale: `limit=100`, no in-picker search.
 */
async function listCustomers(): Promise<Customer[]> {
  const { data } = await api.get<ApiResponse<CustomerListResponse>>(
    '/customers',
    { params: { limit: 100 } },
  )
  return data.data.items
}

/**
 * GET /products — same shape as the customer picker. We need `_id`, `name`,
 * `sellingPrice`, and `stockQuantity` for the picker + advisory total.
 */
async function listProducts(): Promise<Product[]> {
  const { data } = await api.get<ApiResponse<ProductListResponse>>('/products', {
    params: { limit: 100 },
  })
  return data.data.items
}

/** POST /sales — transactional stock decrement server-side; returns the sale. */
async function createSale(payload: CreateSalePayload): Promise<Sale> {
  const { data } = await api.post<ApiResponse<Sale>>('/sales', payload)
  return data.data
}

export const saleApi = {
  listCustomers,
  listProducts,
  createSale,
}
