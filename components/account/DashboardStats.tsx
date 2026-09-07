"use client";

import Link from "next/link";
import { Package, Heart, MapPin, ArrowRight } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAddressStore } from "@/store/addressStore";
import type { OrderRecord } from "@/lib/actions/orders";
import { formatCurrency } from "@/lib/utils";

export function DashboardStats({ orders }: { orders: OrderRecord[] }) {
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const addressCount = useAddressStore((s) => s.addresses.length);

  const stats = [
    { label: "Orders", value: orders.length, icon: Package, href: "/account/orders" },
    { label: "Wishlist Items", value: wishlistCount, icon: Heart, href: "/account/wishlist" },
    { label: "Saved Addresses", value: addressCount, icon: MapPin, href: "/account/addresses" },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="glass group rounded-2xl p-5 transition-colors hover:bg-white/[0.06]"
          >
            <stat.icon size={20} className="text-accent-purple" />
            <p className="mt-3 font-heading text-3xl font-bold text-white">
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
          <Link
            href="/account/orders"
            className="flex items-center gap-1 text-sm text-white/60 hover:text-white"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="glass rounded-2xl p-6 text-center text-white/50">
            No orders yet.{" "}
            <Link href="/shop" className="text-accent-purple hover:underline">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="glass flex items-center justify-between rounded-2xl p-4"
              >
                <div>
                  <p className="font-mono text-xs text-white/40">
                    #{order.id.slice(0, 8)}
                  </p>
                  <p className="mt-1 text-sm capitalize text-white/70">
                    {order.status}
                  </p>
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
