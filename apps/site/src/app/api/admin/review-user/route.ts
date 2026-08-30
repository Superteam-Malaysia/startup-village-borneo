import { NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";

/**
 * Approve or reject a pending registration. Super admin only.
 * Approving can also promote in one step, so "add someone directly as an admin"
 * doesn't need a second round-trip.
 */
export async function POST(request: Request) {
  const supabase = await createServerClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.app_metadata?.user_role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId, decision, role } = await request.json();

  if (!userId || !["approve", "reject"].includes(decision)) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }
  if (role && !["member", "admin", "super_admin"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }
  if (userId === user.id) {
    return NextResponse.json({ error: "Cannot review your own account" }, { status: 400 });
  }

  const admin = createAdminClient();
  const approved = decision === "approve";
  const newRole = approved ? (role ?? "member") : undefined;

  const { error: profileErr } = await admin
    .from("profiles")
    .update({
      approval_status: approved ? "approved" : "rejected",
      approved_at: approved ? new Date().toISOString() : null,
      approved_by: approved ? user.id : null,
      ...(newRole ? { user_role: newRole } : {}),
    })
    .eq("id", userId);

  if (profileErr) {
    return NextResponse.json({ error: profileErr.message }, { status: 500 });
  }

  // RLS reads the role from the JWT, so app_metadata has to match the profile row.
  if (newRole) {
    const { error: metaErr } = await admin.auth.admin.updateUserById(userId, {
      app_metadata: { user_role: newRole },
    });
    if (metaErr) {
      return NextResponse.json({ error: metaErr.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
