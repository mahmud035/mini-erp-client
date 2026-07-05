import axios from 'axios'

/**
 * Shared Axios instance for the Mini ERP API.
 * - baseURL comes from VITE_API_URL (never hardcoded).
 * - withCredentials sends the HTTP-only auth cookie on every request.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})
