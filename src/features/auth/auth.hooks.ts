import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import type { User } from '@/api/types'
import { authApi } from '@/features/auth/auth.api'
import type { LoginInput } from '@/features/auth/auth.validation'
import { clearAccessToken, setAccessToken } from '@/utils/tokenStore'

/** Query keys owned by the auth feature. */
export const authKeys = {
  me: ['auth', 'me'] as const,
}

/**
 * The current user, or `null` when signed out. A 401 is a valid "no session"
 * answer, not an error — so the query resolves to `null` and never retries.
 */
export function useMe() {
  return useQuery<User | null>({
    queryKey: authKeys.me,
    queryFn: async () => {
      try {
        return await authApi.getMe()
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return null
        }
        throw error
      }
    },
  })
}

/**
 * Login mutation. On success: store the access token (for the 4C socket), seed
 * the `me` cache so the app is authenticated without a refetch, and route to the
 * dashboard. Bad credentials surface via `mutation.isError` for the form.
 */
export function useLogin() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (credentials: LoginInput) => authApi.login(credentials),
    onSuccess: (data) => {
      setAccessToken(data.accessToken)
      queryClient.setQueryData<User>(authKeys.me, data.user)
      navigate('/dashboard', { replace: true })
    },
  })
}

/**
 * Logout mutation. Clears local auth state and the whole query cache on settle
 * (even if the server call fails, the client session must not linger), then
 * routes to /login.
 */
export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      clearAccessToken()
      queryClient.clear()
      navigate('/login', { replace: true })
    },
  })
}

/** Convenience view over the auth state for guards, layout, and pages. */
export function useAuth() {
  const { data: user, isLoading } = useMe()

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    can: (permission: string) =>
      user?.permissions.includes(permission) ?? false,
  }
}
