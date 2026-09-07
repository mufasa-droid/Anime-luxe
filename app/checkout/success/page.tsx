import Link from "next/link";
import { CheckCircle2, PackageSearch, Sparkles } from "lucide-react";
import {
  getOrderById,
  confirmPaidOrder,
  type OrderRecord,
} from "@/lib/services/orders";
import {
  verifyPaystackTransaction,
  isPaystackConfigured,
} from "@/lib/services/paystack";
import { ClearCartOnSuccess } from "@/components/checkout/ClearCartOnSuccess";
import { formatCurrency } from "@/lib/utils";

interface SuccessPageProps {
  searchParams: Promise<{
    order_id?: string;
    reference?: string;
    trxref?: string;
    demo?: string;
  }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { order_id, reference, trxref, demo } = await searchParams;
  const paymentRef = reference || trxref;
  const isDemo = demo === "true";

  // If real Paystack reference returned, verify and confirm
  if (paymentRef && !isDemo && isPaystackConfigured()) {
    try {
      const verification = await verifyPaystackTransaction(paymentRef);
      if (verification.status && verification.data?.status === "success") {
        await confirmPaidOrder(order_id || paymentRef, paymentRef);
      }
    } catch {
      // Handled gracefully if verification or webhook already confirmed
    }
  }

  let order: OrderRecord | null = null;
  if (order_id) {
    order = await getOrderById(order_id);
  }
  if (!order && paymentRef) {
    order = await getOrderById(paymentRef);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 pt-24">
      <ClearCartOnSuccess />
      <div className="glass-strong w-full max-w-lg rounded-3xl p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-purple/20">
          <CheckCircle2 size={32} className="text-accent-purple" />
        </div>

        {isDemo && (
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent-blue/10 px-3.5 py-1 text-xs font-medium text-accent-blue">
            <Sparkles size={12} />
            Showcase Demo Checkout
          </div>
        )}

        <h1 className="mt-4 font-heading text-3xl font-bold text-white">
          Order Confirmed
        </h1>
        <p className="mt-2 text-white/60">
          {isDemo
            ? "Your simulated order has been placed successfully for demonstration."
            : "Thanks for your order — a confirmation email is on its way."}
        </p>

        {order ? (
          <div className="glass mt-8 space-y-2 rounded-2xl p-5 text-left text-sm">
            <div className="flex justify-between text-white/60">
              <span>Order ID</span>
              <span className="font-mono text-white/80">{order.id}</span>
            </div>
            {order.payment_reference && (
              <div className="flex justify-between text-white/60">
                <span>Reference</span>
                <span className="font-mono text-xs text-white/60">
                  {order.payment_reference}
                </span>
              </div>
            )}
            <div className="flex justify-between text-white/60">
              <span>Status</span>
              <span className="capitalize text-emerald-400 font-medium">
                {order.status}
              </span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Total</span>
              <span className="font-heading font-semibold text-white">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        ) : (
          <div className="glass mt-8 flex items-center gap-3 rounded-2xl p-5 text-left text-sm text-white/60">
            <PackageSearch size={20} className="shrink-0 text-white/40" />
            <span>
              {paymentRef
                ? `Order Reference: ${paymentRef}`
                : "Order processed successfully. Confirmation has been recorded."}
            </span>
          </div>
        )}

        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/shop"
            className="glass rounded-full px-8 py-3 font-heading font-medium text-white transition-shadow hover:shadow-glow"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
