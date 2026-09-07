"use client";

import { useActionState, useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, MailCheck, ArrowLeft } from "lucide-react";
import {
  signInWithPasswordAction,
  signUpAction,
  signInWithOAuthAction,
  type AuthActionState,
} from "@/lib/actions/auth";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

const initialState: AuthActionState = {};

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 11v2.8h6.5c-.3 1.6-2 4.7-6.5 4.7-3.9 0-7.1-3.2-7.1-7.2s3.2-7.2 7.1-7.2c2.2 0 3.7.9 4.6 1.7l3.1-3C17.6 1 15 0 12 0 5.4 0 0 5.4 0 12s5.4 12 12 12c6.9 0 11.5-4.9 11.5-11.7 0-.8-.1-1.4-.2-2H12z"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6C20.6 21.8 24 17.3 24 12c0-6.6-5.4-12-12-12Z" />
    </svg>
  );
}

export function AuthForm({ next }: { next?: string }) {
  const redirectTarget = next ?? "/account";
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [signInState, signInFormAction, signInPending] = useActionState(
    signInWithPasswordAction,
    initialState
  );
  const [signUpState, signUpFormAction, signUpPending] = useActionState(
    signUpAction,
    initialState
  );
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [oauthPending, startOauthTransition] = useTransition();

  function handleOAuth(provider: "google" | "github") {
    setOauthError(null);
    startOauthTransition(async () => {
      try {
        await signInWithOAuthAction(provider, redirectTarget);
      } catch (err) {
        setOauthError(
          err instanceof Error ? err.message : "Couldn't start sign-in."
        );
      }
    });
  }

  const inputClass =
    "glass w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none";
  const labelClass = "mb-1.5 block text-xs font-medium text-white/60";

  // If a signup confirmation email was dispatched, show a prominent verification screen
  if (tab === "signup" && signUpState?.success) {
    return (
      <div className="glass-strong w-full max-w-md rounded-3xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-purple/20 text-accent-purple shadow-glow">
          <MailCheck size={32} />
        </div>

        <h3 className="font-heading text-2xl font-bold text-white">
          Confirmation Link Sent!
        </h3>

        <p className="mt-2 text-sm text-white/70">
          {signUpState.success}
        </p>

        <div className="glass my-6 rounded-2xl p-4 text-left text-xs text-white/60 space-y-2">
          <p className="flex items-center gap-2 text-white font-medium">
            <CheckCircle2 size={14} className="text-emerald-400" />
            Next Steps:
          </p>
          <p>1. Open your email client and check your inbox.</p>
          <p>2. Click the verification link to activate your account.</p>
          <p className="text-white/40 italic">
            * Be sure to check your Spam or Junk folder if the email does not appear within a minute.
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
    <div className="glass-strong w-full max-w-md rounded-3xl p-8">
      <div className="mb-6 flex rounded-full bg-white/5 p-1">
        <button
          onClick={() => setTab("signin")}
          className={cn(
            "flex-1 rounded-full py-2 text-sm font-medium transition-colors",
            tab === "signin" ? "bg-white/10 text-white" : "text-white/50"
          )}
        >
          Sign In
        </button>
        <button
          onClick={() => setTab("signup")}
          className={cn(
            "flex-1 rounded-full py-2 text-sm font-medium transition-colors",
            tab === "signup" ? "bg-white/10 text-white" : "text-white/50"
          )}
        >
          Sign Up
        </button>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => handleOAuth("google")}
          disabled={oauthPending}
          className="glass flex w-full items-center justify-center gap-2.5 rounded-full py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-50"
        >
          <GoogleIcon />
          Continue with Google
        </button>
        <button
          onClick={() => handleOAuth("github")}
          disabled={oauthPending}
          className="glass flex w-full items-center justify-center gap-2.5 rounded-full py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-50"
        >
          <GithubIcon />
          Continue with GitHub
        </button>
      </div>

      {oauthError && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-accent-red/10 px-3 py-2.5 text-xs text-accent-red">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{oauthError}</span>
        </div>
      )}

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-white/30">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      {tab === "signin" ? (
        <form key="signin" action={signInFormAction} className="space-y-4">
          <input type="hidden" name="next" value={redirectTarget} />
          <div>
            <label className={labelClass}>Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@email.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className={inputClass}
            />
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
              placeholder="Jane Doe"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@email.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input
              name="password"
              type="password"
              required
              placeholder="At least 8 characters"
              className={inputClass}
            />
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
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-accent-red/10 px-3 py-2.5 text-xs text-accent-red">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{signInState.error}</span>
        </div>
      )}
      {signUpState?.error && tab === "signup" && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-accent-red/10 px-3 py-2.5 text-xs text-accent-red">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{signUpState.error}</span>
        </div>
      )}
    </div>
  );
}
