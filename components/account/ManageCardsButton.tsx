"use client";

import { useState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function ManageCardsButton() {
  const [copied, setCopied] = useState(false);

  function handleAddCard() {
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  return (
    <div>
      <MagneticButton
        onClick={handleAddCard}
        className="!px-6 !py-2.5 text-sm"
      >
        <span className="flex items-center gap-2">
          {copied ? (
            <>
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Token Vault Active</span>
            </>
          ) : (
            <>
              <ShieldCheck size={16} />
              <span>Secure Token Vault Info</span>
            </>
          )}
        </span>
      </MagneticButton>

      {copied && (
        <p className="mt-3 text-xs text-emerald-400">
          ✓ Paystack tokenization is automatically saved when completing your next checkout.
        </p>
      )}
    </div>
  );
}
