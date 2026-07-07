import { io, type Socket } from 'socket.io-client'
import { getAccessToken } from '@/utils/tokenStore'
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@/api/socket.types'

/**
 * Singleton socket.io client. Connects DIRECT to Railway (the raw origin in
 * VITE_SOCKET_URL — NOT through the `/api` rewrite, which WebSockets can't ride).
 * The default `/socket.io` path is correct, so it is not overridden.
 *
 * `autoConnect: false` — SocketProvider owns the connect/disconnect lifecycle.
 * `auth` is a FUNCTION so every (re)connect reads the freshest in-memory access
 * token; the httpOnly cookie isn't readable cross-site, hence the handshake token.
 */
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.VITE_SOCKET_URL,
  {
    autoConnect: false,
    withCredentials: true,
    auth: (cb) => cb({ token: getAccessToken() ?? '' }),
  },
)
