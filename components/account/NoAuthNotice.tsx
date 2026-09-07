import { Info } from "lucide-react";

export function NoAuthNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-start gap-2.5 rounded-2xl bg-accent-blue/10 px-4 py-3 text-sm text-white/60">
      <Info size={16} className="mt-0.5 shrink-0 text-accent-blue" />
      <span>{children}</span>
    </div>
  );
}
