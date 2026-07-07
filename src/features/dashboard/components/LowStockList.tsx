import type { LowStockProduct } from '@/api/types'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { stockBadgeVariant } from '@/utils/stockBadge'

interface LowStockListProps {
  products: LowStockProduct[]
}

/** Low-stock products table with an explicit empty state. */
export function LowStockList({ products }: LowStockListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Low stock</CardTitle>
        <CardDescription>
          Active products below the low-stock threshold.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No products below the low-stock threshold.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">In stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.sku}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.sku}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={stockBadgeVariant(product.stockQuantity)}
                      className="tabular-nums"
                    >
                      {product.stockQuantity}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
