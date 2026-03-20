// lib/stripe.ts

import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';   // ← or /client depending on usage

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Example function that needs Supabase
// lib/stripe.ts (or wherever createOrGetCustomer lives)
export async function createOrGetCustomer(userId: string, email: string) {
  const supabase = await createClient();

  // Try to find existing record
  let { data: userRecord, error } = await supabase
    .from('users')
    .select('stripe_customer_id')
    .eq('id', userId)
    .maybeSingle();  // ← use .maybeSingle() instead of .single()

  if (error) {
    console.error('Supabase lookup error:', error);
    throw error;
  }

  if (userRecord?.stripe_customer_id) {
    return userRecord.stripe_customer_id;
  }

  // No customer ID → create Stripe customer
  const customer = await stripe.customers.create({
    email,
    metadata: { supabase_user_id: userId },
  });

  // If no row exists → insert one (or update if partial row exists)
  const { error: upsertError } = await supabase
    .from('users')
    .upsert(
      {
        id: userId,
        email,                   // optional – if you store email here
        stripe_customer_id: customer.id,
        // subscription_status: 'inactive', // if you want default
      },
      { onConflict: 'id' }
    );

  if (upsertError) {
    console.error('Failed to upsert user record:', upsertError);
    throw upsertError;
  }

  return customer.id;
}