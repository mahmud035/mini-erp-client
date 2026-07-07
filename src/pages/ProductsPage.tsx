import type { Product } from '@/api/types'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/features/auth/auth.hooks'
import { DeleteProductDialog } from '@/features/product/components/DeleteProductDialog'
import { ProductFormDialog } from '@/features/product/components/ProductFormDialog'
import { ProductTable } from '@/features/product/components/ProductTable'
import { useProducts } from '@/features/product/product.hooks'
import { useDebounce } from '@/hooks/useDebounce'
import { Plus, Search } from 'lucide-react'
import { useState } from 'react'

const LIMIT = 10

interface FormDialogState {
  open: boolean
  mode: 'create' | 'edit'
  product?: Product
}

/** Products page: search, paginated list, and gated create/edit/delete. */
export function ProductsPage() {
  const { can } = useAuth()
  const canCreate = can('product:create')
  const canUpdate = can('product:update')
  const canDelete = can('product:delete')

  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(searchInput, 400)

  // A new search term resets to page 1 (handled at the event, not in an effect).
  const onSearchChange = (value: string) => {
    setSearchInput(value)
    setPage(1)
  }

  const { data, isPending, isError, refetch, isFetching } = useProducts({
    searchTerm: debouncedSearch || undefined,
    page,
    limit: LIMIT,
  })

  const [formDialog, setFormDialog] = useState<FormDialogState>({
    open: false,
    mode: 'create',
  })
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    product?: Product
  }>({ open: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
        {canCreate && (
          <Button onClick={() => setFormDialog({ open: true, mode: 'create' })}>
            <Plus />
            Add Product
          </Button>
        )}
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, SKU, or category…"
          className="pl-9"
          value={searchInput}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      {isPending ? (
        <ProductListSkeleton />
      ) : isError ? (
        <Card>
          <CardHeader>
            <CardTitle>Couldn’t load products</CardTitle>
            <CardDescription>
              The request failed. Check your connection and try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? 'Retrying…' : 'Retry'}
            </Button>
          </CardContent>
        </Card>
      ) : data.items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No products found.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <ProductTable
              products={data.items}
              canUpdate={canUpdate}
              canDelete={canDelete}
              onEdit={(product) =>
                setFormDialog({ open: true, mode: 'edit', product })
              }
              onDelete={(product) => setDeleteDialog({ open: true, product })}
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {data.pagination.page} of {data.pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page <= 1}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= data.pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {formDialog.open && (
        <ProductFormDialog
          key={`${formDialog.mode}-${formDialog.product?._id ?? 'new'}`}
          open
          onOpenChange={(open) => setFormDialog((s) => ({ ...s, open }))}
          mode={formDialog.mode}
          product={formDialog.product}
        />
      )}
      <DeleteProductDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((s) => ({ ...s, open }))}
        product={deleteDialog.product}
      />
    </div>
  )
}

/** Skeleton stand-in for the products table while the first page loads. */
function ProductListSkeleton() {
  return (
    <div className="space-y-3 rounded-lg border p-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}
