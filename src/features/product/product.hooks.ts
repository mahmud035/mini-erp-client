import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  productApi,
  type ProductListParams,
} from '@/features/product/product.api'

/** Query keys owned by the product feature. */
export const productKeys = {
  all: ['products'] as const,
  list: (params: ProductListParams) => ['products', params] as const,
}

/**
 * Paginated product list. `keepPreviousData` holds the current page on screen
 * while the next one loads — no flash to empty between pages.
 */
export function useProducts(params: ProductListParams) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productApi.getProducts(params),
    placeholderData: keepPreviousData,
  })
}

/** Create a product (multipart). Invalidates the list on success. */
export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) => productApi.createProduct(formData),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productKeys.all }),
  })
}

/** Update a product (multipart). Invalidates the list on success. */
export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      productApi.updateProduct(id, formData),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productKeys.all }),
  })
}

/** Delete a product. Invalidates the list on success. */
export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => productApi.deleteProduct(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productKeys.all }),
  })
}
