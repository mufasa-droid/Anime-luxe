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
} from "lucide-react";
import { cn } from "@/lib/utils";

const BUILT_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/users", label: "Users", icon: Users },
];

const COMING_SOON_ITEMS = [
  { label: "Categories", icon: Tags },
  { label: "Coupons", icon: Ticket },
  { label: "Analytics", icon: BarChart3 },
  { label: "Inventory", icon: Boxes },
  { label: "Reviews", icon: Star },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="glass h-fit w-full shrink-0 rounded-2xl p-3 md:w-56">
      {BUILT_ITEMS.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-gradient-to-r from-accent-purple/30 to-accent-pink/20 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon size={16} />
            {item.label}
          </Link>
        );
      })}

      <div className="mt-2 border-t border-white/10 pt-2">
        {COMING_SOON_ITEMS.map((item) => (
          <div
            key={item.label}
            className="flex cursor-not-allowed items-center justify-between rounded-xl px-4 py-2.5 text-sm text-white/25"
          >
            <span className="flex items-center gap-3">
              <item.icon size={16} />
              {item.label}
            </span>
            <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px]">
              Soon
            </span>
          </div>
        ))}
      </div>
    </nav>
  );
}
