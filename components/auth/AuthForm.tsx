"use client";

import { useActionState, useState, useTransition } from "react";
import {
  AlertCircle,
  CheckCircle2,
  MailCheck,
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
  RotateCcw,
} from "lucide-react";
import {
  signInWithPasswordAction,
  signUpAction,
  signInWithOAuthAction,
  requestPasswordResetAction,
  type AuthActionState,
} from "@/lib/actions/auth";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

const initialState: AuthActionState = {};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
      />
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
      />
      <path
        fill="#FBBC05"
        d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.1s.7 5.4 1.9 7.8l3.7-2.9z"
      />
      <path
        fill="#34A853"
        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 6.3 10.1 6.3z"
      />
    </svg>
  );
}

export function AuthForm({
  next,
  initialError,
}: {
  next?: string;
  initialError?: string;
}) {
  const redirectTarget = next ?? "/account";
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const [signInState, signInFormAction, signInPending] = useActionState(
    signInWithPasswordAction,
    initialState
  );
  const [signUpState, signUpFormAction, signUpPending] = useActionState(
    signUpAction,
    initialState
  );
  const [resetState, resetFormAction, resetPending] = useActionState(
    requestPasswordResetAction,
    initialState
  );

  const [oauthError, setOauthError] = useState<string | null>(null);
  const [oauthPending, startOauthTransition] = useTransition();

  function handleGoogleOAuth() {
    setOauthError(null);
    startOauthTransition(async () => {
      try {
        await signInWithOAuthAction("google", redirectTarget);
      } catch (err) {
        setOauthError(
          err instanceof Error ? err.message : "Couldn't initiate Google sign-in."
        );
      }
    });
  }

  const inputClass =
    "glass w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-accent-purple/50 transition-all border border-white/10";
  const labelClass = "mb-1.5 block text-xs font-medium text-white/70";

  const callbackErrorMessage =
    initialError === "auth_callback_failed"
      ? "Authentication link expired or is invalid. Please sign in again or request a new reset link."
      : initialError;

  // 1. Forgot Password View
  if (isForgotPassword) {
    return (
      <div className="glass-strong w-full max-w-md rounded-3xl p-8 text-center border border-white/10 shadow-2xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-purple/20 text-accent-purple shadow-glow">
          <KeyRound size={28} />
        </div>

        <h3 className="font-heading text-2xl font-bold text-white">
          Reset Password
        </h3>
        <p className="mt-1.5 text-xs text-white/60">
          Enter your account email to receive a password reset link.
        </p>

        {resetState?.success ? (
          <div className="my-6 space-y-4">
            <div className="glass rounded-2xl p-5 text-left text-xs text-emerald-400 border border-emerald-500/20 space-y-2.5">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 size={16} />
                Reset Email Dispatched
              </div>
              <p className="text-white/80 leading-relaxed">
                {resetState.success}
              </p>
              <p className="text-white/40 italic text-[11px]">
                * If you don&apos;t see the email within 2 minutes, check your Spam / Junk folder or verify that an account exists with this email.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setResetKey((prev) => prev + 1)}
              className="flex items-center justify-center gap-2 mx-auto text-xs text-accent-purple hover:underline"
            >
              <RotateCcw size={13} />
              <span>Send to a different email or try again</span>
            </button>
          </div>
        ) : (
          <form
            key={resetKey}
            action={resetFormAction}
            className="mt-6 space-y-4 text-left"
          >
            <div>
              <label className={labelClass}>Email Address</label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@email.com"
                className={inputClass}
                autoComplete="email"
              />
            </div>

            {resetState?.error && (
              <div className="flex items-start gap-2 rounded-xl bg-accent-red/10 border border-accent-red/20 px-3 py-2.5 text-xs text-accent-red">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <span>{resetState.error}</span>
              </div>
            )}

            <MagneticButton
              type="submit"
              disabled={resetPending}
              className="w-full text-center disabled:opacity-60"
            >
              {resetPending ? "Sending reset link…" : "Send Reset Link"}
            </MagneticButton>
          </form>
        )}

        <button
          type="button"
          onClick={() => setIsForgotPassword(false)}
          className="mt-6 flex w-full items-center justify-center gap-2 text-xs text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Sign In</span>
        </button>
      </div>
    );
  }

  // 2. Sign Up Confirmation Screen
  if (tab === "signup" && signUpState?.success) {
    return (
      <div className="glass-strong w-full max-w-md rounded-3xl p-8 text-center border border-white/10 shadow-2xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-purple/20 text-accent-purple shadow-glow">
          <MailCheck size={32} />
        </div>

        <h3 className="font-heading text-2xl font-bold text-white">
          Confirmation Link Sent!
        </h3>

        <p className="mt-2 text-sm text-white/70">
          {signUpState.success}
        </p>

        <div className="glass my-6 rounded-2xl p-4 text-left text-xs text-white/60 space-y-2 border border-white/10">
          <p className="flex items-center gap-2 text-white font-medium">
            <CheckCircle2 size={14} className="text-emerald-400" />
            Next Steps:
          </p>
          <p>1. Open your email inbox.</p>
          <p>2. Click the confirmation link to activate your anime luxe account.</p>
          <p className="text-white/40 italic">
            * Check your Spam or Junk folder if the message does not appear within a minute.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setTab("signin")}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-white/10 py-3 font-heading text-sm font-semibold text-white transition-colors hover:bg-white/20"
        >
          <ArrowLeft size={16} />
          <span>Go to Sign In</span>
        </button>
      </div>
    );
  }

  return (
    <div className="glass-strong w-full max-w-md rounded-3xl p-8 border border-white/10 shadow-2xl">
      <div className="mb-6 flex rounded-full bg-white/5 p-1 border border-white/10">
        <button
          onClick={() => setTab("signin")}
          className={cn(
            "flex-1 rounded-full py-2 text-sm font-medium transition-all",
            tab === "signin" ? "bg-white/15 text-white shadow-sm" : "text-white/50 hover:text-white/80"
          )}
        >
          Sign In
        </button>
        <button
          onClick={() => setTab("signup")}
          className={cn(
            "flex-1 rounded-full py-2 text-sm font-medium transition-all",
            tab === "signup" ? "bg-white/15 text-white shadow-sm" : "text-white/50 hover:text-white/80"
          )}
        >
          Sign Up
        </button>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleGoogleOAuth}
          disabled={oauthPending}
          className="glass flex w-full items-center justify-center gap-3 rounded-full py-2.5 text-sm font-medium text-white transition-all hover:bg-white/10 border border-white/10 disabled:opacity-50"
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </button>
      </div>

      {oauthError && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-accent-red/10 border border-accent-red/20 px-3 py-2.5 text-xs text-accent-red">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{oauthError}</span>
        </div>
      )}

      {callbackErrorMessage && !signInState?.error && !oauthError && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2.5 text-xs text-amber-300">
          <AlertCircle size={14} className="mt-0.5 shrink-0 text-amber-400" />
          <span>{callbackErrorMessage}</span>
        </div>
      )}

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-white/40">or with email</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      {tab === "signin" ? (
        <form key="signin" action={signInFormAction} className="space-y-4">
          <input type="hidden" name="next" value={redirectTarget} />
          <div>
            <label className={labelClass}>Email Address</label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@email.com"
              className={inputClass}
              autoComplete="email"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className={labelClass}>Password</label>
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-[11px] text-accent-purple hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                name="password"
                type={showSignInPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className={cn(inputClass, "pr-11")}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowSignInPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white transition-colors focus:outline-none"
                aria-label={showSignInPassword ? "Hide password" : "Show password"}
              >
                {showSignInPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <MagneticButton
            type="submit"
            disabled={signInPending}
            className="w-full text-center disabled:opacity-60"
          >
            {signInPending ? "Signing in…" : "Sign In"}
          </MagneticButton>
        </form>
      ) : (
        <form key="signup" action={signUpFormAction} className="space-y-4">
          <input type="hidden" name="next" value={redirectTarget} />
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              name="name"
              type="text"
              required
              placeholder="e.g. Levi Ackerman"
              className={inputClass}
              autoComplete="name"
            />
          </div>
          <div>
            <label className={labelClass}>Email Address</label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@email.com"
              className={inputClass}
              autoComplete="email"
            />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <div className="relative">
              <input
                name="password"
                type={showSignUpPassword ? "text" : "password"}
                required
                minLength={8}
                placeholder="At least 8 characters"
                className={cn(inputClass, "pr-11")}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowSignUpPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white transition-colors focus:outline-none"
                aria-label={showSignUpPassword ? "Hide password" : "Show password"}
              >
                {showSignUpPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-white/40">
              Must be at least 8 characters.
            </p>
          </div>
          <MagneticButton
            type="submit"
            disabled={signUpPending}
            className="w-full text-center disabled:opacity-60"
          >
            {signUpPending ? "Creating account…" : "Create Account"}
          </MagneticButton>
        </form>
      )}

      {signInState?.error && tab === "signin" && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-accent-red/10 border border-accent-red/20 px-3.5 py-2.5 text-xs text-accent-red">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span className="leading-relaxed">{signInState.error}</span>
        </div>
      )}
      {signUpState?.error && tab === "signup" && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-accent-red/10 border border-accent-red/20 px-3.5 py-2.5 text-xs text-accent-red">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span className="leading-relaxed">{signUpState.error}</span>
        </div>
      )}
    </div>
  );
}


