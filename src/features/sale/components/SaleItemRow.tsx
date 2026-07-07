import { X } from 'lucide-react'
import type { UseFormRegister } from 'react-hook-form'
import type { Product } from '@/api/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { SaleFormValues } from '@/features/sale/sale.validation'

/** Native-select styling, matched to the shared `Input` component. */
const selectClass =
  'h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30'

interface SaleItemRowProps {
  index: number
  register: UseFormRegister<SaleFormValues>
  products: Product[]
  productError?: string
  quantityError?: string
  lineTotal: number
  /** Set when the picked quantity exceeds the product's known stock. */
  stockExceeded: boolean
  stockAvailable: number
  onRemove: () => void
  canRemove: boolean
}

/**
 * One sale line: product picker, quantity, advisory line total, remove button.
 * Presentational — all derived numbers + error messages come from the form.
 */
export function SaleItemRow({
  index,
  register,
  products,
  productError,
  quantityError,
  lineTotal,
  stockExceeded,
  stockAvailable,
  onRemove,
  canRemove,
}: SaleItemRowProps) {
  return (
    <div className="grid gap-2 rounded-lg border p-3">
      <div className="flex items-end gap-3">
        <div className="grid flex-1 gap-1.5">
          <label
            htmlFor={`items.${index}.product`}
            className="text-xs text-muted-foreground"
          >
            Product
          </label>
          <select
            id={`items.${index}.product`}
            className={selectClass}
            aria-invalid={!!productError}
            {...register(`items.${index}.product`)}
          >
            <option value="">Select a product…</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name} — {product.stockQuantity} in stock
              </option>
            ))}
          </select>
        </div>

        <div className="grid w-24 gap-1.5">
          <label
            htmlFor={`items.${index}.quantity`}
            className="text-xs text-muted-foreground"
          >
            Qty
          </label>
          <Input
            id={`items.${index}.quantity`}
            type="number"
            min={1}
            step={1}
            aria-invalid={!!quantityError || stockExceeded}
            {...register(`items.${index}.quantity`)}
          />
        </div>

        <div className="grid w-28 gap-1.5 text-right">
          <span className="text-xs text-muted-foreground">Line total</span>
          <span className="h-8 py-1 text-sm tabular-nums">
            ৳{lineTotal.toFixed(2)}
          </span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={!canRemove}
          aria-label="Remove line"
        >
          <X />
        </Button>
      </div>

      {(productError || quantityError || stockExceeded) && (
        <div className="grid gap-0.5">
          {productError && (
            <p className="text-sm text-destructive">{productError}</p>
          )}
          {quantityError && (
            <p className="text-sm text-destructive">{quantityError}</p>
          )}
          {stockExceeded && (
            <p className="text-sm text-destructive">
              Only {stockAvailable} in stock
            </p>
          )}
        </div>
      )}
    </div>
  )
}
