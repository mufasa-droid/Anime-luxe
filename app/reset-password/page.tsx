"use client";

import { useActionState } from "react";
import { Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { updatePasswordAction, type AuthActionState } from "@/lib/actions/auth";
import { MagneticButton } from "@/components/ui/MagneticButton";

const initialState: AuthActionState = {};

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    updatePasswordAction,
    initialState
  );

  return (
    <div className="flex min-h-screen items-center justify-center px-6 pt-24 pb-12">
      <div className="glass-strong w-full max-w-md rounded-3xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-purple/20 text-accent-purple">
          <Lock size={26} />
        </div>

        <h1 className="font-heading text-2xl font-bold text-white">
          Set New Password
        </h1>
        <p className="mt-1.5 text-xs text-white/60">
          Enter a new secure password for your Anime Luxe account.
        </p>

        <form action={formAction} className="mt-6 space-y-4 text-left">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">
              New Password
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="••••••••"
              className="glass w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">
              Confirm New Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              placeholder="••••••••"
              className="glass w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none"
            />
          </div>

          {state?.error && (
            <div className="flex items-start gap-2 rounded-xl bg-accent-red/10 px-3 py-2.5 text-xs text-accent-red">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <div className="pt-2">
            <MagneticButton
              type="submit"
              disabled={isPending}
              className="w-full text-center disabled:opacity-60"
            >
              {isPending ? "Updating Password…" : "Update Password & Sign In"}
            </MagneticButton>
          </div>
        </form>
      </div>
    </div>
  );
}
