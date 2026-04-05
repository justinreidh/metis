// app/checkout/success/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic';

export default function CheckoutSuccess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [verified, setVerified] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    async function verifySubscription() {
      if (!sessionId) {
        router.push('/dashboard')
        return
      }

      // Optional: verify with Stripe via your backend if needed
      // For now, just mark user as subscribed via webhook (already handled)

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // You can optionally sync status here
        setVerified(true)
      }
      setLoading(false)
    }

    verifySubscription()
  }, [sessionId, router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Activating your trial...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-6">
      <Card className="max-w-lg w-full border-none shadow-2xl">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl">Your Free Trial is Active!</CardTitle>
          <CardDescription className="text-lg mt-3">
            Welcome to Metis Talent. You're now ready to start making better hires.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-2xl">🎯</div>
              <div>
                <p className="font-medium">7 days of full access</p>
                <p className="text-sm text-muted-foreground">All features included. No credit card charged yet.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">🚀</div>
              <div>
                <p className="font-medium">Get started in under 2 minutes</p>
                <p className="text-sm text-muted-foreground">Add your first candidate and send their first assessment.</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={() => router.push('/onboarding/wizard')}
            className="w-full py-7 text-lg"
          >
            Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Need help? <Link href="/contact" className="text-primary hover:underline">Contact support</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}