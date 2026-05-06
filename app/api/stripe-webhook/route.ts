import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
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

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;

      if (userId && typeof session.subscription === 'string') {
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        await updateProfileWithSubscription(userId, subscription);
      }
      break;

    
    case 'customer.subscription.updated':
      const subscriptionObj = event.data.object as Stripe.Subscription;
      const subUserId = subscriptionObj.metadata?.user_id;

      if (subUserId) {
        await updateProfileWithSubscription(subUserId, subscriptionObj);
      }
      break;

    case 'invoice.paid':
      const invoice = event.data.object as Stripe.Invoice;
      await handleInvoicePaid(invoice);
      break;

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object as Stripe.Invoice;
      await handleInvoiceFailed(failedInvoice);
      break;

    case 'customer.subscription.deleted':
      const deletedSub = event.data.object as Stripe.Subscription;
      await supabaseAdmin
        .from('profiles')
        .update({
          subscription_status: 'canceled',
          trial_ends_at: null,
          next_invoice_at: null,
        })
        .eq('subscription_id', deletedSub.id);
      break;
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

// ====================== HELPERS ======================

async function updateProfileWithSubscription(
  userId: string,
  subscription: Stripe.Subscription
) {
  const trialEndsAt = subscription.trial_end
    ? new Date(subscription.trial_end * 1000).toISOString()
    : null;

  const nextInvoiceAt = subscription.items?.data?.[0]?.current_period_end
    ? new Date(subscription.items.data[0].current_period_end * 1000).toISOString()
    : null;

  await supabaseAdmin
    .from('profiles')
    .update({
      subscription_id: subscription.id,
      subscription_status: subscription.status,
      trial_ends_at: trialEndsAt,
      next_invoice_at: nextInvoiceAt,
    })
    .eq('id', userId);
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // Type assertion because Stripe TS definitions are incomplete for this field
  const subscriptionId = (invoice as any).subscription;

  if (typeof subscriptionId !== 'string') return;

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const userId = subscription.metadata?.user_id;

    if (userId) {
      await updateProfileWithSubscription(userId, subscription);
    }
  } catch (err) {
    console.error('Failed to retrieve subscription on invoice.paid:', err);
  }
}

async function handleInvoiceFailed(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription;

  if (typeof subscriptionId !== 'string') return;

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const userId = subscription.metadata?.user_id;

    if (userId) {
      await supabaseAdmin
        .from('profiles')
        .update({ subscription_status: subscription.status })
        .eq('id', userId);
    }
  } catch (err) {
    console.error('Failed to retrieve subscription on payment_failed:', err);
  }
}