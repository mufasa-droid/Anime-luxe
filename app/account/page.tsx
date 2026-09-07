import { createClient } from "@/lib/supabase/server";
import { getOrdersForUser } from "@/lib/actions/orders";
import { DashboardStats } from "@/components/account/DashboardStats";

export default async function AccountDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Layout already redirects if there's no user, but keep this safe.
  const orders = user ? await getOrdersForUser(user.id) : [];

  return <DashboardStats orders={orders} />;
}
