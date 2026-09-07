import { getSupabaseServerClient } from "@/lib/services/supabase";
import type { CartItem } from "@/types";

export interface CreatePendingOrderInput {
  items: CartItem[];
  total: number;
  userId?: string;
  email?: string;
  reference?: string;
  isDemo?: boolean;
}

export interface OrderRecord {
  id: string;
  user_id: string | null;
  payment_reference?: string | null;
  stripe_session_id?: string | null;
  customer_email?: string | null;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled" | "refunded";
  items: CartItem[];
  total: number;
  created_at: string;
  is_demo?: boolean;
}

// In-memory cache for demo/showcase orders when Supabase is not connected
const _demoOrdersStore = new Map<string, OrderRecord>();

/**
 * Writes a pending order row before redirecting to payment gateway.
 */
export async function createPendingOrder(
  input: CreatePendingOrderInput
): Promise<string> {
  const generatedId = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const reference = input.reference ?? `ref_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: input.userId ?? null,
        items: input.items,
        total: input.total,
        status: input.isDemo ? "paid" : "pending",
        payment_reference: reference,
      })
      .select("id")
      .single();

    if (!error && data?.id) {
      return data.id as string;
    }
  } catch {
    // If Supabase is unconfigured or offline, fall back to in-memory store for demo
  }

  // Store in showcase memory fallback
  const demoOrder: OrderRecord = {
    id: generatedId,
    user_id: input.userId ?? null,
    payment_reference: reference,
    customer_email: input.email ?? "shopper@example.com",
    status: input.isDemo ? "paid" : "pending",
    items: input.items,
    total: input.total,
    created_at: new Date().toISOString(),
    is_demo: input.isDemo,
  };
  _demoOrdersStore.set(generatedId, demoOrder);
  _demoOrdersStore.set(reference, demoOrder);

  return generatedId;
}

/**
 * Marks an order as paid once confirmed by payment webhook or verification.
 */
export async function confirmPaidOrder(
  orderIdOrRef: string,
  paymentReference: string
): Promise<void> {
  // Update in-memory fallback if present
  const memoryOrder =
    _demoOrdersStore.get(orderIdOrRef) || _demoOrdersStore.get(paymentReference);
  if (memoryOrder) {
    memoryOrder.status = "paid";
    memoryOrder.payment_reference = paymentReference;
  }

  try {
    const supabase = getSupabaseServerClient();
    // Try updating by id first, then by payment_reference
    const { error: errorById } = await supabase
      .from("orders")
      .update({ status: "paid", payment_reference: paymentReference })
      .eq("id", orderIdOrRef);

    if (errorById) {
      await supabase
        .from("orders")
        .update({ status: "paid", payment_reference: paymentReference })
        .eq("payment_reference", orderIdOrRef);
    }
  } catch {
    // Fail soft if database isn't connected
  }
}

/**
 * Retrieves an order by ID or payment reference.
 */
export async function getOrderById(orderId: string): Promise<OrderRecord | null> {
  // Check memory store first
  if (_demoOrdersStore.has(orderId)) {
    return _demoOrdersStore.get(orderId)!;
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .or(`id.eq.${orderId},payment_reference.eq.${orderId}`)
      .single();

    if (!error && data) {
      return data as OrderRecord;
    }
  } catch {
    // Database unconfigured
  }

  return null;
}
