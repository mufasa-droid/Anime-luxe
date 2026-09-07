import { NextResponse } from "next/server";
import crypto from "crypto";
import { confirmPaidOrder } from "@/lib/services/orders";

export async function POST(req: Request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "PAYSTACK_SECRET_KEY is not configured" },
      { status: 500 }
    );
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing x-paystack-signature header" },
      { status: 400 }
    );
  }

  // Verify HMAC SHA512 signature
  const hash = crypto
    .createHmac("sha512", secretKey)
    .update(rawBody)
    .digest("hex");

  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    const payload = JSON.parse(rawBody);

    if (payload.event === "charge.success") {
      const data = payload.data;
      const reference = data.reference;
      const orderId = data.metadata?.order_id || reference;

      if (reference) {
        await confirmPaidOrder(orderId, reference);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Error processing Paystack webhook",
      },
      { status: 500 }
    );
  }
}
