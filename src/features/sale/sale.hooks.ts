import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { saleApi } from '@/features/sale/sale.api'

/**
 * Query keys owned by the sale feature. The picker reads are namespaced under
 * `['sale', ...]` so they never collide with the Products page's own
 * `['products', params]` paginated/search cache.
 */
export const saleKeys = {
  customers: ['sale', 'customers'] as const,
  products: ['sale', 'products'] as const,
}

/** Customer options for the sale picker (perm `customer:read`). */
export function useCustomerOptions() {
  return useQuery({
    queryKey: saleKeys.customers,
    queryFn: saleApi.listCustomers,
  })
}

/** Product options for the sale picker (perm `product:read`). */
export function useProductOptions() {
  return useQuery({
    queryKey: saleKeys.products,
    queryFn: saleApi.listProducts,
  })
}

/**
 * Create a sale. On success, invalidate everything a sale moves:
 *  - `['dashboard']` — sales count +1, low-stock summary refresh.
 *  - `['products']`  — the Products page's stock is now stale.
 *  - the sale picker's product cache — so a second sale sees honest stock.
 *
 * Other features' keys are referenced as LITERALS (not by importing their key
 * objects) to respect the `features/` boundary — no cross-feature imports.
 */
export function useCreateSale() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saleApi.createSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: saleKeys.products })
    },
  })
}
