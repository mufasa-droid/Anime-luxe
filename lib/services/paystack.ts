/**
 * Direct fetch-based Paystack API service.
 * Lazy-initialized, typed, and fails soft when credentials are not configured.
 */

export interface PaystackInitializeOptions {
  email: string;
  amount: number; // In kobo / cents (e.g. 100 USD = 10000, 5000 NGN = 500000)
  reference: string;
  callbackUrl: string;
  currency?: string; // Default: NGN or USD depending on config
  metadata?: Record<string, unknown>;
}

export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    status: "success" | "failed" | "abandoned" | "reversed";
    reference: string;
    amount: number;
    currency: string;
    customer?: {
      id: number;
      email: string;
      customer_code: string;
    };
    metadata?: Record<string, unknown>;
  };
}

export function isPaystackConfigured(): boolean {
  return Boolean(process.env.PAYSTACK_SECRET_KEY);
}

function getPaystackSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error(
      "Paystack is not configured. Add PAYSTACK_SECRET_KEY to .env.local (see README) to enable real live/test checkout."
    );
  }
  return key;
}

/**
 * Initializes a transaction with Paystack and returns the checkout URL.
 */
export async function initializePaystackTransaction(
  options: PaystackInitializeOptions
): Promise<PaystackInitializeResponse> {
  const secretKey = getPaystackSecretKey();

  const body: Record<string, unknown> = {
    email: options.email,
    amount: Math.round(options.amount), // Ensure integer (kobo/cents)
    reference: options.reference,
    callback_url: options.callbackUrl,
    metadata: options.metadata,
  };

  if (options.currency) {
    body.currency = options.currency;
  }

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = (await response.json()) as PaystackInitializeResponse;
  return json;
}

/**
 * Verifies a transaction by its reference directly against Paystack API.
 */
export async function verifyPaystackTransaction(
  reference: string
): Promise<PaystackVerifyResponse> {
  const secretKey = getPaystackSecretKey();

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  const json = (await response.json()) as PaystackVerifyResponse;
  return json;
}
