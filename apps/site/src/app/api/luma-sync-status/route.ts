import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { fetchLumaICSEvents } from "@/lib/luma-ics";

/**
 * GET /api/luma-sync-status
 * Returns how many Luma events are not yet in Supabase.
 * Requires admin auth.
 */
export async function GET() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [lumaEvents, { data: supabaseEvents }] = await Promise.all([
      fetchLumaICSEvents(),
      supabase.from("events").select("luma_event_id").not("luma_event_id", "is", null),
    ]);

    const syncedIds = new Set(
      (supabaseEvents ?? []).map((e) => e.luma_event_id).filter(Boolean)
    );

    const lumaIds = lumaEvents
      .map((e) => e.luma_event_id)
      .filter((id): id is string => !!id);

    const unsyncedCount = lumaIds.filter((id) => !syncedIds.has(id)).length;

    return NextResponse.json({
      unsyncedCount,
      lumaTotal: lumaIds.length,
      supabaseTotal: syncedIds.size,
    });
  } catch (err) {
    console.error("Sync status failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to get sync status" },
      { status: 500 }
    );
  }
}
