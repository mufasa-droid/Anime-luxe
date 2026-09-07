import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 pt-24">
      <div className="glass-strong w-full max-w-lg rounded-3xl p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-red/20">
          <XCircle size={32} className="text-accent-red" />
        </div>

        <h1 className="mt-6 font-heading text-3xl font-bold text-white">
          Checkout Cancelled
        </h1>
        <p className="mt-2 text-white/60">
          No charge was made. Your cart is still saved — pick up right where
          you left off.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/shop"
            className="rounded-full bg-gradient-to-r from-accent-purple to-accent-pink px-8 py-3 font-heading font-medium text-white shadow-glow transition-shadow hover:shadow-glow-pink"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
