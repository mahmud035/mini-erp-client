/**
 * Display-only mapping from a stock quantity to a semantic badge variant. This
 * is a presentation remap of the existing `stockQuantity` value — it does not
 * change the low-stock threshold, the query, or the socket alert.
 *
 * `0` → danger (out of stock), `1–4` → warning (low), `≥5` → neutral (healthy).
 * Shared across features (products table + dashboard low-stock) so stock reads
 * the same everywhere.
 */
export function stockBadgeVariant(
  quantity: number,
): 'danger' | 'warning' | 'neutral' {
  if (quantity === 0) return 'danger'
  if (quantity < 5) return 'warning'
  return 'neutral'
}
