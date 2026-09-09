import Link from "next/link";
import { Package } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { getOrdersForUser } from "@/lib/actions/orders";
import { formatCurrency, cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-accent-blue/20 text-accent-blue",
  pending: "bg-accent-gold/20 text-accent-gold",
  cancelled: "bg-white/10 text-white/50",
  refunded: "bg-accent-red/20 text-accent-red",
};

export default async function OrdersPage() {
  const { userId } = await auth();

  const orders = userId ? await getOrdersForUser(userId) : [];

  return (
    <div>
      <h2 className="mb-6 font-heading text-xl font-bold text-white">
        Order History
      </h2>

      {orders.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <Package size={28} className="mx-auto mb-3 text-white/30" />
          <p className="text-white/60">No orders yet.</p>
          <Link
            href="/shop"
            className="mt-3 inline-block text-sm text-accent-purple hover:underline"
          >
            Start shopping →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const items = Array.isArray(order.items) ? order.items : [];
            return (
              <div key={order.id} className="glass rounded-2xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-white/40">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="mt-1 text-xs text-white/40">
                      {new Date(order.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium capitalize",
                      STATUS_STYLES[order.status] ?? "bg-white/10 text-white/60"
                    )}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="mt-4 border-t border-white/10 pt-4">
                  <p className="text-xs text-white/40">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </p>
                  <p className="mt-1 font-heading text-lg font-bold text-white">
                    {formatCurrency(order.total)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
