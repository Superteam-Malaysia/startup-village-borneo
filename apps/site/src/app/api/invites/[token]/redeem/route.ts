import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const admin = createAdminClient();

  const { data: invite, error: fetchErr } = await admin
    .from("invites")
    .select("*")
    .eq("token", token)
    .single();

  if (fetchErr || !invite) {
    return NextResponse.json({ error: "Invalid invite link" }, { status: 404 });
  }

  if (invite.is_used) {
    return NextResponse.json({ error: "This invite has already been used" }, { status: 410 });
  }

  if (new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ error: "This invite has expired" }, { status: 410 });
  }

  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  if (invite.email && invite.email.toLowerCase() !== email.toLowerCase()) {
    return NextResponse.json({ error: "This invite is for a different email address" }, { status: 400 });
  }

  const { data: newUser, error: signupErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { user_role: invite.invited_role },
  });

  if (signupErr) {
    return NextResponse.json({ error: signupErr.message }, { status: 400 });
  }

  // An invite is itself the approval, so skip the pending queue.
  const { error: profileErr } = await admin.from("profiles").insert({
    id: newUser.user.id,
    user_role: invite.invited_role,
    approval_status: "approved",
    approved_at: new Date().toISOString(),
    approved_by: invite.created_by ?? null,
    onboarding_completed: false,
  });

  if (profileErr) {
    console.error("Failed to create profile:", profileErr.message);
  }

  const { error: markErr } = await admin
    .from("invites")
    .update({
      is_used: true,
      used_by: newUser.user.id,
      used_at: new Date().toISOString(),
    })
    .eq("id", invite.id);

  if (markErr) {
    console.error("Failed to mark invite as used:", markErr.message);
  }

  return NextResponse.json({
    success: true,
    user_id: newUser.user.id,
    email: newUser.user.email,
  });
}
