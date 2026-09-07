import { stripe } from "@/lib/services/stripe";
import { getSupabaseServerClient } from "@/lib/services/supabase";

/**
 * Gets the signed-in user's Stripe Customer, creating one on first use.
 * The customer ID is persisted to Supabase Auth `app_metadata` — not
 * user-editable by the user themselves, same pattern already used for
 * the admin role flag (see lib/actions/admin/users.ts). Safe to call
 * repeatedly: it's a cheap lookup after the first successful creation.
 *
 * Used by both checkout (so the card used gets attached to a real
 * Customer) and the Saved Cards page (so the Billing Portal has
 * something to open even for someone who hasn't checked out yet).
 */
export async function getOrCreateStripeCustomerId(
  userId: string,
  email: string | undefined
): Promise<string> {
  const supabase = getSupabaseServerClient();

  const { data: existingUser } = await supabase.auth.admin.getUserById(userId);
  const existingId = existingUser.user?.app_metadata?.stripe_customer_id as
    | string
    | undefined;
  if (existingId) return existingId;

  const customer = await stripe.customers.create({
    email,
    metadata: { supabase_user_id: userId },
  });

  await supabase.auth.admin.updateUserById(userId, {
    app_metadata: {
      ...(existingUser.user?.app_metadata ?? {}),
      stripe_customer_id: customer.id,
    },
  });

  return customer.id;
}
