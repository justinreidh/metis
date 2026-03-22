// lib/supabase/admin.ts  (or wherever makes sense)
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,   // ← secret key from dashboard → Settings → API
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);