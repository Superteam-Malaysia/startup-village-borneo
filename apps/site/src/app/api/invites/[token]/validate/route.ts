import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const admin = createAdminClient();

  const { data: invite, error } = await admin
    .from("invites")
    .select("*")
    .eq("token", token)
    .single();

  if (error || !invite) {
    return NextResponse.json({ valid: false, reason: "Invalid invite link" }, { status: 404 });
  }

  if (invite.is_used) {
    return NextResponse.json({ valid: false, reason: "This invite has already been used" }, { status: 410 });
  }

  if (new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, reason: "This invite has expired" }, { status: 410 });
  }

  return NextResponse.json({
    valid: true,
    email: invite.email,
    invited_role: invite.invited_role,
  });
}
