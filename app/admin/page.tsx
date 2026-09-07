import Link from "next/link";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import { getAllOrders } from "@/lib/actions/admin/orders";
import { getAdminProducts } from "@/lib/actions/admin/products";
import { getAllUsers } from "@/lib/actions/admin/users";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [orders, products, users] = await Promise.all([
    getAllOrders(),
    getAdminProducts(),
    getAllUsers(),
  ]);

  const revenue = orders
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "Total Revenue", value: formatCurrency(revenue), icon: DollarSign, href: "/admin/orders" },
    { label: "Orders", value: orders.length, icon: ShoppingCart, href: "/admin/orders" },
    { label: "Products", value: products.length, icon: Package, href: "/admin/products" },
    { label: "Users", value: users.length, icon: Users, href: "/admin/users" },
  ];

  const configured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  return (
    <div>
      {!configured && (
        <div className="mb-6 rounded-2xl bg-accent-blue/10 px-4 py-3 text-sm text-white/60">
          Supabase isn&apos;t configured yet — these stats will populate once
          you add your keys to <code className="rounded bg-white/10 px-1">.env.local</code>.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="glass group rounded-2xl p-5 transition-colors hover:bg-white/[0.06]"
          >
            <stat.icon size={20} className="text-accent-purple" />
            <p className="mt-3 font-heading text-2xl font-bold text-white">
              {stat.value}
            </p>
            <p className="text-sm text-white/50">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-white">
            Recent Orders
          </h2>
          <Link href="/admin/orders" className="text-sm text-white/60 hover:text-white">
            View all →
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="glass rounded-2xl p-6 text-center text-white/50">
            No orders yet.
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="glass flex items-center justify-between rounded-2xl p-4">
                <div>
                  <p className="font-mono text-xs text-white/40">#{order.id.slice(0, 8)}</p>
                  <p className="mt-1 text-sm capitalize text-white/70">{order.status}</p>
                </div>
                <p className="font-heading font-semibold text-white">
                  {formatCurrency(order.total)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
