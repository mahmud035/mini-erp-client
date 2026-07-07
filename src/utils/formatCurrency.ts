/**
 * Display-only money formatter: a Taka symbol + two decimals. Presentation
 * helper shared across features (products + sales) — it never changes a value,
 * only how it renders. Pair with `tabular-nums` and right-alignment at the call
 * site for aligned columns.
 */
export function formatCurrency(value: number): string {
  return `৳${value.toFixed(2)}`
}
