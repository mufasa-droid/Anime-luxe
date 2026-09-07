"use client";

import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2, AlertCircle, Sparkles, CreditCard, Mail } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { checkoutAction } from "@/lib/actions/checkout";
import { useAuthUser } from "@/hooks/useAuthUser";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } =
    useCartStore();
  const { user } = useAuthUser();
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  function handleCheckout(isDemo = false) {
    setCheckoutError(null);
    const guestEmail = user?.email || email.trim() || undefined;

    startTransition(async () => {
      try {
        await checkoutAction({
          items,
          guestEmail,
          isDemo,
        });
      } catch (err) {
        setCheckoutError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
        );
      }
    });
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="glass-strong fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-white/10 p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-white">
                Your Bag ({items.length})
              </h2>
              <button onClick={closeCart} aria-label="Close cart">
                <X className="text-white/70 hover:text-white" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
              {items.length === 0 && (
                <div className="mt-16 flex flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-white/30">
                    <CreditCard size={28} />
                  </div>
                  <p className="mt-4 text-white/50">Your bag is empty.</p>
                </div>
              )}
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="glass flex gap-4 rounded-2xl p-3"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-base-800">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="font-heading text-sm font-medium text-white">
                        {item.title}
                      </p>
                      <p className="text-xs text-white/50">
                        {[item.size, item.color].filter(Boolean).join(" / ")}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.variantId,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="rounded-full bg-white/10 p-1 hover:bg-white/20"
                        >
                          <Minus size={12} className="text-white" />
                        </button>
                        <span className="text-sm text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          className="rounded-full bg-white/10 p-1 hover:bg-white/20"
                        >
                          <Plus size={12} className="text-white" />
                        </button>
                      </div>
                      <span className="font-heading text-sm text-white">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.variantId)}
                    aria-label="Remove item"
                    className="self-start text-white/40 hover:text-accent-red"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {items.length > 0 && (
              <div className="mt-6 border-t border-white/10 pt-5 space-y-4">
                {/* Guest Email Input */}
                {!user && (
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs text-white/60">
                      <Mail size={12} /> Receipt Email
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="glass w-full rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:border-accent-purple focus:outline-none"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Subtotal</span>
                  <span className="font-heading text-lg font-bold text-white">
                    {formatCurrency(subtotal())}
                  </span>
                </div>

                {checkoutError && (
                  <div className="flex items-start gap-2 rounded-xl bg-accent-red/10 px-3 py-2.5 text-xs text-accent-red">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span>{checkoutError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  {/* Primary Paystack / Standard Checkout */}
                  <MagneticButton
                    onClick={() => handleCheckout(false)}
                    disabled={isPending}
                    className="w-full text-center disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isPending ? "Processing..." : "Pay with Paystack"}
                  </MagneticButton>

                  {/* Showcase Demo Checkout (Instant 1-Click test for visitors) */}
                  <button
                    type="button"
                    onClick={() => handleCheckout(true)}
                    disabled={isPending}
                    className="group flex w-full items-center justify-center gap-2 rounded-full border border-accent-purple/30 bg-accent-purple/10 px-4 py-2.5 text-xs font-medium text-accent-purple transition-all hover:bg-accent-purple/20 hover:border-accent-purple/60 disabled:opacity-50"
                  >
                    <Sparkles size={13} className="transition-transform group-hover:scale-110" />
                    <span>Instant Demo Checkout (Showcase)</span>
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
