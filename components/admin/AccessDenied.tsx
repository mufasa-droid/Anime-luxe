import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export function AccessDenied() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 pt-24">
      <div className="glass-strong w-full max-w-md rounded-3xl p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-red/20">
          <ShieldAlert size={28} className="text-accent-red" />
        </div>
        <h1 className="mt-6 font-heading text-2xl font-bold text-white">
          Admin Access Required
        </h1>
        <p className="mt-2 text-white/60">
          Your account doesn&apos;t have admin permissions. If you think this
          is a mistake, ask an existing admin to grant access — see{" "}
          <code className="rounded bg-white/10 px-1 py-0.5">
            scripts/make-admin.mjs
          </code>{" "}
          in the README.
        </p>
        <Link
          href="/account"
          className="mt-6 inline-block rounded-full bg-white/10 px-6 py-2.5 text-sm font-medium text-white hover:bg-white/20"
        >
          Back to My Account
        </Link>
      </div>
    </div>
  );
}
