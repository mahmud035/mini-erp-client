import type { CreateSalePayload, Customer, Product } from '@/api/types'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { SaleItemRow } from '@/features/sale/components/SaleItemRow'
import { useCreateSale } from '@/features/sale/sale.hooks'
import {
  saleSchema,
  type SaleFormValues,
} from '@/features/sale/sale.validation'
import { formatCurrency } from '@/utils/formatCurrency'
import { selectClassName } from '@/utils/selectClassName'
import { zodResolver } from '@/utils/zodResolver'
import axios from 'axios'
import { ChevronDown, Plus } from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'

const EMPTY_SALE: SaleFormValues = {
  customer: '',
  items: [{ product: '', quantity: 1 }],
}

interface SaleFormProps {
  customers: Customer[]
  products: Product[]
}

/**
 * Sale-create form: pick a customer, add product lines, watch a live advisory
 * total, submit. The submitted total is whatever the server computes — the
 * on-screen total and per-row stock check are advisory previews only.
 */
export function SaleForm({ customers, products }: SaleFormProps) {
  const createSale = useCreateSale()
  const [successTotal, setSuccessTotal] = useState<number | null>(null)

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: EMPTY_SALE,
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  // Read a message off the local resolver's FLAT error keys (e.g.
  // `items.0.product`) — it does not build nested array error objects.
  const fieldMsg = (path: string): string | undefined =>
    (errors as Record<string, { message?: string } | undefined>)[path]?.message

  // Advisory derivations from the loaded product list. `sellingPrice` drives the
  // line/grand total; stock drives the per-row "only N in stock" block.
  // `useWatch` (not `watch`) subscribes reactively AND is React-Compiler-safe.
  const watchedItems = useWatch({ control, name: 'items' })
  const rows = fields.map((field, index) => {
    const raw = watchedItems?.[index]
    const product = products.find((p) => p._id === raw?.product)
    const quantity = Number(raw?.quantity) || 0
    const lineTotal = product ? product.sellingPrice * quantity : 0
    const stockExceeded = !!product && quantity > product.stockQuantity
    return { key: field.id, index, product, lineTotal, stockExceeded }
  })
  const grandTotal = rows.reduce((sum, r) => sum + r.lineTotal, 0)
  const hasStockError = rows.some((r) => r.stockExceeded)

  const onSubmit = handleSubmit((values) => {
    // Starting a new submit clears any prior success/error banners.
    setSuccessTotal(null)
    clearErrors('root')

    // Client advisory block for the stock race (submit button is also disabled).
    if (hasStockError) return

    // Strip to the server's strict shape; force `quantity` to a real number so
    // it never ships as a string (JSON request — a string 400s).
    const payload: CreateSalePayload = {
      customer: values.customer,
      items: values.items.map((item) => ({
        product: item.product,
        quantity: Number(item.quantity),
      })),
    }

    createSale.mutate(payload, {
      onSuccess: (sale) => {
        setSuccessTotal(sale.grandTotal)
        reset(EMPTY_SALE)
      },
      onError: (error) => {
        // Surface the server's transactional-abort message; never hardcode a
        // status — the whole sale is aborted server-side on any bad line.
        const message =
          axios.isAxiosError(error) && error.response?.data?.message
            ? (error.response.data.message as string)
            : 'Could not record the sale. Please try again.'
        setError('root', { message })
      },
    })
  })

  return (
    <form
      onSubmit={onSubmit}
      // Any edit after a success clears the stale total banner.
      onChange={() => successTotal !== null && setSuccessTotal(null)}
      noValidate
      className="grid gap-6"
    >
      <div className="grid gap-2">
        <Label htmlFor="customer">Customer</Label>
        <div className="relative">
          <select
            id="customer"
            className={selectClassName}
            aria-invalid={!!errors.customer}
            {...register('customer')}
          >
            <option value="">Select a customer…</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.name} — {customer.phone}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        {errors.customer && (
          <p className="text-sm text-destructive">{errors.customer.message}</p>
        )}
      </div>

      <div className="grid gap-3">
        <div className="flex items-center justify-between">
          <Label>Products</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ product: '', quantity: 1 })}
          >
            <Plus />
            Add line
          </Button>
        </div>

        {rows.map((row) => (
          <SaleItemRow
            key={row.key}
            index={row.index}
            register={register}
            products={products}
            productError={fieldMsg(`items.${row.index}.product`)}
            quantityError={fieldMsg(`items.${row.index}.quantity`)}
            lineTotal={row.lineTotal}
            stockExceeded={row.stockExceeded}
            stockAvailable={row.product?.stockQuantity ?? 0}
            onRemove={() => remove(row.index)}
            canRemove={fields.length > 1}
          />
        ))}

        {/* Array-level error (e.g. all lines removed). */}
        {fieldMsg('items') && (
          <p className="text-sm text-destructive">{fieldMsg('items')}</p>
        )}
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
        <span className="text-sm text-muted-foreground">
          Total (preview — server confirms on submit)
        </span>
        <span className="text-2xl font-semibold text-foreground tabular-nums">
          {formatCurrency(grandTotal)}
        </span>
      </div>

      {successTotal !== null && (
        <p
          role="status"
          className="rounded-md border border-success/20 bg-success/10 px-3 py-2 text-sm text-success"
        >
          Sale recorded. Server grand total: {formatCurrency(successTotal)}.
        </p>
      )}

      {errors.root && (
        <p
          role="alert"
          className="rounded-md border border-danger/20 bg-danger/10 px-3 py-2 text-sm text-danger"
        >
          {errors.root.message}
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={createSale.isPending || hasStockError}>
          {createSale.isPending ? 'Recording…' : 'Record sale'}
        </Button>
      </div>
    </form>
  )
}
