import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import type { Product } from '@/api/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  useCreateProduct,
  useUpdateProduct,
} from '@/features/product/product.hooks'
import {
  productSchema,
  type ProductFormValues,
} from '@/features/product/product.validation'
import { zodResolver } from '@/utils/zodResolver'

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  product?: Product
}

const EMPTY_VALUES: ProductFormValues = {
  name: '',
  sku: '',
  category: '',
  purchasePrice: '',
  sellingPrice: '',
  stockQuantity: '',
  image: undefined,
}

/** RHF default values from an optional product (edit pre-fills; create is empty). */
function toDefaultValues(product?: Product): ProductFormValues {
  if (!product) return EMPTY_VALUES
  return {
    name: product.name,
    sku: product.sku,
    category: product.category,
    purchasePrice: String(product.purchasePrice),
    sellingPrice: String(product.sellingPrice),
    stockQuantity: String(product.stockQuantity),
    image: undefined,
  }
}

/**
 * Create/edit a product. Multipart submit with a local image preview.
 * Mounted fresh per open (keyed by the parent), so fields + preview initialise
 * from props — no reset effect, which keeps state sync out of an effect body.
 */
export function ProductFormDialog({
  open,
  onOpenChange,
  mode,
  product,
}: ProductFormDialogProps) {
  const create = useCreateProduct()
  const update = useUpdateProduct()
  const pending = create.isPending || update.isPending

  const [preview, setPreview] = useState<string | null>(
    product?.image.url ?? null,
  )
  // Only object URLs we created get revoked — never the edit's http image URL.
  const objectUrlRef = useRef<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: toDefaultValues(product),
  })

  const revokePreview = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
  }

  // Revoke any created object URL on unmount.
  useEffect(() => revokePreview, [])

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setValue('image', file, { shouldValidate: true })
    revokePreview()
    const url = URL.createObjectURL(file)
    objectUrlRef.current = url
    setPreview(url)
  }

  const onSubmit = handleSubmit((values) => {
    // Create requires an image; enforced here so it never reaches the server.
    if (mode === 'create' && !(values.image instanceof File)) {
      setError('image', { message: 'Product image is required' })
      return
    }

    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('sku', values.sku)
    formData.append('category', values.category)
    formData.append('purchasePrice', values.purchasePrice)
    formData.append('sellingPrice', values.sellingPrice)
    formData.append('stockQuantity', values.stockQuantity)
    if (values.image instanceof File) {
      formData.append('image', values.image)
    }

    const handlers = {
      onSuccess: () => onOpenChange(false),
      onError: (error: unknown) => {
        if (axios.isAxiosError(error) && error.response?.status === 409) {
          setError('sku', {
            message: 'A product with this SKU already exists',
          })
        } else {
          setError('root', {
            message: 'Something went wrong. Please try again.',
          })
        }
      },
    }

    if (mode === 'create') {
      create.mutate(formData, handlers)
    } else if (product) {
      update.mutate({ id: product._id, formData }, handlers)
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add product' : 'Edit product'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Create a product. An image is required.'
              : 'Update this product. Leave the image empty to keep the current one.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} noValidate className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                aria-invalid={!!errors.sku}
                {...register('sku')}
              />
              {errors.sku && (
                <p className="text-sm text-destructive">{errors.sku.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                aria-invalid={!!errors.category}
                {...register('category')}
              />
              {errors.category && (
                <p className="text-sm text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="purchasePrice">Purchase</Label>
              <Input
                id="purchasePrice"
                type="number"
                min="0"
                step="0.01"
                aria-invalid={!!errors.purchasePrice}
                {...register('purchasePrice')}
              />
              {errors.purchasePrice && (
                <p className="text-sm text-destructive">
                  {errors.purchasePrice.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sellingPrice">Selling</Label>
              <Input
                id="sellingPrice"
                type="number"
                min="0"
                step="0.01"
                aria-invalid={!!errors.sellingPrice}
                {...register('sellingPrice')}
              />
              {errors.sellingPrice && (
                <p className="text-sm text-destructive">
                  {errors.sellingPrice.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stockQuantity">Stock</Label>
              <Input
                id="stockQuantity"
                type="number"
                min="0"
                step="1"
                aria-invalid={!!errors.stockQuantity}
                {...register('stockQuantity')}
              />
              {errors.stockQuantity && (
                <p className="text-sm text-destructive">
                  {errors.stockQuantity.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              aria-invalid={!!errors.image}
              onChange={onFileChange}
            />
            {errors.image && (
              <p className="text-sm text-destructive">
                {errors.image.message as string}
              </p>
            )}
            {preview && (
              <img
                src={preview}
                alt="Product preview"
                className="mt-1 size-24 rounded-md object-cover"
              />
            )}
          </div>

          {errors.root && (
            <p
              role="alert"
              className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {errors.root.message}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
