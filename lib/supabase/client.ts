import { createBrowserClient } from "@supabase/ssr";

/**
 * Auth-aware browser client. Uses the anon key and syncs the session via
 * cookies (through @supabase/ssr) so the server can see the same session.
 * This is distinct from lib/services/supabase.ts, which is a plain
 * service-role client for data reads/writes that don't care about "who's
 * logged in" (e.g. admin-style order lookups).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key"
  );
}
