"use server";

import { revalidatePath } from "next/cache";
import { clerkClient, auth } from "@clerk/nextjs/server";

export interface AdminUserRow {
  id: string;
  email: string;
  name: string;
  role: "admin" | "customer";
  createdAt: string;
}

export async function getAllUsers(): Promise<AdminUserRow[]> {
  try {
    const client = await clerkClient();
    const response = await client.users.getUserList({ limit: 100 });

    const users = response.data || [];

    return users
      .map((u) => {
        const email =
          u.primaryEmailAddressId && u.emailAddresses
            ? u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)?.emailAddress ?? u.emailAddresses[0]?.emailAddress ?? ""
            : u.emailAddresses?.[0]?.emailAddress ?? "";
        const name: string =
          u.fullName ||
          u.firstName ||
          (email ? email.split("@")[0] : "Customer") ||
          "Customer";
        const role = (u.publicMetadata?.role as string) === "admin" ? ("admin" as const) : ("customer" as const);

        return {
          id: u.id,
          email,
          name,
          role,
          createdAt: new Date(u.createdAt).toISOString(),
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    if (typeof err === "object" && err !== null && "digest" in err && (err as { digest?: string }).digest === "DYNAMIC_SERVER_USAGE") {
      throw err;
    }
    console.error("getAllUsers error:", err);
    return [];
  }
}

export async function setUserAdminRoleAction(
  userId: string,
  makeAdmin: boolean
): Promise<{ error?: string }> {
  try {
    const { userId: currentUserId } = await auth();

    if (currentUserId === userId) {
      return { error: "You can't modify your own admin status." };
    }

    const client = await clerkClient();

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: makeAdmin ? "admin" : null,
      },
    });

    revalidatePath("/admin/users");
    return {};
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to update user role.",
    };
  }
}

