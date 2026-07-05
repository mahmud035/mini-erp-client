import { createBrowserRouter } from 'react-router-dom'
import { MiniErpPage } from '@/pages/MiniErpPage'

/** Router shell — one placeholder route for now. */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MiniErpPage />,
  },
])
