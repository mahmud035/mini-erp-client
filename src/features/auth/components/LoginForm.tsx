import { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/layout/Logo'
import { useLogin } from '@/features/auth/auth.hooks'
import { loginSchema, type LoginInput } from '@/features/auth/auth.validation'
import { zodResolver } from '@/utils/zodResolver'

/** Turns a login mutation error into a human message (401 = bad credentials). */
function loginErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    return 'Invalid email or password.'
  }
  return 'Something went wrong. Please try again.'
}

/** Seeded demo logins (public in the README) for one-click form fill. */
const DEMO_PASSWORD = 'Password123!'
const DEMO_ACCOUNTS = [
  { label: 'Admin', email: 'admin@erp.test' },
  { label: 'Manager', email: 'manager@erp.test' },
  { label: 'Employee', email: 'employee@erp.test' },
] as const

/** Presentational login form: RHF + Zod, inline field + submit errors. */
export function LoginForm() {
  const login = useLogin()
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = handleSubmit((values) => login.mutate(values))

  /** Populate the fields with a demo account — fill only, never auto-submit. */
  const fillDemo = (email: string) => {
    setValue('email', email)
    setValue('password', DEMO_PASSWORD)
  }

  return (
    <Card className="w-full max-w-sm shadow-sm">
      <CardHeader className="items-center text-center">
        <Logo variant="stacked" />
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Access the Mini ERP dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} noValidate className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                className="pl-9"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-danger">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="px-9"
                aria-invalid={!!errors.password}
                {...register('password')}
              />
              <button
                type="button"
                tabIndex={0}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-danger">{errors.password.message}</p>
            )}
          </div>

          {login.isError && (
            <p
              role="alert"
              className="rounded-md border border-danger/20 bg-danger/10 px-3 py-2 text-sm text-danger"
            >
              {loginErrorMessage(login.error)}
            </p>
          )}

          <Button type="submit" disabled={login.isPending} className="w-full">
            {login.isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>

        <div className="mt-6 border-t border-border pt-4">
          <p className="mb-2 text-center text-xs text-muted-foreground">
            Demo accounts — click to fill
          </p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map((account) => (
              <Button
                key={account.email}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillDemo(account.email)}
              >
                {account.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
