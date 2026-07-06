import { api } from '@/api/axios'
import type { ApiResponse, DashboardStats } from '@/api/types'

/** GET /dashboard — aggregate counts + the low-stock product list. */
async function getStats(): Promise<DashboardStats> {
  const { data } = await api.get<ApiResponse<DashboardStats>>('/dashboard')
  return data.data
}

export const dashboardApi = { getStats }
