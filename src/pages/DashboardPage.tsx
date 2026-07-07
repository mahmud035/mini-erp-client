import { Package, ShoppingCart, Users } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { StatCard } from '@/features/dashboard/components/StatCard'
import { LowStockList } from '@/features/dashboard/components/LowStockList'
import { useDashboard } from '@/features/dashboard/dashboard.hooks'

/** Orchestrates the dashboard: explicit loading, error, and loaded states. */
export function DashboardPage() {
  const { data, isPending, isError, refetch, isFetching } = useDashboard()

  if (isPending) {
    return <DashboardSkeleton />
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Couldn’t load the dashboard</CardTitle>
          <CardDescription>
            The stats request failed. Check your connection and try again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? 'Retrying…' : 'Retry'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Products"
          value={data.totalProducts}
          icon={Package}
          to="/products"
        />
        <StatCard label="Customers" value={data.totalCustomers} icon={Users} />
        <StatCard label="Sales" value={data.totalSales} icon={ShoppingCart} />
      </div>

      <LowStockList products={data.lowStockProducts} />
    </div>
  )
}

/** Loading placeholder mirroring the loaded layout. */
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-40" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
      <Skeleton className="h-56 w-full" />
    </div>
  )
}
