import { z } from 'zod'

/**
 * Sale form schema.
 *
 * NOTE: unlike the product form (multipart, string+refine), this is a JSON
 * request — so numeric fields use real `z.coerce.number()`. The native inputs
 * hand RHF strings; the resolver coerces them to numbers for the submit handler.
 *
 * Stock validation is deliberately NOT here — the schema has no product data.
 * "quantity ≤ stock" is an advisory check computed in the form from the loaded
 * product list; the server is the authority on the race case.
 */
export const saleSchema = z.object({
  customer: z.string().min(1, 'Select a customer'),
  items: z
    .array(
      z.object({
        product: z.string().min(1, 'Select a product'),
        quantity: z.coerce
          .number()
          .int('Quantity must be a whole number')
          .positive('Quantity must be at least 1'),
      }),
    )
    .min(1, 'Add at least one product line'),
})

export type SaleFormValues = z.infer<typeof saleSchema>
