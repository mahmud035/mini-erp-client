import { useEffect, type ReactNode } from 'react'
import { toast } from 'sonner'
import { socket } from '@/api/socket'
import type { LowStockAlertPayload } from '@/api/socket.types'
import { useAuth } from '@/features/auth/auth.hooks'

/**
 * Owns the socket lifecycle: connect while authenticated, disconnect otherwise,
 * and surface `low-stock-alert` as a toast. Connection is driven off
 * `isAuthenticated` (never a role check) — the server room-gates delivery, so an
 * employee connects but receives nothing, which is correct.
 *
 * StrictMode-safe: the socket is a module singleton (no duplicate connections)
 * and the cleanup removes the SPECIFIC handler (no blind removeAllListeners),
 * so the dev double-mount can't leak listeners or sockets. Connect only fires
 * once the in-memory token exists (login sets it before `isAuthenticated` flips).
 */
export function SocketProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) return

    const onLowStock = (payload: LowStockAlertPayload) => {
      // One grouped toast per event — not one per product.
      const description = payload.products
        .map((product) => `${product.name} (${product.stockQuantity} left)`)
        .join(', ')
      toast.warning('Low stock', { description })
    }

    socket.on('low-stock-alert', onLowStock)
    if (!socket.connected) socket.connect()

    return () => {
      socket.off('low-stock-alert', onLowStock)
      socket.disconnect()
    }
  }, [isAuthenticated])

  return <>{children}</>
}
