import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  label: string
  value: number
  icon?: LucideIcon
}

/** Presentational metric tile: a brand-tinted icon beside a labelled count. */
export function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <Card className="shadow-xs">
      <CardContent className="flex items-center gap-4">
        {Icon && (
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <Icon className="size-5" aria-hidden />
          </span>
        )}
        <div className="grid gap-0.5">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
