import { auth } from "@clerk/nextjs/server";
import { getOrdersForUser } from "@/lib/actions/orders";
import { DashboardStats } from "@/components/account/DashboardStats";

export default async function AccountDashboardPage() {
  const { userId } = await auth();

  // Layout already redirects if there's no user, but keep this safe.
  const orders = userId ? await getOrdersForUser(userId) : [];

  return <DashboardStats orders={orders} />;
}

