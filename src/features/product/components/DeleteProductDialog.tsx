import { AlertTriangle } from 'lucide-react'
import type { Product } from '@/api/types'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useDeleteProduct } from '@/features/product/product.hooks'

interface DeleteProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product
}

/** Confirm + delete a product. Stays open until the mutation resolves. */
export function DeleteProductDialog({
  open,
  onOpenChange,
  product,
}: DeleteProductDialogProps) {
  const remove = useDeleteProduct()

  const onConfirm = () => {
    if (!product) return
    remove.mutate(product._id, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex size-10 items-center justify-center rounded-full bg-danger/10 text-danger">
            <AlertTriangle className="size-5" />
          </div>
          <AlertDialogTitle>Delete product?</AlertDialogTitle>
          <AlertDialogDescription>
            {product
              ? `“${product.name}” will be permanently removed. This can’t be undone.`
              : ''}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={remove.isPending}>
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            className="bg-danger text-white hover:bg-danger/90 focus-visible:ring-danger/30"
            onClick={onConfirm}
            disabled={remove.isPending}
          >
            {remove.isPending ? 'Deleting…' : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
