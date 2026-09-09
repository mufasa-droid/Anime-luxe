import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export const metadata = {
  title: "Sign In | ANIME LUXE",
  description: "Sign in to your Anime Luxe account to manage your orders, wishlist, and exclusive drops.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-28 md:py-32">
      {/* Background Neon Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-accent-purple/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-accent-pink/15 blur-[120px]" />

      <div className="w-full max-w-md space-y-6 text-center">
        {/* Top Brand Indicator */}
        <div className="flex flex-col items-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft size={13} />
            <span>Back to Store</span>
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-purple/30 bg-accent-purple/10 px-3.5 py-1 text-xs font-semibold text-accent-purple">
            <Sparkles size={12} />
            <span>Collector Access</span>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-white md:text-3xl">
            Welcome to <span className="text-gradient">ANIME LUXE</span>
          </h1>
          <p className="text-xs text-white/60">
            Sign in with your email to access your orders, wishlist & collector perks.
          </p>
        </div>

        {/* Clerk Sign In Component */}
        <div className="flex justify-center">
          <SignIn
            path="/login"
            routing="path"
            signUpUrl="/sign-up"
            fallbackRedirectUrl="/account"
          />
        </div>
      </div>
    </div>
  );
}
