"use client";

import { useState, useTransition } from "react";
import { setUserAdminRoleAction } from "@/lib/actions/admin/users";
import { cn } from "@/lib/utils";

export function ToggleAdminButton({
  userId,
  isAdmin,
}: {
  userId: string;
  isAdmin: boolean;
}) {
  const [admin, setAdmin] = useState(isAdmin);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    const next = !admin;
    setAdmin(next);
    startTransition(async () => {
      const result = await setUserAdminRoleAction(userId, next);
      if (result.error) {
        setAdmin(!next);
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleClick}
        disabled={isPending}
        className={cn(
          "rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50",
          admin
            ? "bg-accent-purple/20 text-accent-purple hover:bg-accent-purple/30"
            : "bg-white/10 text-white/60 hover:bg-white/20"
        )}
      >
        {isPending ? "Updating…" : admin ? "Revoke Admin" : "Make Admin"}
      </button>
      {error && <span className="text-[10px] text-accent-red">{error}</span>}
    </div>
  );
}
