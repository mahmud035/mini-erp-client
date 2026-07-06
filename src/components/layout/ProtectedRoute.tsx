import { Navigate, Outlet } from 'react-router-dom'
import { FullPageLoader } from '@/components/ui/FullPageLoader'
import { useAuth } from '@/features/auth/auth.hooks'

/**
 * Route guard. While the session is resolving we render a neutral loader (NOT a
 * redirect) so there's no flash of /login on a valid session. Once settled:
 * no user → redirect to /login; user → render the nested routes.
 */
export function ProtectedRoute() {
  const { isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return <FullPageLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
