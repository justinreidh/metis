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
        const checkoutUserId = session.metadata?.user_id;   // ← renamed

        if (checkoutUserId && typeof session.subscription === 'string') {
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        await updateProfileWithSubscription(checkoutUserId, subscription);
        }
        break;

    case 'customer.subscription.updated':
        const subscriptionObj = event.data.object as Stripe.Subscription;
        
        

        let userId = subscriptionObj.metadata?.user_id;

        if (!userId && subscriptionObj.customer) {
            try {
            
            const customer = typeof subscriptionObj.customer === 'string'
                ? await stripe.customers.retrieve(subscriptionObj.customer)
                : subscriptionObj.customer;

            if (customer && 'metadata' in customer && !('deleted' in customer)) {
                userId = (customer as Stripe.Customer).metadata?.user_id;
                
            }
            } catch (e) {
            
            }
        }

        if (userId) {
            
            const subscription = await stripe.subscriptions.retrieve(subscriptionObj.id);
            await updateProfileWithSubscription(userId, subscription);
        } else {
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

  // NEW: Handle cancellation during trial or at period end
  const cancelAt = subscription.cancel_at
    ? new Date(subscription.cancel_at * 1000).toISOString()
    : null;

  const isCanceledAtPeriodEnd = 
    subscription.cancel_at_period_end || 
    !!subscription.cancel_at; // Important for trial cancellations

  await supabaseAdmin
    .from('profiles')
    .update({
      subscription_id: subscription.id,
      subscription_status: subscription.status,
      trial_ends_at: trialEndsAt,
      next_invoice_at: nextInvoiceAt,
      cancel_at_period_end: isCanceledAtPeriodEnd,
      cancel_at: cancelAt,                    // New column (optional but recommended)
      canceled_at: subscription.canceled_at 
        ? new Date(subscription.canceled_at * 1000).toISOString()
        : null,
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