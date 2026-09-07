import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Auth-aware server client for use in Server Components, Server Actions,
 * and Route Handlers. Reads the session from cookies and — where
 * possible — refreshes it, mirroring changes back onto the response.
 *
 * Note: calling `cookies()` (which this does) opts the calling route into
 * dynamic rendering. Pages that need to know "who's logged in" (e.g.
 * /account/*) are dynamic by nature anyway; pages that don't need auth
 * (home, /shop, /product/[slug]) should avoid importing this so they can
 * stay statically generated.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component with no ability to set
            // cookies — safe to ignore as long as proxy.ts is
            // refreshing the session on every request.
          }
        },
      },
    }
  );
}
