"use server";

import { getSupabaseServerClient } from "@/lib/services/supabase";

export interface OrderRecord {
  id: string;
  status: string;
  total: number;
  items: unknown[];
  created_at: string;
  payment_reference?: string | null;
  stripe_session_id?: string | null;
}

/**
 * Fetches every order belonging to a signed-in user. Uses the
 * service-role client (bypasses RLS) and filters by user_id directly —
 * simple and sufficient here since this is only ever called from
 * Server Components/Actions that already verified the user's session
 * via lib/supabase/server.ts before calling this.
 */
export async function getOrdersForUser(userId: string): Promise<OrderRecord[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return [];
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data as OrderRecord[];
}
