import type { Event } from "./types";

const LUMA_ICS_URL =
  "https://api2.luma.com/ics/get?entity=calendar&id=cal-sZfiZHfUS5piycU";

function parseICSDate(dateStr: string): Date {
  const cleaned = dateStr.trim();
  if (cleaned.length >= 15) {
    const year = cleaned.slice(0, 4);
    const month = cleaned.slice(4, 6);
    const day = cleaned.slice(6, 8);
    const hour = cleaned.slice(9, 11);
    const min = cleaned.slice(11, 13);
    const sec = cleaned.slice(13, 15);
    return new Date(`${year}-${month}-${day}T${hour}:${min}:${sec}Z`);
  }
  return new Date(cleaned);
}

function extractLumaUrl(description: string, uid: string): string {
  const descMatch = description.match(/https:\/\/luma\.com\/[a-zA-Z0-9-]+/);
  if (descMatch) return descMatch[0];
  const evtId = uid.replace(/@events\.lu\.ma$/, "");
  if (evtId.startsWith("evt-")) return `https://luma.com/event/${evtId}`;
  return "https://lu.ma/superteammy";
}

function unescapeICS(text: string): string {
  return text
    .replace(/\\n/g, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .trim();
}

function parseVEvent(block: string): Partial<Event> | null {
  const lines = block.split(/\r?\n/);
  const data: Record<string, string> = {};
  let currentKey = "";
  let currentValue = "";

  for (const line of lines) {
    if (line.startsWith(" ") || line.startsWith("\t")) {
      currentValue += line.trimStart();
      continue;
    }
    if (currentKey) {
      data[currentKey] = unescapeICS(currentValue);
    }
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      const keyPart = line.slice(0, colonIdx);
      const semicolonIdx = keyPart.indexOf(";");
      currentKey = semicolonIdx > 0 ? keyPart.slice(0, semicolonIdx) : keyPart;
      currentValue = line.slice(colonIdx + 1);
    }
  }
  if (currentKey) data[currentKey] = unescapeICS(currentValue);

  const summary = data.SUMMARY;
  const dtStart = data.DTSTART;
  if (!summary || !dtStart) return null;

  const startDate = parseICSDate(dtStart);
  const now = new Date();

  const uid = data.UID || "";
  const lumaEventId = uid.startsWith("evt-") ? uid.replace(/@events\.lu\.ma$/, "") : null;

  return {
    title: summary,
    description: (data.DESCRIPTION || "").slice(0, 200),
    date: startDate.toISOString(),
    end_date: data.DTEND ? parseICSDate(data.DTEND).toISOString() : undefined,
    location: (() => {
      const loc = data.LOCATION || "Check event page";
      return loc.startsWith("http") ? "Check event page" : loc;
    })(),
    luma_url: extractLumaUrl(data.DESCRIPTION || "", uid),
    luma_event_id: lumaEventId ?? undefined,
    image_url: "",
    is_upcoming: startDate > now,
  };
}

/**
 * Fetch and parse Superteam Malaysia events from Luma ICS feed
 */
export async function fetchLumaICSEvents(): Promise<Event[]> {
  try {
    const response = await fetch(LUMA_ICS_URL, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Luma ICS fetch failed: ${response.status}`);
    }

    const icsText = await response.text();
    const events: Event[] = [];
    const blocks = icsText.split(/BEGIN:VEVENT/).slice(1);

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i].split(/END:VEVENT/)[0];
      const parsed = parseVEvent("BEGIN:VEVENT" + block);
      if (parsed && parsed.title) {
        events.push({
          id: `luma-ics-${i}-${parsed.date}`,
          luma_event_id: parsed.luma_event_id ?? undefined,
          title: parsed.title,
          description: parsed.description || "",
          date: parsed.date!,
          end_date: parsed.end_date,
          location: parsed.location || "Check event page",
          luma_url: parsed.luma_url || "https://lu.ma/superteammy",
          image_url: parsed.image_url || "",
          is_upcoming: parsed.is_upcoming ?? false,
          created_at: new Date().toISOString(),
        });
      }
    }

    return events.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Failed to fetch Luma ICS events:", error);
    return [];
  }
}
