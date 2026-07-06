import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/features/dashboard/dashboard.api'

/** Query keys owned by the dashboard feature. */
export const dashboardKeys = {
  stats: ['dashboard', 'stats'] as const,
}

/** The dashboard aggregate stats + low-stock list. */
export function useDashboard() {
  return useQuery({
    queryKey: dashboardKeys.stats,
    queryFn: dashboardApi.getStats,
  })
}
