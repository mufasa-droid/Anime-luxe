"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Lock, AlertCircle, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { updatePasswordAction, type AuthActionState } from "@/lib/actions/auth";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

const initialState: AuthActionState = {};

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [state, formAction, isPending] = useActionState(
    updatePasswordAction,
    initialState
  );

  const inputClass =
    "glass w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-accent-purple/50";

  return (
    <div className="flex min-h-screen items-center justify-center px-6 pt-24 pb-12">
      <div className="glass-strong w-full max-w-md rounded-3xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-purple/20 text-accent-purple shadow-glow">
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
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                placeholder="At least 8 characters"
                className={cn(inputClass, "pr-11")}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={8}
                placeholder="Repeat new password"
                className={cn(inputClass, "pr-11")}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white transition-colors focus:outline-none"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
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

        <Link
          href="/login"
          className="mt-6 flex w-full items-center justify-center gap-2 text-xs text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
}

