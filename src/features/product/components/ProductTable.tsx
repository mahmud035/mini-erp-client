import { Pencil, Trash2 } from 'lucide-react'
import type { Product } from '@/api/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/utils/formatCurrency'
import { stockBadgeVariant } from '@/utils/stockBadge'

interface ProductTableProps {
  products: Product[]
  canUpdate: boolean
  canDelete: boolean
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

/** Presentational products table. All data + actions come from props. */
export function ProductTable({
  products,
  canUpdate,
  canDelete,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const showActions = canUpdate || canDelete

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-14">Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Purchase</TableHead>
          <TableHead className="text-right">Selling</TableHead>
          <TableHead className="text-right">Stock</TableHead>
          {showActions && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product._id}>
            <TableCell>
              <img
                src={product.image.url}
                alt={product.name}
                className="size-10 rounded-md object-cover"
                loading="lazy"
              />
            </TableCell>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell className="text-muted-foreground">
              {product.sku}
            </TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCurrency(product.purchasePrice)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCurrency(product.sellingPrice)}
            </TableCell>
            <TableCell className="text-right">
              <Badge
                variant={stockBadgeVariant(product.stockQuantity)}
                className="tabular-nums"
              >
                {product.stockQuantity}
              </Badge>
            </TableCell>
            {showActions && (
              <TableCell>
                <div className="flex justify-end gap-1">
                  {canUpdate && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Edit ${product.name}`}
                      onClick={() => onEdit(product)}
                    >
                      <Pencil />
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete ${product.name}`}
                      onClick={() => onDelete(product)}
                    >
                      <Trash2 />
                    </Button>
                  )}
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
