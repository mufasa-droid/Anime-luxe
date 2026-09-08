"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBaseUrl } from "@/lib/getBaseUrl";

export interface AuthActionState {
  error?: string;
  success?: string;
}

function isRedirectError(err: unknown): boolean {
  if (typeof err === "object" && err !== null) {
    const errorObj = err as Record<string, unknown>;
    if (errorObj.message === "NEXT_REDIRECT") return true;
    if (typeof errorObj.digest === "string" && errorObj.digest.startsWith("NEXT_REDIRECT")) return true;
  }
  return false;
}

export async function signInWithPasswordAction(
  _prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {
  try {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const next = String(formData.get("next") ?? "/account");

    if (!email || !password) {
      return { error: "Email and password are required." };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      const msg = error.message?.toLowerCase() ?? "";
      const code = (error as { code?: string }).code ?? "";

      if (msg.includes("invalid login credentials") || msg.includes("invalid_credentials") || code === "invalid_credentials") {
        return { error: "Incorrect email or password. Please check your credentials and try again." };
      }
      if (msg.includes("email not confirmed")) {
        return { error: "Your email address has not been confirmed yet. Please check your inbox for the confirmation link." };
      }
      if (msg.includes("fetch failed") || code === "fetch_failed") {
        return { error: "Unable to reach authentication server. Please check your connection and try again." };
      }
      return { error: error.message || "Failed to sign in. Please try again." };
    }

    redirect(next);
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("signInWithPasswordAction error:", err);
    return {
      error:
        err instanceof Error && err.message !== "fetch failed"
          ? err.message
          : "Incorrect email or password or network error. Please try again.",
    };
  }
}

export async function signUpAction(
  _prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {
  try {
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const next = String(formData.get("next") ?? "/account");

    if (!name || !email || !password) {
      return { error: "Name, email, and password are all required." };
    }
    if (password.length < 8) {
      return { error: "Password must be at least 8 characters long." };
    }

    const supabase = await createClient();
    const baseUrl = await getBaseUrl();

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${baseUrl}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (error) {
      const msg = error.message?.toLowerCase() ?? "";
      const code = (error as { code?: string }).code ?? "";

      if (msg.includes("already registered") || code === "user_already_exists") {
        return { error: "An account with this email already exists. Please sign in instead." };
      }
      if (msg.includes("rate limit") || code === "over_email_send_rate_limit") {
        return { error: "Sign-up rate limit reached. Please wait a few minutes before trying again." };
      }
      return { error: error.message || "Could not complete sign up." };
    }

    // If email confirmation is disabled in the Supabase project, signUp
    // already returns an active session — send them straight in.
    if (data.session) redirect(next);

    return {
      success: "Confirmation link dispatched! Check your inbox (and spam folder) to activate your account.",
    };
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("signUpAction error:", err);
    return {
      error:
        err instanceof Error && err.message !== "fetch failed"
          ? err.message
          : "An unexpected error occurred during sign up. Please try again.",
    };
  }
}

export async function requestPasswordResetAction(
  _prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {
  try {
    const email = String(formData.get("email") ?? "").trim();

    if (!email) {
      return { error: "Please enter your email address." };
    }

    const supabase = await createClient();
    const baseUrl = await getBaseUrl();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseUrl}/auth/callback?next=/reset-password`,
    });

    if (error) {
      const msg = error.message?.toLowerCase() ?? "";
      const code = (error as { code?: string }).code ?? "";

      if (msg.includes("rate limit") || code === "over_email_send_rate_limit") {
        return {
          error: "Too many password reset attempts. Please wait a few minutes before requesting another reset email.",
        };
      }
      return { error: error.message || "Unable to send password reset email." };
    }

    return {
      success: "If an account is associated with this email, a password reset link has been dispatched. Please check your inbox and Spam / Junk folder.",
    };
  } catch (err) {
    console.error("requestPasswordResetAction error:", err);
    return {
      error:
        err instanceof Error && err.message !== "fetch failed"
          ? err.message
          : "Unable to process password reset request. Please check your connection and try again.",
    };
  }
}

export async function updatePasswordAction(
  _prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {
  try {
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (!password || password.length < 8) {
      return { error: "Password must be at least 8 characters long." };
    }
    if (password !== confirmPassword) {
      return { error: "Passwords do not match." };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      const msg = error.message?.toLowerCase() ?? "";
      if (msg.includes("session missing") || msg.includes("auth session")) {
        return {
          error: "Your password reset session has expired or is invalid. Please request a new password reset link.",
        };
      }
      return { error: error.message || "Failed to update password." };
    }

    redirect("/account");
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("updatePasswordAction error:", err);
    return {
      error:
        err instanceof Error && err.message !== "fetch failed"
          ? err.message
          : "Failed to update password. Please try again.",
    };
  }
}

export async function signInWithOAuthAction(
  provider: "google" | "github",
  next = "/account"
): Promise<void> {
  const supabase = await createClient();
  const baseUrl = await getBaseUrl();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${baseUrl}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error || !data.url) {
    throw new Error(
      error?.message ??
        `Couldn't start ${provider} sign-in. Check that the provider is enabled in your Supabase project.`
    );
  }

  redirect(data.url);
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
