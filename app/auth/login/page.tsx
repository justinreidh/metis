'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { loginSchema } from '@/lib/validations/auth'

// Zod Validation Schema for Login


type LoginForm = z.infer<typeof loginSchema>

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: LoginForm) => {
    setGeneralError(null)
    setLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) throw error

      // Redirect on successful login
      window.location.href = '/dashboard'
    } catch (err: any) {
      console.error(err)
      setGeneralError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand / Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary tracking-tight">Metis Talent</h1>
          <p className="text-muted-foreground mt-2">Science-backed pre-employment assessments</p>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Sign in to manage your assessments and candidates
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    {...register('email')}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:text-primary/80 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* General Error */}
              {generalError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Login failed</AlertTitle>
                  <AlertDescription>{generalError}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full py-6 text-lg"
                disabled={loading}
              >
                {loading ? 'Signing in...' : (
                  <>
                    Sign In <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-primary hover:text-primary/80 font-medium">
                Create one for free
              </Link>
            </p>

            <p className="text-xs text-muted-foreground text-center">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-foreground">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}