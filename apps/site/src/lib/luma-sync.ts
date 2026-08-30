import { createAdminClient } from "@/lib/supabase/server";
import { fetchLumaICSEvents } from "./luma-ics";

/**
 * Sync events from Luma ICS feed to Supabase.
 * Only inserts new events. If luma_event_id already exists in DB, skip entirely.
 * Never updates existing events - admin edits are preserved.
 */
export async function syncLumaEventsToSupabase(): Promise<{ added: number; errors: string[] }> {
  const supabase = createAdminClient();
  const icsEvents = await fetchLumaICSEvents();
  const errors: string[] = [];
  let added = 0;

  for (const event of icsEvents) {
    const lumaEventId = event.luma_event_id || extractLumaEventId(event.luma_url, event.id);
    if (!lumaEventId) continue;

    const { data: existing } = await supabase
      .from("events")
      .select("id")
      .eq("luma_event_id", lumaEventId)
      .single();

    if (existing) continue;

    const payload = {
      luma_event_id: lumaEventId,
      title: event.title,
      description: event.description,
      date: event.date,
      end_date: event.end_date ?? null,
      location: event.location,
      luma_url: event.luma_url,
      is_upcoming: event.is_upcoming,
      image_url: "",
    };

    const { error } = await supabase.from("events").insert(payload);

    if (error) errors.push(`${event.title}: ${error.message}`);
    else added++;
  }

  return { added, errors };
}

function extractLumaEventId(lumaUrl: string, _fallbackId: string): string | null {
  const match = lumaUrl.match(/luma\.com\/event\/(evt-[a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}
