import { z } from 'zod'

/**
 * Login form schema. Mirrors the backend's login body validation: a valid email
 * and a non-empty password. Field-level messages surface inline in the form.
 */
export const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginInput = z.infer<typeof loginSchema>
