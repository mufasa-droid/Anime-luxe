import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export const metadata = {
  title: "Join the Club | ANIME LUXE",
  description: "Create an Anime Luxe account for instant access to limited edition figures, luxury anime apparel, and member rewards.",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-28 md:py-32">
      {/* Background Neon Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-accent-pink/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-accent-purple/15 blur-[120px]" />

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
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-pink/30 bg-accent-pink/10 px-3.5 py-1 text-xs font-semibold text-accent-pink">
            <Sparkles size={12} />
            <span>VIP Collector Membership</span>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-white md:text-3xl">
            Join <span className="text-gradient">ANIME LUXE</span>
          </h1>
          <p className="text-xs text-white/60">
            Create your account with your email for early drop access and exclusive rewards.
          </p>
        </div>

        {/* Clerk Sign Up Component */}
        <div className="flex justify-center">
          <SignUp
            path="/sign-up"
            routing="path"
            signInUrl="/login"
            fallbackRedirectUrl="/account"
          />
        </div>
      </div>
    </div>
  );
}
