"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tags,
  Ticket,
  BarChart3,
  Boxes,
  Star,
  Store,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/lib/actions/auth";

const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories & Franchises", icon: Tags },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/users", label: "Users & Admins", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="glass h-fit w-full shrink-0 rounded-3xl p-3 border border-neutral-200 dark:border-white/10 md:w-60 space-y-1">
      {ADMIN_NAV_ITEMS.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-semibold transition-all",
              active
                ? "bg-gradient-to-r from-purple-600 to-pink-500 !text-white shadow-md shadow-purple-500/25 font-bold"
                : "text-neutral-700 dark:text-white/70 hover:bg-neutral-200/60 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white"
            )}
          >
            <Icon size={16} className={cn("shrink-0", active ? "!text-white" : "text-neutral-500 dark:text-white/50")} />
            <span className={cn("truncate", active && "!text-white font-bold")}>{item.label}</span>
          </Link>
        );
      })}

      <div className="pt-2 border-t border-neutral-200 dark:border-white/10 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-neutral-700 dark:text-white/70 hover:bg-neutral-200/60 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white transition-all"
        >
          <Store size={16} className="text-neutral-500 dark:text-white/50" />
          <span>Back to Store</span>
        </Link>

        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-all"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </nav>
  );
}

