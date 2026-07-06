import { Skeleton } from '@/components/ui/skeleton'

/**
 * Neutral full-viewport loading state. Shown while auth is resolving so guards
 * and the login page never flash the wrong screen. Skeleton, not a spinner.
 */
export function FullPageLoader() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-3">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  )
}
