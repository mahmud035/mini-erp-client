import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { QueryProvider } from '@/providers/QueryProvider'
import { SocketProvider } from '@/providers/SocketProvider'
import { router } from '@/routes/router'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <SocketProvider>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </SocketProvider>
    </QueryProvider>
  </StrictMode>,
)
