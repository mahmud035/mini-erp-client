import { api } from '@/api/axios'
import type { ApiResponse, Product, ProductListResponse } from '@/api/types'

export interface ProductListParams {
  searchTerm?: string
  page: number
  limit: number
}

/** GET /products — paginated, searchable list. */
async function getProducts(
  params: ProductListParams,
): Promise<ProductListResponse> {
  const { data } = await api.get<ApiResponse<ProductListResponse>>(
    '/products',
    {
      params,
    },
  )
  return data.data
}

/** GET /products/:id — one product. */
async function getProduct(id: string): Promise<Product> {
  const { data } = await api.get<ApiResponse<Product>>(`/products/${id}`)
  return data.data
}

/** POST /products — multipart create (image required). */
async function createProduct(formData: FormData): Promise<Product> {
  const { data } = await api.post<ApiResponse<Product>>('/products', formData)
  return data.data
}

/** PATCH /products/:id — multipart update (image optional). */
async function updateProduct(id: string, formData: FormData): Promise<Product> {
  const { data } = await api.patch<ApiResponse<Product>>(
    `/products/${id}`,
    formData,
  )
  return data.data
}

/** DELETE /products/:id. */
async function deleteProduct(id: string): Promise<void> {
  await api.delete<ApiResponse<null>>(`/products/${id}`)
}

export const productApi = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
}
