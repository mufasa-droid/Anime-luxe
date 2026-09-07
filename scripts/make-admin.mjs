// Grants (or revokes) the admin role for a Supabase Auth user by email.
//
// Usage:
//   node --env-file=.env.local scripts/make-admin.mjs you@email.com
//   node --env-file=.env.local scripts/make-admin.mjs you@email.com --revoke
//
// Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to be
// set (in .env.local, loaded above via Node's built-in --env-file flag —
// no dotenv dependency needed on Node 20.6+).

import { createClient } from "@supabase/supabase-js";

async function main() {
  const email = process.argv[2];
  const revoke = process.argv.includes("--revoke");

  if (!email) {
    console.error("Usage: node --env-file=.env.local scripts/make-admin.mjs <email> [--revoke]");
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Did you forget --env-file=.env.local?"
    );
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey);

  // The Admin API doesn't expose "get user by email" directly, so we
  // page through listUsers() and find a match. Fine for the size of a
  // typical admin team; swap for a direct query if you have thousands
  // of users and need this often.
  let user = null;
  let page = 1;
  while (!user) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    user = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (user || data.users.length === 0) break;
    page += 1;
  }

  if (!user) {
    console.error(`No user found with email "${email}". They need to sign up first.`);
    process.exit(1);
  }

  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    app_metadata: { ...user.app_metadata, role: revoke ? undefined : "admin" },
  });

  if (updateError) throw updateError;

  console.log(
    revoke
      ? `✅ Revoked admin access for ${email}.`
      : `✅ ${email} is now an admin — they can access /admin after their next sign-in.`
  );
}

main().catch((err) => {
  console.error("Failed:", err.message ?? err);
  process.exit(1);
});
