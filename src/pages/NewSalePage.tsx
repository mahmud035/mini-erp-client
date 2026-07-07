import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { SaleForm } from '@/features/sale/components/SaleForm'
import {
  useCustomerOptions,
  useProductOptions,
} from '@/features/sale/sale.hooks'

/**
 * New-sale page: orchestration only. Resolves the two picker reads (customers +
 * products) into explicit loading / error / empty states, then hands the loaded
 * lists to the form. Route entry is gated on `can('sale:create')` at the navbar.
 */
export function NewSalePage() {
  const customersQuery = useCustomerOptions()
  const productsQuery = useProductOptions()

  const isPending = customersQuery.isPending || productsQuery.isPending
  const isError = customersQuery.isError || productsQuery.isError
  const isFetching = customersQuery.isFetching || productsQuery.isFetching

  const retry = () => {
    customersQuery.refetch()
    productsQuery.refetch()
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New sale</h1>
        <p className="text-sm text-muted-foreground">
          Pick a customer, add product lines, and record the sale.
        </p>
      </div>

      {isPending ? (
        <div className="space-y-4 rounded-lg border p-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-8 w-40" />
        </div>
      ) : isError ? (
        <Card>
          <CardHeader>
            <CardTitle>Couldn’t load the sale form</CardTitle>
            <CardDescription>
              The customer or product list failed to load. Check your connection
              and try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={retry} disabled={isFetching}>
              {isFetching ? 'Retrying…' : 'Retry'}
            </Button>
          </CardContent>
        </Card>
      ) : customersQuery.data.length === 0 || productsQuery.data.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            A sale needs at least one customer and one product. Add them first,
            then come back to record a sale.
          </CardContent>
        </Card>
      ) : (
        <SaleForm
          customers={customersQuery.data}
          products={productsQuery.data}
        />
      )}
    </div>
  )
}
