"use client";

import { useUser } from "@clerk/nextjs";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  imageUrl?: string;
  isAdmin: boolean;
}

export function useAuthUser() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return { user: null, loaded: false, isSignedIn: false, clerkUser: null };
  }

  if (!isSignedIn || !user) {
    return { user: null, loaded: true, isSignedIn: false, clerkUser: null };
  }

  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses?.[0]?.emailAddress ??
    "";
  const name: string =
    user.fullName ||
    user.firstName ||
    (email ? email.split("@")[0] : "Collector") ||
    "Collector";

  const isAdmin = user.publicMetadata?.role === "admin";

  const authUser: AuthUser = {
    id: user.id,
    email,
    name,
    imageUrl: user.imageUrl,
    isAdmin,
  };

  return { user: authUser, loaded: true, isSignedIn: true, clerkUser: user };
}

