import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = supabaseAdmin;

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      if (userId && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        await supabase.from('profiles').update({
          subscription_id: subscription.id,
          subscription_status: subscription.status, // 'active'
        }).eq('id', userId);
        // Optional: send welcome email, etc.
      }
      break;

    case 'invoice.paid':
      // Renewal success – usually no action needed if status is already 'active'
      // But you can log or extend any expiration date if you use one
      break;

    // Inside your switch case, e.g. for 'invoice.payment_failed'
case 'invoice.payment_failed':
  const invoice = event.data.object as Stripe.Invoice & {subscription: string;};

  if (invoice.subscription) {  // This is safe: string | null
    try {
      const subscription = await stripe.subscriptions.retrieve(
        invoice.subscription as string  // Type assertion is safe here since we checked !== null/undefined
      );

      // Now subscription is Stripe.Subscription
      const userId = subscription.metadata?.user_id;  // Assuming you stored it

      if (userId) {
        await supabase.from('profiles').update({
          subscription_status: subscription.status,
        }).eq('id', userId);
      }

      // Optional: notify user about failed payment
    } catch (err) {
      console.error('Failed to retrieve subscription:', err);
    }
  }
  break;

    case 'customer.subscription.deleted':
      // Revoke access
      const sub = event.data.object as Stripe.Subscription;
      await supabase.from('profiles').update({
        subscription_status: 'canceled',
      }).eq('subscription_id', sub.id);
      break;

    // Add more as needed
  }

  return NextResponse.json({ received: true }, { status: 200 });
}