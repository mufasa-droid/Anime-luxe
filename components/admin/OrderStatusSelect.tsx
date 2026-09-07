"use client";

import { useTransition, useState } from "react";
import { updateOrderStatusAction } from "@/lib/actions/admin/orders";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = ["pending", "paid", "cancelled", "refunded"];

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-accent-blue/20 text-accent-blue",
  pending: "bg-accent-gold/20 text-accent-gold",
  cancelled: "bg-white/10 text-white/50",
  refunded: "bg-accent-red/20 text-accent-red",
};

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const [current, setCurrent] = useState(status);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleChange(next: string) {
    setError(null);
    const previous = current;
    setCurrent(next);
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, next);
      if (result.error) {
        setCurrent(previous);
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <select
        value={current}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isPending}
        className={cn(
          "rounded-full border-none px-3 py-1 text-xs font-medium capitalize focus:outline-none [&>option]:bg-base-900 [&>option]:text-white",
          STATUS_STYLES[current] ?? "bg-white/10 text-white/60"
        )}
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {error && <span className="text-[10px] text-accent-red">{error}</span>}
    </div>
  );
}
