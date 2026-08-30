import { randomBytes } from "node:crypto";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: [".env.local", ".env"] });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  console.error("Set them in .env.local or .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Supabase requires 6+ chars; this gives a strong one when the caller doesn't supply a password.
function generatePassword() {
  return randomBytes(18).toString("base64url");
}

async function findUserByEmail(email: string) {
  // listUsers is paginated (50/page by default) — walk until we find them or run out.
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) {
      console.error("Failed to list users:", error.message);
      process.exit(1);
    }
    const match = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (match) return match;
    if (data.users.length < 1000) return null;
  }
}

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: npm run bootstrap:admin -- <email> [password]");
    console.error("Creates the auth user if it doesn't exist, then promotes it to super_admin.");
    process.exit(1);
  }

  const existing = await findUserByEmail(email);
  let userId: string;
  let createdPassword: string | null = null;

  if (existing) {
    userId = existing.id;
    console.log(`Found existing auth user ${email} (${userId})`);

    // A password given on an existing account is treated as a reset.
    const password = process.argv[3];
    if (password) {
      const { error } = await supabase.auth.admin.updateUserById(userId, { password });
      if (error) {
        console.error("Failed to reset password:", error.message);
        process.exit(1);
      }
      console.log("Password reset.");
    }
  } else {
    createdPassword = process.argv[3] || generatePassword();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: createdPassword,
      email_confirm: true, // skip the confirmation email so the account is usable immediately
    });
    if (error) {
      console.error("Failed to create user:", error.message);
      process.exit(1);
    }
    userId = data.user.id;
    console.log(`Created auth user ${email} (${userId})`);
  }

  // RLS reads the role from the JWT (get_user_role()), so app_metadata is the source of truth.
  const { error: updateErr } = await supabase.auth.admin.updateUserById(userId, {
    app_metadata: { user_role: "super_admin" },
  });
  if (updateErr) {
    console.error("Failed to set app_metadata:", updateErr.message);
    process.exit(1);
  }
  console.log("Set app_metadata.user_role = super_admin");

  // The dashboard layout reads profiles.user_role and onboarding_completed.
  const { error: profileErr } = await supabase.from("profiles").upsert(
    {
      id: userId,
      user_role: "super_admin",
      nickname: "Super Admin",
      onboarding_completed: true,
    },
    { onConflict: "id" }
  );
  if (profileErr) {
    console.error("Failed to create profile:", profileErr.message);
    process.exit(1);
  }
  console.log("Profile row created/updated.");

  console.log("\nDone. Sign in at /dashboard with:");
  console.log(`  email:    ${email}`);
  if (createdPassword) {
    console.log(`  password: ${createdPassword}`);
    console.log("\nSave this now — it is not stored anywhere and won't be shown again.");
  } else {
    console.log("  password: (unchanged / the one you supplied)");
  }
}

main();
