// Grants (or revokes) the admin role for a Clerk user by email.
//
// Usage:
//   node --env-file=.env.local scripts/make-admin.mjs you@email.com
//   node --env-file=.env.local scripts/make-admin.mjs you@email.com --revoke
//
// Requires CLERK_SECRET_KEY to be set in .env.local.

import { createClerkClient } from "@clerk/backend";

async function main() {
  const email = process.argv[2];
  const revoke = process.argv.includes("--revoke");

  if (!email) {
    console.error("Usage: node --env-file=.env.local scripts/make-admin.mjs <email> [--revoke]");
    process.exit(1);
  }

  const secretKey = process.env.CLERK_SECRET_KEY;

  if (!secretKey) {
    console.error(
      "Missing CLERK_SECRET_KEY. Did you forget --env-file=.env.local?"
    );
    process.exit(1);
  }

  const clerk = createClerkClient({ secretKey });
  const response = await clerk.users.getUserList({ emailAddress: [email] });
  const user = response.data?.[0];

  if (!user) {
    console.error(`No user found with email "${email}". They need to sign up first.`);
    process.exit(1);
  }

  await clerk.users.updateUserMetadata(user.id, {
    publicMetadata: {
      ...user.publicMetadata,
      role: revoke ? null : "admin",
    },
  });

  console.log(
    revoke
      ? `✅ Revoked admin access for ${email}.`
      : `✅ ${email} is now an admin — they can access /admin immediately.`
  );
}

main().catch((err) => {
  console.error("Failed:", err.message ?? err);
  process.exit(1);
});

