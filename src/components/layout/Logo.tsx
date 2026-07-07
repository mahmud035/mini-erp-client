import { Box } from 'lucide-react'
import { cn } from '@/utils/cn'

/**
 * Shared brand mark: an indigo rounded square holding a placeholder icon next to
 * the "Mini ERP" wordmark. Reserved logo slot — the later logo/favicon batch
 * swaps ONLY this file.
 *
 * - `horizontal` (default): compact, inline — for the navbar.
 * - `stacked`: larger, centered column — for the login card.
 */
export function Logo({
  variant = 'horizontal',
  className,
}: {
  variant?: 'horizontal' | 'stacked'
  className?: string
}) {
  const stacked = variant === 'stacked'

  return (
    <div
      className={cn(
        'flex items-center gap-2',
        stacked && 'flex-col gap-3',
        className,
      )}
    >
      <span
        className={cn(
          'flex items-center justify-center rounded-lg bg-brand text-primary-foreground shadow-xs',
          stacked ? 'size-11' : 'size-7',
        )}
      >
        <Box className={stacked ? 'size-6' : 'size-4'} />
      </span>
      <span
        className={cn(
          'font-heading font-semibold tracking-tight text-foreground',
          stacked ? 'text-lg' : 'text-base',
        )}
      >
        Mini ERP
      </span>
    </div>
  )
}
