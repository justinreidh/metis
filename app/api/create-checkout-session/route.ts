// app/api/create-embedded-checkout/route.ts
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { createOrGetCustomer } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const { userId, email } = await request.json();

  const supabase = await createClient();
  const customerId = await createOrGetCustomer(userId, email);

  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: 'price_1T9yFuEcPdjGva3Es26Oz16k', // e.g. price_1ABC...
        quantity: 1,
      },
    ],
    ui_mode: 'embedded',                    // ← Key for Embedded Checkout
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing?session_id={CHECKOUT_SESSION_ID}`,
    metadata: { user_id: userId },
  });

  return NextResponse.json({ clientSecret: session.client_secret });
}