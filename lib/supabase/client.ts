import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client for Client Components (login/signup forms,
// client-side mutations). Safe to expose the anon key — it is public.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
