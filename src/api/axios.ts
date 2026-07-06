import axios, { type InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse, RefreshResponse } from '@/api/types'
import { clearAccessToken, setAccessToken } from '@/utils/tokenStore'

/**
 * Shared Axios instance for the Mini ERP API.
 * - baseURL comes from VITE_API_URL (never hardcoded).
 * - withCredentials sends the HTTP-only auth cookie on every request.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

/**
 * Dispatched on `window` when a silent refresh fails (the session is truly
 * dead). QueryProvider listens and clears the cache so the router redirects to
 * /login — axios never navigates itself.
 */
export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized'

/** Request config tagged so a request is retried at most once after refresh. */
type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

// --- Single-flight refresh state -------------------------------------------
// While one /auth/refresh is in flight, concurrent 401s park here instead of
// each firing their own refresh; they replay once the single refresh resolves.
let isRefreshing = false
let waiters: Array<{ resolve: () => void; reject: (error: unknown) => void }> =
  []

/** True when the failing request must not itself trigger a refresh/retry. */
function isAuthEndpoint(url: string | undefined): boolean {
  return !!url && (url.includes('/auth/refresh') || url.includes('/auth/login'))
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as RetryableConfig | undefined
    const status = error.response?.status

    // Only 401s, once per request, and never for the auth endpoints themselves.
    if (
      status !== 401 ||
      !original ||
      original._retry ||
      isAuthEndpoint(original.url)
    ) {
      return Promise.reject(error)
    }

    original._retry = true

    // A refresh is already running — queue this request's replay.
    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        waiters.push({ resolve, reject })
      }).then(() => api(original))
    }

    // This request is the leader: fire the one and only refresh.
    isRefreshing = true
    if (import.meta.env.DEV) {
      console.debug('[auth] access token 401 — firing single /auth/refresh')
    }
    try {
      const { data } =
        await api.post<ApiResponse<RefreshResponse>>('/auth/refresh')
      setAccessToken(data.data.accessToken)
      waiters.forEach((w) => w.resolve())
      waiters = []
      return api(original)
    } catch (refreshError) {
      waiters.forEach((w) => w.reject(refreshError))
      waiters = []
      clearAccessToken()
      window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT))
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)
