"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteProductAction } from "@/lib/actions/admin/products";

export function DeleteProductButton({ id, title }: { id: string; title: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (confirming) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="text-white/50">Delete &quot;{title}&quot;?</span>
        <button
          onClick={() => startTransition(() => deleteProductAction(id))}
          disabled={isPending}
          className="rounded-full bg-accent-red/20 px-2.5 py-1 font-medium text-accent-red hover:bg-accent-red/30"
        >
          {isPending ? "Deleting…" : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded-full px-2.5 py-1 text-white/50 hover:text-white"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      aria-label="Delete product"
      className="rounded-full p-1.5 text-white/40 hover:bg-white/10 hover:text-accent-red"
    >
      <Trash2 size={14} />
    </button>
  );
}
