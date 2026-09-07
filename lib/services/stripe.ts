import Stripe from "stripe";
import type { CartItem } from "@/types";

let _stripeClient: Stripe | null = null;

function getStripeClient(): Stripe {
  if (_stripeClient) return _stripeClient;
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to .env.local to enable Stripe checkout."
    );
  }
  _stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
  });
  return _stripeClient;
}

/**
 * Lazily-initialized Stripe client. Property access (`stripe.checkout...`,
 * `stripe.webhooks...`) only instantiates — and only requires
 * STRIPE_SECRET_KEY — the first time it's actually used at runtime, so
 * importing this module never crashes build-time static analysis (e.g.
 * Next.js "Collecting page data") when the key isn't configured yet.
 */
export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    const client = getStripeClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export async function createCheckoutSession(
  items: CartItem[],
  successUrl: string,
  cancelUrl: string,
  metadata?: Record<string, string>,
  customerId?: string
) {
  const line_items = items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.title,
        images: [item.image],
        metadata: {
          size: item.size ?? "",
          color: item.color ?? "",
        },
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  return stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
    customer: customerId,
    // Attaches the card used at checkout to the Customer for later reuse
    // (e.g. the Saved Cards / Billing Portal page) — only meaningful when
    // a customerId is passed, i.e. the shopper is signed in.
    payment_intent_data: customerId
      ? { setup_future_usage: "off_session" }
      : undefined,
    shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "NG"] },
  });
}

/**
 * Saved payment methods live in Stripe's Customer Portal, not in our own
 * database — this just opens a session for an existing Stripe Customer.
 * See lib/services/stripeCustomer.ts for how the customer ID is
 * created/looked up, and app/account/cards/page.tsx for where this gets
 * called from.
 */
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}
