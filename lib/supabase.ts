import { createClient } from "@supabase/supabase-js";

// Client-side Supabase
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL=https://csuljlmaewlubswdhayz.supabase.co!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_AFMBEqP3BtdMDE9dQ8o0Sg_8CpAnXqt!
);

// Server-side Supabase (with service role for inserts)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL=https://csuljlmaewlubswdhayz.supabase.co!,
  process.env.SUPABASE_SERVICE_ROLE_KEY=sb_secret_H_wAmwgoBCmLvtRdRbh3Rg_ys0sis39!
);

