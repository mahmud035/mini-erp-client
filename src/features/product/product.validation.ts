import { z } from 'zod'

/**
 * Product form schema.
 *
 * NOTE: numeric fields are validated as STRINGS with `Number()` refinements —
 * this is deliberate and LOCAL to this multipart form, where every field is sent
 * as a string and the backend coerces. JSON forms elsewhere use real z.number().
 *
 * `image` is optional at the schema level so create and edit share one RHF type
 * (avoids the resolver's contravariant-param mismatch between a required vs
 * optional file). The create flow enforces "image required" with an explicit
 * guard in the form's onSubmit — create without an image never reaches the server.
 */
const priceString = z
  .string()
  .min(1, 'Required')
  .refine((v) => Number(v) > 0, 'Must be greater than 0')

const stockString = z
  .string()
  .min(1, 'Required')
  .refine(
    (v) => Number.isInteger(Number(v)) && Number(v) >= 0,
    'Must be a whole number ≥ 0',
  )

export const productSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  sku: z.string().trim().min(1, 'SKU is required'),
  category: z.string().trim().min(1, 'Category is required'),
  purchasePrice: priceString,
  sellingPrice: priceString,
  stockQuantity: stockString,
  image: z.instanceof(File).optional(),
})

export type ProductFormValues = z.infer<typeof productSchema>
