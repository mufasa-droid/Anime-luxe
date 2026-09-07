import { CreditCard, ShieldCheck } from "lucide-react";
import { ManageCardsButton } from "@/components/account/ManageCardsButton";

export default function SavedCardsPage() {
  return (
    <div>
      <h2 className="mb-6 font-heading text-xl font-bold text-white">
        Saved Cards & Security
      </h2>

      <div className="glass rounded-2xl p-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-accent-purple">
          <CreditCard size={28} />
        </div>
        <p className="mx-auto max-w-md text-white/60">
          Payment cards are tokenized and processed securely via Paystack&apos;s
          PCI-DSS Level 1 compliant infrastructure. Card numbers are never stored
          on our servers.
        </p>

        <div className="mt-6 flex justify-center">
          <ManageCardsButton />
        </div>

        <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-xs text-white/40">
          <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
          <span>256-bit encryption · Reusable authorization tokens</span>
        </div>
      </div>
    </div>
  );
}
