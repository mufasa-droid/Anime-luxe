"use server";

import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
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

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function formatAuthError(err: unknown, defaultFallback: string): string {
  if (!isSupabaseConfigured()) {
    return "Authentication database is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.";
  }

  if (typeof err === "object" && err !== null) {
    const error = err as { message?: string; code?: string; status?: number; error_description?: string };
    const msg = (error.message || error.error_description || "").toLowerCase();
    const code = (error.code || "").toLowerCase();

    if (msg.includes("already registered") || msg.includes("user already exists") || code === "user_already_exists") {
      return "An account with this email address already exists. Please sign in instead.";
    }
    if (msg.includes("invalid login credentials") || msg.includes("invalid_credentials") || code === "invalid_credentials") {
      return "Incorrect email or password. Please verify your credentials and try again.";
    }
    if (msg.includes("email not confirmed") || code === "email_not_confirmed") {
      return "Your email address has not been confirmed yet. Please check your inbox for the confirmation link.";
    }
    if (msg.includes("password should be") || msg.includes("weak password") || code === "weak_password") {
      return "Password is too weak. Please use at least 8 characters with a mix of letters and numbers.";
    }
    if (msg.includes("rate limit") || code === "over_email_send_rate_limit" || code === "over_request_rate_limit") {
      return "Too many attempts. Please wait a few minutes before trying again.";
    }
    if (msg.includes("signups not allowed") || msg.includes("signup disabled") || code === "signup_disabled") {
      return "New registrations are currently disabled on this platform.";
    }
    if (msg.includes("fetch failed") || msg.includes("enotfound") || code === "fetch_failed") {
      return "Unable to connect to the authentication server. Please check your internet connection or verify your Supabase settings.";
    }
    if (error.message && error.message.trim().length > 0 && !error.message.includes("fetch failed")) {
      return error.message;
    }
  }

  return defaultFallback;
}

export async function signInWithPasswordAction(
  _prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {
  try {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const next = String(formData.get("next") ?? "/account");

    if (!email) {
      return { error: "Please enter your email address." };
    }
    if (!EMAIL_REGEX.test(email)) {
      return { error: "Please enter a valid email address (e.g. name@example.com)." };
    }
    if (!password) {
      return { error: "Please enter your password." };
    }

    if (!isSupabaseConfigured()) {
      return {
        error: "Authentication service not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.",
      };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { error: formatAuthError(error, "Failed to sign in. Please verify your email and password.") };
    }

    redirect(next);
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("signInWithPasswordAction error:", err);
    return {
      error: formatAuthError(err, "Unable to sign in. Please check your credentials and connection."),
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

    if (!name || name.length < 2) {
      return { error: "Please enter your full name (at least 2 characters)." };
    }
    if (!email) {
      return { error: "Please enter your email address." };
    }
    if (!EMAIL_REGEX.test(email)) {
      return { error: "Please enter a valid email format (e.g. name@example.com)." };
    }
    if (!password) {
      return { error: "Please enter a password." };
    }
    if (password.length < 8) {
      return { error: "Password must be at least 8 characters long." };
    }

    if (!isSupabaseConfigured()) {
      return {
        error: "Authentication service not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.",
      };
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
      return { error: formatAuthError(error, "Could not complete account registration.") };
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
      error: formatAuthError(err, "An error occurred while creating your account. Please try again."),
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
    if (!EMAIL_REGEX.test(email)) {
      return { error: "Please enter a valid email address (e.g. name@example.com)." };
    }

    if (!isSupabaseConfigured()) {
      return {
        error: "Authentication service not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.",
      };
    }

    const supabase = await createClient();
    const baseUrl = await getBaseUrl();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseUrl}/auth/callback?next=/reset-password`,
    });

    if (error) {
      return { error: formatAuthError(error, "Unable to send password reset email.") };
    }

    return {
      success: "If an account is associated with this email, a password reset link has been dispatched. Please check your inbox and Spam / Junk folder.",
    };
  } catch (err) {
    console.error("requestPasswordResetAction error:", err);
    return {
      error: formatAuthError(err, "Unable to process password reset request. Please check your connection and try again."),
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

    if (!isSupabaseConfigured()) {
      return {
        error: "Authentication service not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.",
      };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return { error: formatAuthError(error, "Failed to update password.") };
    }

    redirect("/account");
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("updatePasswordAction error:", err);
    return {
      error: formatAuthError(err, "Failed to update password. Please try again."),
    };
  }
}

export async function signInWithOAuthAction(
  provider: "google",
  next = "/account"
): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error("Authentication service is not configured. Please check your Supabase environment variables.");
  }

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
  if (!isSupabaseConfigured()) {
    redirect("/");
    return;
  }
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

