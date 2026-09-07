"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/services/supabase";
import { createClient } from "@/lib/supabase/server";

export interface AdminUserRow {
  id: string;
  email: string;
  name: string;
  role: "admin" | "customer";
  createdAt: string;
}

/**
 * Uses the Supabase Admin API (`auth.admin.*`), which requires the
 * service-role key — never expose this client or these functions to the
 * browser. Only call from admin-gated Server Components/Actions.
 */
export async function getAllUsers(): Promise<AdminUserRow[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return [];
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) return [];

  return data.users
    .map((u) => ({
      id: u.id,
      email: u.email ?? "",
      name: (u.user_metadata?.full_name as string) ?? "",
      role: (u.app_metadata?.role as string) === "admin" ? "admin" as const : "customer" as const,
      createdAt: u.created_at,
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function setUserAdminRoleAction(
  userId: string,
  makeAdmin: boolean
): Promise<{ error?: string }> {
  const authClient = await createClient();
  const {
    data: { user: currentUser },
  } = await authClient.auth.getUser();

  if (currentUser?.id === userId) {
    return { error: "You can't modify your own admin status." };
  }

  const supabase = getSupabaseServerClient();

  const { data: existing } = await supabase.auth.admin.getUserById(userId);
  const currentAppMetadata = existing.user?.app_metadata ?? {};

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    app_metadata: {
      ...currentAppMetadata,
      role: makeAdmin ? "admin" : undefined,
    },
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/users");
  return {};
}
