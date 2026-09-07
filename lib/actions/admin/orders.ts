"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/services/supabase";

export interface AdminOrder {
  id: string;
  user_id: string | null;
  status: string;
  total: number;
  items: unknown[];
  payment_reference?: string | null;
  stripe_session_id?: string | null;
  created_at: string;
}

const VALID_STATUSES = ["pending", "paid", "cancelled", "refunded"] as const;

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

/** Unlike lib/actions/orders.ts (user-scoped), this returns every order —
 * only ever call it from admin-gated pages. */
export async function getAllOrders(): Promise<AdminOrder[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data as AdminOrder[];
}

export async function updateOrderStatusAction(
  orderId: string,
  status: string
): Promise<{ error?: string }> {
  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    return { error: "Invalid status." };
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) return { error: error.message };

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return {};
}
