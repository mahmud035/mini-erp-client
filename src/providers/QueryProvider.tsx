import { AUTH_UNAUTHORIZED_EVENT } from '@/api/axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';

/**
 * Wraps the app in a single, stable TanStack Query client.
 * All server state flows through this provider.
 *
 * Also bridges axios → router on auth loss: when a silent refresh fails, axios
 * dispatches AUTH_UNAUTHORIZED_EVENT; we set the `me` cache to `null` directly
 * (no clear/refetch loop) so ProtectedRoute redirects to /login.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false, refetchOnWindowFocus: false },
        },
      }),
  );

  useEffect(() => {
    const onUnauthorized = () => queryClient.setQueryData(['auth', 'me'], null);
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized);
    return () =>
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized);
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
