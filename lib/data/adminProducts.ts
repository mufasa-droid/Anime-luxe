import { getSupabaseServerClient } from "@/lib/services/supabase";

export interface AdminProductRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  category: string;
  anime: string;
  images: string[];
  stock: number;
  is_limited: boolean;
  is_new: boolean;
  is_trending: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export function isProductsTableConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

/**
 * Raw query against the admin-managed `products` table. Deliberately not
 * a Server Action (no "use server") — this is internal plumbing shared by:
 *   - lib/actions/admin/products.ts (thin Server Action wrappers for the admin UI)
 *   - lib/data/products.ts (merges these rows into the public storefront catalog)
 * Returns [] on any error or missing config so callers can treat a
 * misconfigured/unreachable database the same as "no admin products yet"
 * rather than crashing the storefront.
 */
export async function fetchAdminProducts(): Promise<AdminProductRow[]> {
  if (!isProductsTableConfigured()) return [];

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data as AdminProductRow[];
}

export async function fetchAdminProductById(
  id: string
): Promise<AdminProductRow | null> {
  if (!isProductsTableConfigured()) return null;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as AdminProductRow;
}
