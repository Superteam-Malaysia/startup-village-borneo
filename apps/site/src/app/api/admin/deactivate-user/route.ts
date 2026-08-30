import { NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createServerClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const callerRole = user.app_metadata?.user_role;
  if (callerRole !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { userId } = body;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  if (userId === user.id) {
    return NextResponse.json({ error: "Cannot deactivate yourself" }, { status: 400 });
  }

  const admin = createAdminClient();

  // 1. Set profile.is_active = false
  const { error: profileErr } = await admin
    .from("profiles")
    .update({ is_active: false })
    .eq("id", userId);

  if (profileErr) {
    return NextResponse.json({ error: profileErr.message }, { status: 500 });
  }

  // 2. Ban user in Auth so they cannot log in (ban_duration: 100 years)
  const { data: authUser } = await admin.auth.admin.getUserById(userId);
  if (authUser?.user) {
    const existingMeta = (authUser.user.app_metadata || {}) as Record<string, unknown>;
    await admin.auth.admin.updateUserById(userId, {
      app_metadata: { ...existingMeta, deactivated: true },
      ban_duration: "876000h", // ~100 years
    });
  }

  return NextResponse.json({ success: true });
}
