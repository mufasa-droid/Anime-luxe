"use server";

import { revalidatePath } from "next/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";

export interface ProfileActionState {
  error?: string;
  success?: string;
}

export async function updateProfileAction(
  _prevState: ProfileActionState | null,
  formData: FormData
): Promise<ProfileActionState> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required." };

  const { userId } = await auth();
  if (!userId) {
    return { error: "You must be signed in to update your profile." };
  }

  try {
    const client = await clerkClient();
    const parts = name.split(" ");
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ") || undefined;

    await client.users.updateUser(userId, {
      firstName,
      lastName,
    });

    revalidatePath("/account/profile");
    return { success: "Profile updated successfully." };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to update profile.",
    };
  }
}

