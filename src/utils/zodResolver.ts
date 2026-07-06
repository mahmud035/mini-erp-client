import type { FieldErrors, FieldValues, Resolver } from 'react-hook-form'
import type { ZodType } from 'zod'

/**
 * Minimal React Hook Form resolver for a Zod schema.
 *
 * A local adapter so forms can validate with Zod WITHOUT pulling in
 * `@hookform/resolvers` (kept out of the dependency set). Mirrors that package's
 * behaviour closely enough to swap later: on failure it maps each Zod issue to
 * the field at `issue.path`, keeping the first message per field.
 */
export function zodResolver<T extends FieldValues>(
  schema: ZodType<T>,
): Resolver<T> {
  return async (values) => {
    const result = schema.safeParse(values)

    if (result.success) {
      return { values: result.data, errors: {} }
    }

    const errors: FieldErrors<T> = {}
    for (const issue of result.error.issues) {
      const path = issue.path.join('.')
      // Keep the first error per field (RHF renders one message at a time).
      if (path && !(path in errors)) {
        ;(errors as Record<string, unknown>)[path] = {
          type: issue.code,
          message: issue.message,
        }
      }
    }

    return { values: {}, errors }
  }
}
