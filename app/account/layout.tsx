import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { AccountSidebar } from "@/components/account/AccountSidebar";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) redirect("/login");

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-28 md:pt-32">
      <Breadcrumbs items={[{ label: "My Account" }]} backHref="/" backLabel="Home" />
      <h1 className="mb-8 font-heading text-4xl font-bold text-neutral-900 dark:text-white">
        My Account
      </h1>
      <div className="flex flex-col gap-8 md:flex-row">
        <AccountSidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
