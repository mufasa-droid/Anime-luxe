"use server";

import { redirect } from "next/navigation";
import {
  initializePaystackTransaction,
  isPaystackConfigured,
} from "@/lib/services/paystack";
import { createPendingOrder, confirmPaidOrder } from "@/lib/services/orders";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { createClient } from "@/lib/supabase/server";
import type { CartItem } from "@/types";

export interface CheckoutOptions {
  items: CartItem[];
  guestEmail?: string;
  isDemo?: boolean;
}

/**
 * Handles checkout for both real Paystack transactions and Instant Showcase Demo orders.
 * On success, it redirects to the appropriate payment or confirmation URL.
 */
export async function checkoutAction(
  itemsOrOptions: CartItem[] | CheckoutOptions
): Promise<void> {
  const options: CheckoutOptions = Array.isArray(itemsOrOptions)
    ? { items: itemsOrOptions }
    : itemsOrOptions;

  const { items, guestEmail, isDemo } = options;

  if (!items || items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Check auth user
  let userEmail: string | undefined = guestEmail;
  let userId: string | undefined;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      userId = user.id;
      userEmail = user.email ?? guestEmail;
    }
  } catch {
    // Auth client unconfigured
  }

  const effectiveEmail = userEmail?.trim() || "shopper@example.com";

  // 1. INSTANT SHOWCASE DEMO CHECKOUT
  if (isDemo || (!isPaystackConfigured() && isDemo !== false)) {
    const demoRef = `DEMO-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    let orderId: string;
    try {
      orderId = await createPendingOrder({
        items,
        total,
        userId,
        email: effectiveEmail,
        reference: demoRef,
        isDemo: true,
      });
      await confirmPaidOrder(orderId, demoRef);
    } catch {
      orderId = `demo_ord_${Date.now()}`;
    }

    const baseUrl = await getBaseUrl();
    redirect(
      `${baseUrl}/checkout/success?order_id=${encodeURIComponent(orderId)}&reference=${encodeURIComponent(demoRef)}&demo=true`
    );
  }

  // 2. REAL PAYSTACK CHECKOUT
  if (!isPaystackConfigured()) {
    throw new Error(
      "Paystack is not configured. Add PAYSTACK_SECRET_KEY to .env.local (see README) to enable live checkout, or click 'Instant Demo Checkout' to test right now."
    );
  }

  const reference = `AL-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  let orderId: string;
  try {
    orderId = await createPendingOrder({
      items,
      total,
      userId,
      email: effectiveEmail,
      reference,
      isDemo: false,
    });
  } catch (err) {
    throw new Error(
      err instanceof Error
        ? `Couldn't save your order: ${err.message}`
        : "Couldn't save your order. Please try again."
    );
  }

  const baseUrl = await getBaseUrl();
  const currency = process.env.NEXT_PUBLIC_CURRENCY || "NGN";

  // Paystack expects amount in lowest currency denomination (kobo or cents)
  const amountInSubunits = Math.round(total * 100);

  let authorizationUrl: string | undefined;
  try {
    const result = await initializePaystackTransaction({
      email: effectiveEmail,
      amount: amountInSubunits,
      reference,
      callbackUrl: `${baseUrl}/checkout/success?order_id=${encodeURIComponent(orderId)}&reference=${encodeURIComponent(reference)}`,
      currency,
      metadata: {
        order_id: orderId,
        user_id: userId ?? null,
        items_count: items.length,
      },
    });

    if (!result.status || !result.data?.authorization_url) {
      throw new Error(result.message || "Paystack initialization failed.");
    }

    authorizationUrl = result.data.authorization_url;
  } catch (err) {
    throw new Error(
      err instanceof Error
        ? `Couldn't start Paystack checkout: ${err.message}`
        : "Couldn't start Paystack checkout. Please try again."
    );
  }

  redirect(authorizationUrl);
}
