import { headers } from "next/headers";

export async function getBaseUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  try {
    const headersList = await headers();
    const host =
      headersList.get("x-forwarded-host") ??
      headersList.get("host") ??
      "localhost:3000";
    const proto =
      headersList.get("x-forwarded-proto") ??
      (host.startsWith("localhost") || host.startsWith("127.0.0.1")
        ? "http"
        : "https");

    return `${proto}://${host}`;
  } catch {
    return "http://localhost:3000";
  }
}

