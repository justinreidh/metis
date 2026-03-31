// app/onboarding/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function OnboardingPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Ensure user is authenticated
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
      }
    }
    checkAuth()
  }, [supabase, router])

  const startFreeTrial = async () => {
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Please log in first')
        return
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id, 
          email: user.email 
        }),
      })

      if (!response.ok) throw new Error('Failed to create checkout session')

      const { clientSecret: secret } = await response.json()
      setClientSecret(secret)

    } catch (err) {
      console.error(err)
      alert('Error starting your free trial. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Show Embedded Checkout when we have the client secret
  if (clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ clientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    )
  }

  // Main Onboarding Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center px-4 py-12">
      <Card className="max-w-lg w-full border-none shadow-2xl">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">🎉</span>
          </div>
          <CardTitle className="text-3xl">Welcome to Metis Talent!</CardTitle>
          <CardDescription className="text-lg mt-3">
            You're all set. Let's start your 7-day free trial and begin making better hires.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="flex gap-4">
              <div className="text-2xl">✅</div>
              <div>
                <p className="font-medium">Full access during trial</p>
                <p className="text-sm text-muted-foreground">All assessments and features included</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">✅</div>
              <div>
                <p className="font-medium">No credit card required upfront</p>
                <p className="text-sm text-muted-foreground">You'll only be charged after the trial ends</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">✅</div>
              <div>
                <p className="font-medium">Cancel anytime</p>
                <p className="text-sm text-muted-foreground">No risk. Pause or cancel with one click.</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={startFreeTrial} 
            className="w-full py-7 text-lg"
            disabled={loading}
          >
            {loading ? "Starting your free trial..." : "Start 7-Day Free Trial →"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            After 7 days, you'll be charged $99/month. You can cancel anytime before then.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}