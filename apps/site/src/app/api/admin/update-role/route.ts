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
  const { userId, newRole } = body;

  if (!userId || !["member", "admin", "super_admin"].includes(newRole)) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { error: authUpdateErr } = await admin.auth.admin.updateUserById(userId, {
    app_metadata: { user_role: newRole },
  });

  if (authUpdateErr) {
    return NextResponse.json({ error: authUpdateErr.message }, { status: 500 });
  }

  const { error: profileErr } = await admin
    .from("profiles")
    .update({ user_role: newRole })
    .eq("id", userId);

  if (profileErr) {
    return NextResponse.json({ error: profileErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
