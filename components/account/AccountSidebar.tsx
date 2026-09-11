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
import { useAuthUser } from "@/hooks/useAuthUser";
import { useClerk } from "@clerk/nextjs";

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
  const { signOut } = useClerk();

  return (
    <nav className="glass h-fit w-full shrink-0 rounded-2xl p-2 md:p-3 md:w-56 border border-white/15 shadow-md">
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0 md:flex-col md:gap-0.5">
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
                "flex shrink-0 items-center gap-2 md:gap-3 rounded-xl px-3.5 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-semibold transition-all whitespace-nowrap",
                active
                  ? "bg-gradient-to-r from-accent-purple/30 to-accent-pink/20 text-white border border-accent-purple/30 shadow-sm"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon size={15} className="shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {user?.isAdmin && (
          <Link
            href="/admin"
            className="flex shrink-0 items-center gap-2 md:gap-3 rounded-xl px-3.5 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-semibold text-accent-purple hover:bg-white/5 hover:text-accent-pink whitespace-nowrap"
          >
            <ShieldCheck size={15} className="shrink-0" />
            <span>Admin Panel</span>
          </Link>
        )}
      </div>

      <div className="hidden md:block mt-2 border-t border-white/10 pt-2">
        <button
          type="button"
          onClick={() => signOut({ redirectUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-accent-red"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </nav>
  );
}

