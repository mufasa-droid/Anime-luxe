import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Tags,
  Boxes,
  BarChart3,
  Ticket,
  Star,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { getAllOrders } from "@/lib/actions/admin/orders";
import { getAdminProducts } from "@/lib/actions/admin/products";
import { getAllUsers } from "@/lib/actions/admin/users";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
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
    { label: "Active Products", value: products.length, icon: Package, href: "/admin/products" },
    { label: "Users & Admins", value: users.length, icon: Users, href: "/admin/users" },
  ];

  const quickLinks = [
    { label: "Manage Products", desc: "Add, edit, or remove store drops", icon: Package, href: "/admin/products", color: "text-accent-purple" },
    { label: "Categories & Franchises", desc: "Customize categories & anime universes", icon: Tags, href: "/admin/categories", color: "text-accent-pink" },
    { label: "Inventory Control", desc: "Real-time stock adjustment & alerts", icon: Boxes, href: "/admin/inventory", color: "text-emerald-500" },
    { label: "Analytics & Sales", desc: "Financial performance & franchise metrics", icon: BarChart3, href: "/admin/analytics", color: "text-accent-blue" },
    { label: "Coupons & Discounts", desc: "Manage promotional campaign codes", icon: Ticket, href: "/admin/coupons", color: "text-amber-500" },
    { label: "Review Moderation", desc: "Approve and feature customer testimonials", icon: Star, href: "/admin/reviews", color: "text-accent-gold" },
  ];

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: "Admin Dashboard" }]} backHref="/" backLabel="Store Front" />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="glass group rounded-3xl p-5 border border-neutral-200 dark:border-white/10 transition-all hover:scale-[1.02] hover:shadow-glow"
          >
            <stat.icon size={20} className="text-accent-purple" />
            <p className="mt-3 font-heading text-2xl font-bold text-neutral-900 dark:text-white">
              {stat.value}
            </p>
            <p className="text-xs text-neutral-500 dark:text-white/50">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Access Modules */}
      <div>
        <h3 className="mb-4 font-heading text-lg font-bold text-neutral-900 dark:text-white">
          Admin Management Suite
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((ql) => (
            <Link
              key={ql.href}
              href={ql.href}
              className="glass group rounded-3xl p-5 border border-neutral-200 dark:border-white/10 transition-all hover:scale-[1.02] hover:border-accent-purple/40"
            >
              <div className="flex items-center justify-between">
                <ql.icon size={22} className={ql.color} />
                <ArrowRight size={14} className="text-neutral-400 dark:text-white/40 group-hover:translate-x-1 group-hover:text-accent-purple transition-all" />
              </div>
              <h4 className="mt-3 font-heading text-sm font-bold text-neutral-900 dark:text-white group-hover:text-accent-purple transition-colors">
                {ql.label}
              </h4>
              <p className="mt-1 text-xs text-neutral-500 dark:text-white/50">
                {ql.desc}
              </p>
            </Link>
          ))}
        </div>
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
