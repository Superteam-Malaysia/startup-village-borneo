import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

/** POST: Sync past events (set is_upcoming = false for events whose date has passed). Admin only. */
export async function POST() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (user.app_metadata?.user_role as string) || "member";
  if (role !== "super_admin" && role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase.rpc("sync_past_events");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ updated: data ?? 0 });
}
