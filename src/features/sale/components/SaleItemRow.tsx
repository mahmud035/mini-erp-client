import { ChevronDown, X } from 'lucide-react'
import type { UseFormRegister } from 'react-hook-form'
import type { Product } from '@/api/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { SaleFormValues } from '@/features/sale/sale.validation'
import { formatCurrency } from '@/utils/formatCurrency'
import { selectClassName } from '@/utils/selectClassName'

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
      <div className="grid grid-cols-[1fr_5rem_7rem_auto] items-end gap-3">
        <div className="grid gap-1.5">
          <label
            htmlFor={`items.${index}.product`}
            className="text-xs text-muted-foreground"
          >
            Product
          </label>
          <div className="relative">
            <select
              id={`items.${index}.product`}
              className={selectClassName}
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
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="grid gap-1.5">
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

        <div className="grid gap-1.5 text-right">
          <span className="text-xs text-muted-foreground">Line total</span>
          <span className="h-8 py-1 text-sm tabular-nums">
            {formatCurrency(lineTotal)}
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
