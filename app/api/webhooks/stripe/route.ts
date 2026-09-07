import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message:
        "Stripe webhooks have been migrated to Paystack. Use /api/webhooks/paystack instead.",
    },
    { status: 200 }
  );
}
