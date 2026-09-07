import { ShoppingCart } from "lucide-react";
import { getAllOrders } from "@/lib/actions/admin/orders";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { formatCurrency } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();
  const configured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  return (
    <div>
      <h2 className="mb-6 font-heading text-xl font-bold text-white">
        Orders ({orders.length})
      </h2>

      {!configured && (
        <div className="mb-6 rounded-2xl bg-accent-blue/10 px-4 py-3 text-sm text-white/60">
          Supabase isn&apos;t configured — see the README for setup.
        </div>
      )}

      {orders.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <ShoppingCart size={28} className="mx-auto mb-3 text-white/30" />
          <p className="text-white/60">
            {configured ? "No orders yet." : "Connect Supabase to view orders."}
          </p>
        </div>
      ) : (
        <div className="glass divide-y divide-white/10 rounded-2xl">
          {orders.map((order) => {
            const items = Array.isArray(order.items) ? order.items : [];
            return (
              <div key={order.id} className="flex flex-wrap items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs text-white/40">
                    #{order.id.slice(0, 8)}
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    {order.user_id ? `User ${order.user_id.slice(0, 8)}` : "Guest"} ·{" "}
                    {items.length} {items.length === 1 ? "item" : "items"} ·{" "}
                    {new Date(order.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <p className="shrink-0 font-heading font-semibold text-white">
                  {formatCurrency(order.total)}
                </p>
                <div className="shrink-0">
                  <OrderStatusSelect orderId={order.id} status={order.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
