// lib/stripe.ts

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js'; // ← direct import, not your wrapper

// ────────────────────────────────────────────────
//  Regular Stripe instance (used everywhere)
// ────────────────────────────────────────────────
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// ────────────────────────────────────────────────
//  Admin Supabase client – bypasses RLS
//  ONLY use this in SERVER-SIDE code (API routes, server actions, etc.)
//  NEVER expose this in client components
// ────────────────────────────────────────────────
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // ← from Supabase → Settings → API → service_role
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);

// ────────────────────────────────────────────────
//  Creates or returns existing Stripe customer ID
//  - Looks up in users table
//  - Creates customer in Stripe if needed
//  - Upserts stripe_customer_id + email into users
// ────────────────────────────────────────────────
export async function createOrGetCustomer(userId: string, email: string): Promise<string> {
  try {
    // 1. Look for existing customer ID
    const { data: userRecord, error: lookupError } = await supabaseAdmin
      .from('users')
      .select('stripe_customer_id')
      .eq('id', userId)
      .maybeSingle();

    if (lookupError) {
      console.error('Supabase lookup error:', lookupError);
      throw new Error(`Failed to check existing customer: ${lookupError.message}`);
    }

    if (userRecord?.stripe_customer_id) {
      return userRecord.stripe_customer_id;
    }

    // 2. No customer → create one in Stripe
    const customer = await stripe.customers.create({
      email,
      metadata: {
        supabase_user_id: userId,
      },
    });

    // 3. Upsert into Supabase users table (bypassing RLS via admin client)
    const { error: upsertError } = await supabaseAdmin
      .from('users')
      .upsert(
        {
          id: userId,
          email, // optional but useful for consistency
          stripe_customer_id: customer.id,
          // You can add more defaults if desired, e.g.:
          // subscription_status: 'inactive',
          // updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (upsertError) {
      console.error('Failed to upsert user with customer ID:', upsertError);
      // Optional: rollback Stripe customer if critical (rarely needed)
      throw new Error(`Failed to save customer ID: ${upsertError.message}`);
    }

    return customer.id;
  } catch (err) {
    console.error('createOrGetCustomer failed:', err);
    throw err; // let the caller handle (e.g. return 500)
  }
}