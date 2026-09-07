"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Heart,
  MapPin,
  Bell,
  User,
  CreditCard,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/lib/actions/auth";
import { useAuthUser } from "@/hooks/useAuthUser";

const NAV_ITEMS = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/notifications", label: "Notifications", icon: Bell },
  { href: "/account/profile", label: "Profile", icon: User },
  { href: "/account/cards", label: "Saved Cards", icon: CreditCard },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const { user } = useAuthUser();

  return (
    <nav className="glass h-fit w-full shrink-0 rounded-2xl p-3 md:w-56">
      {NAV_ITEMS.map((item) => {
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

      {user?.isAdmin && (
        <Link
          href="/admin"
          className="mt-2 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-accent-purple hover:bg-white/5 hover:text-accent-pink"
        >
          <ShieldCheck size={16} />
          Admin Panel
        </Link>
      )}

      <form action={signOutAction} className="mt-2 border-t border-white/10 pt-2">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-accent-red"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </form>
    </nav>
  );
}
