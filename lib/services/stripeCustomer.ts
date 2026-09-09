import { stripe } from "@/lib/services/stripe";
import { clerkClient } from "@clerk/nextjs/server";

/**
 * Gets the signed-in user's Stripe Customer, creating one on first use.
 * The customer ID is persisted to Clerk user `privateMetadata` / `publicMetadata`.
 */
export async function getOrCreateStripeCustomerId(
  userId: string,
  email: string | undefined
): Promise<string> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const existingId = (user.privateMetadata?.stripe_customer_id as string | undefined) ||
    (user.publicMetadata?.stripe_customer_id as string | undefined);
  if (existingId) return existingId;

  const customer = await stripe.customers.create({
    email,
    metadata: { clerk_user_id: userId },
  });

  await client.users.updateUserMetadata(userId, {
    privateMetadata: {
      ...user.privateMetadata,
      stripe_customer_id: customer.id,
    },
  });

  return customer.id;
}

