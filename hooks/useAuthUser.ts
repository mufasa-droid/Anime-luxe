"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface AuthUser {
  email: string;
  name: string;
  isAdmin: boolean;
}

/**
 * Deliberately client-only: fetching the session server-side (via
 * cookies()) would force every page that renders the Navbar into dynamic
 * rendering, killing static generation for the homepage, /shop, and
 * product pages. Instead this resolves after hydration — a brief
 * "logged out" flash is an acceptable tradeoff for keeping the rest of
 * the site static. Swap to a server-fetched value later if/when the app
 * adopts Partial Prerendering.
 */
export function useAuthUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // If Supabase credentials are missing or placeholder, resolve immediately
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url || url.includes("placeholder")) {
      setLoaded(true);
      return;
    }

    try {
      const supabase = createClient();

      supabase.auth
        .getUser()
        .then(({ data, error }) => {
          if (error || !data?.user) {
            setUser(null);
          } else {
            setUser({
              email: data.user.email ?? "",
              name: (data.user.user_metadata?.full_name as string) ?? "",
              isAdmin: data.user.app_metadata?.role === "admin",
            });
          }
        })
        .catch(() => {
          setUser(null);
        })
        .finally(() => {
          setLoaded(true);
        });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(
          session?.user
            ? {
                email: session.user.email ?? "",
                name: (session.user.user_metadata?.full_name as string) ?? "",
                isAdmin: session.user.app_metadata?.role === "admin",
              }
            : null
        );
        setLoaded(true);
      });

      return () => subscription?.unsubscribe();
    } catch {
      setLoaded(true);
    }
  }, []);

  return { user, loaded };
}
