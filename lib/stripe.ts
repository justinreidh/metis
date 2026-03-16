// lib/stripe.ts

import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';   // ← or /client depending on usage

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Example function that needs Supabase
export async function createOrGetCustomer(userId: string, email: string) {
  const supabase = await createClient();   // ← create it here (await if server client)

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }

  if (profile?.stripe_customer_id) {
    return profile.stripe_customer_id;
  }

  const customer = await stripe.customers.create({ email });

  await supabase
    .from('profiles')
    .update({ stripe_customer_id: customer.id })
    .eq('id', userId);

  return customer.id;
}