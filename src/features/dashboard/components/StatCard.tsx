import type { LucideIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'

interface StatCardProps {
  label: string
  value: number
  icon?: LucideIcon
}

/** Presentational metric tile: a labelled count. */
export function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          {Icon && <Icon className="size-4" aria-hidden />}
          {label}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tracking-tight tabular-nums">
          {value}
        </p>
      </CardContent>
    </Card>
  )
}
