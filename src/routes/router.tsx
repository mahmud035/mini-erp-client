import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ProductsPage } from '@/pages/ProductsPage'
import { NewSalePage } from '@/pages/NewSalePage'

/**
 * Route map: a public /login, and a protected group (auth guard → app shell)
 * that hosts the dashboard. Unknown paths fall through to /dashboard, which the
 * guard resolves (→ /login when signed out).
 */
export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'products', element: <ProductsPage /> },
          { path: 'sales/new', element: <NewSalePage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
])
