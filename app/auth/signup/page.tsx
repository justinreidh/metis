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
import { Mail, Lock, ArrowRight, AlertCircle, User, Building } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { signupSchema } from '@/lib/validations/auth'
// Zod Validation Schema


type SignupForm = z.infer<typeof signupSchema>

export default function Signup() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [generalError, setGeneralError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError: setFormError,
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur', // Validates on blur for better UX
  })

  const onSubmit = async (data: SignupForm) => {
    setGeneralError(null)
    setMessage(null)
    setLoading(true)

    try {
      const supabase = createClient()

      const cleanCompanyName = data.companyName?.trim() || null

      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding`,
          data: {
            first_name: data.firstName.trim(),
            last_name: data.lastName.trim(),
            company_name: cleanCompanyName,
            full_name: `${data.firstName.trim()} ${data.lastName.trim()}`.trim(),
          },
        },
      })

      if (error) throw error

      setMessage('Check your email for the confirmation link! (Check spam folder if not received)')
      reset() // Clear the form
    } catch (err: any) {
      console.error(err)
      setGeneralError(err.message || 'An error occurred during signup')
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
            <CardTitle className="text-2xl font-bold text-center">Create your account</CardTitle>
            <CardDescription className="text-center">
              Start your 7-day free trial — and start evidence-based hiring
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    placeholder="John"
                    {...register('firstName')}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName.message}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    {...register('lastName')}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName.message}</p>
                )}
              </div>

              {/* Email */}
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

              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="companyName">
                  Company Name <span className="text-muted-foreground">(optional)</span>
                </Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="companyName"
                    placeholder="Acme Corp"
                    {...register('companyName')}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
                {errors.companyName && (
                  <p className="text-sm text-destructive">{errors.companyName.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
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
                <p className="text-xs text-muted-foreground">Minimum 8 characters with uppercase, lowercase, and number</p>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* General Error */}
              {generalError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{generalError}</AlertDescription>
                </Alert>
              )}

              {/* Success Message */}
              {message && (
                <Alert variant="default" className="border-green-200 text-green-800">
                  <Mail className="h-4 w-4" />
                  <AlertTitle>Check your inbox</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full py-6 text-lg"
                disabled={loading}
              >
                {loading ? 'Creating account...' : (
                  <>
                    Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium">
                Sign in
              </Link>
            </p>

            <p className="text-xs text-muted-foreground text-center">
              By signing up, you agree to our{' '}
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