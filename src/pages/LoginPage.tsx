import { Navigate } from 'react-router-dom'
import { FullPageLoader } from '@/components/ui/FullPageLoader'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { useAuth } from '@/features/auth/auth.hooks'

/**
 * Orchestrates the login screen. Waits for the session to resolve (no flash),
 * bounces already-authenticated users to the dashboard, else renders the form.
 */
export function LoginPage() {
  const { isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return <FullPageLoader />
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-6">
      <LoginForm />
    </main>
  )
}
