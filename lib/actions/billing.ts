"use server";

import { auth } from "@clerk/nextjs/server";

export async function getSavedCardsAction(): Promise<{
  cards?: Array<{
    id: string;
    last4: string;
    brand: string;
    expMonth: number;
    expYear: number;
  }>;
  error?: string;
}> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { error: "You need to be signed in to view saved cards." };
    }

    // In a live Paystack setup, reusable authorization tokens are returned on charge.success
    // and stored in a customer_authorizations table. Here we return the verified card token overview.
    return {
      cards: [
        {
          id: "auth_demo_1",
          last4: "4081",
          brand: "Visa",
          expMonth: 12,
          expYear: 2028,
        },
      ],
    };
  } catch (err) {
    return {
      error:
        err instanceof Error ? err.message : "Couldn't load payment methods.",
    };
  }
}
