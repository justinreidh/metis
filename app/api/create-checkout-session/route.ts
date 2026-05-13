// app/api/create-embedded-checkout/route.ts
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createOrGetCustomer } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const { userId, email } = await request.json()
    const supabase = await createClient()

    // Check current subscription status
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return NextResponse.json(
        { error: 'Could not verify subscription status' },
        { status: 500 }
      )
    }

    // Prevent duplicate subscriptions / free trials
    if (
      profile?.subscription_status === 'active' ||
      profile?.subscription_status === 'trialing'
    ) {
      return NextResponse.json(
        { error: 'You already have an active subscription.' },
        { status: 400 }
      )
    }

    // Create or fetch Stripe customer
    const customerId = await createOrGetCustomer(userId, email)

    // Create embedded checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId, // use existing Stripe customer
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1T9yFuEcPdjGva3Es26Oz16k',
          quantity: 1,
        },
      ],
      ui_mode: 'embedded',
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          user_id: userId,           // ← Extra safety
        },
      },
      metadata: {
        user_id: userId,
      },
    })

    return NextResponse.json({
      clientSecret: session.client_secret,
    })
  } catch (error) {
    console.error('Checkout session error:', error)

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}