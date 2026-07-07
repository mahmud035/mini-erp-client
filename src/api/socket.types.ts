/**
 * Socket.io event contract — mirrors the server's `src/socket/socket.types.ts`
 * 1:1 so a backend change breaks TypeScript at compile time. NOTE: the product
 * id here is `id` (not `_id`) — that is what the server emits on this event.
 */

/** A product that has crossed below the low-stock threshold after a sale. */
export interface LowStockProduct {
  id: string
  name: string
  sku: string
  stockQuantity: number
}

/** Payload of the `low-stock-alert` event pushed to the `inventory` room. */
export interface LowStockAlertPayload {
  products: LowStockProduct[]
  saleId: string
}

/** Events the server emits to clients. */
export interface ServerToClientEvents {
  'low-stock-alert': (payload: LowStockAlertPayload) => void
}

/** Clients emit nothing in this batch. */
export type ClientToServerEvents = Record<string, never>
