import { Link, NavLink, Outlet } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/layout/Logo'
import { cn } from '@/utils/cn'
import { useAuth, useLogout } from '@/features/auth/auth.hooks'

/** Shared active/inactive styling for top-nav links: a soft indigo pill. */
function navLinkClass({ isActive }: { isActive: boolean }): string {
  return cn(
    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
    isActive
      ? 'bg-brand/10 text-brand'
      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
  )
}

/** Role-aware app shell: top navbar + the active page. */
export function AppLayout() {
  const { user, can } = useAuth()
  const logout = useLogout()

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-card shadow-xs">
        <nav className="mx-auto grid h-16 max-w-6xl grid-cols-3 items-center px-4">
          <Link to="/dashboard" className="justify-self-start">
            <Logo />
          </Link>

          <div className="flex items-center gap-6 justify-self-center">
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              Products
            </NavLink>
            {can('sale:create') && (
              <NavLink to="/sales/new" className={navLinkClass}>
                New Sale
              </NavLink>
            )}
          </div>

          <div className="flex items-center gap-3 justify-self-end">
            {user && (
              <Badge variant="neutral" className="capitalize">
                {user.role.name}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
            >
              <LogOut />
              {logout.isPending ? 'Signing out…' : 'Logout'}
            </Button>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
