// app/billing/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client'; // client version for 'use client'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Billing() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient(); // client-side

  useEffect(() => {
    // Optional: pre-fetch user if needed
  }, []);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please log in first');
        return;
      }

      const response = await fetch('/api/create-checkout-session', {  // your new route
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });

      const { clientSecret: secret } = await response.json();
      setClientSecret(secret);
    } catch (err) {
      console.error(err);
      alert('Error starting checkout');
    } finally {
      setLoading(false);
    }
  };

  if (clientSecret) {
    return (
      <div className="container mx-auto py-10 max-w-4xl">
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Upgrade to Premium</CardTitle>
          <CardDescription>Unlock candidate invites and result viewing for $10/month.</CardDescription>
        </CardHeader>
        <CardContent>
        
          <Button onClick={handleSubscribe} disabled={loading}>
            {loading ? 'Loading...' : 'Subscribe Now'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}