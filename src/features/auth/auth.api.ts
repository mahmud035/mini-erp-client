import { api } from '@/api/axios'
import type { ApiResponse, LoginResponse, User } from '@/api/types'
import type { LoginInput } from '@/features/auth/auth.validation'

/** POST /auth/login — set httpOnly cookies; returns the user + access token. */
async function login(credentials: LoginInput): Promise<LoginResponse> {
  const { data } = await api.post<ApiResponse<LoginResponse>>(
    '/auth/login',
    credentials,
  )
  return data.data
}

/** POST /auth/logout — clear the auth cookies server-side. */
async function logout(): Promise<void> {
  await api.post<ApiResponse<null>>('/auth/logout')
}

/** GET /auth/me — the current authenticated user. Throws 401 when signed out. */
async function getMe(): Promise<User> {
  const { data } = await api.get<ApiResponse<User>>('/auth/me')
  return data.data
}

export const authApi = { login, logout, getMe }
