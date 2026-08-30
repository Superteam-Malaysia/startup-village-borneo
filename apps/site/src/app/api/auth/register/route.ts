import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Public self-registration.
 *
 * Creates the auth user server-side rather than via client signUp() so the role and
 * approval state are set atomically with the account and never come from the browser.
 * The account is created pending; a super admin approves it in /dashboard/members.
 */
export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }
  if (!password || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // no SMTP configured; approval is the real gate
    app_metadata: { user_role: "member" },
  });

  if (createErr) {
    // Don't confirm whether an address is already registered.
    if (/already|exists|registered/i.test(createErr.message)) {
      return NextResponse.json(
        { error: "That email can't be registered. Try signing in or resetting your password." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: createErr.message }, { status: 400 });
  }

  const { error: profileErr } = await admin.from("profiles").insert({
    id: created.user.id,
    user_role: "member",
    approval_status: "pending",
    onboarding_completed: false,
  });

  if (profileErr) {
    // Roll the auth user back so a retry isn't blocked by a half-created account.
    await admin.auth.admin.deleteUser(created.user.id);
    return NextResponse.json({ error: "Could not complete registration" }, { status: 500 });
  }

  return NextResponse.json({ success: true, status: "pending" });
}
