import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AccessDenied } from "@/components/admin/AccessDenied";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) redirect("/login");

  const isAdmin = user.publicMetadata?.role === "admin";
  if (!isAdmin) return <AccessDenied />;

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <h1 className="mb-8 font-heading text-4xl font-bold text-white">
        Admin
      </h1>
      <div className="flex flex-col gap-8 md:flex-row">
        <AdminSidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
