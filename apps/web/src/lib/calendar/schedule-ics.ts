import { SITE } from "@/data/site";
import type { ScheduleDay, ScheduleEvent } from "@/data/schedule";
import { SCHEDULE_DAYS } from "@/data/schedule";
import { SITE_URL } from "@/lib/metadata";

/** ISO calendar dates for SVB 2026 (matches schedule day labels). */
const DAY_ISO_DATES: Record<number, string> = {
  1: "2026-09-05",
  2: "2026-09-06",
  3: "2026-09-07",
  4: "2026-09-08",
  5: "2026-09-09",
};

const TIMEZONE = "Asia/Kuching";

function normalizeIcsText(value: string): string {
  return value
    .replace(/\u2014/g, "-")
    .replace(/\u2013/g, "-")
    .replace(/\u00b7/g, " - ")
    .replace(/\u2194/g, "<->");
}

function escapeIcs(value: string): string {
  return normalizeIcsText(value)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function foldLine(line: string): string {
  const max = 73;
  if (line.length <= max) return line;
  const parts: string[] = [line.slice(0, max)];
  let rest = line.slice(max);
  while (rest.length > 0) {
    parts.push(` ${rest.slice(0, max - 1)}`);
    rest = rest.slice(max - 1);
  }
  return parts.join("\r\n");
}

function toIcsDateTime(isoDate: string, time: string): string {
  const [hour, minute] = time.split(":").map(Number);
  return `${isoDate.replace(/-/g, "")}T${String(hour).padStart(2, "0")}${String(minute).padStart(2, "0")}00`;
}

function eventLocation(dayIndex: number, event: ScheduleEvent): string {
  const title = event.title.toLowerCase();
  if (title.includes("fable")) return "Fable, Kuching, Sarawak";
  if (title.includes("granary") || title.includes("kantin")) {
    return "KANTIN at Granary, Kuching, Sarawak";
  }
  if (title.includes("sheraton") || title.includes("rooftop")) {
    return "Sheraton Kuching, Jalan Tunku Abdul Rahman, 93100 Kuching, Sarawak";
  }
  if (title.includes("bus")) {
    return "Sheraton Kuching <-> Voco Kuching, Sarawak";
  }
  if (dayIndex === 1) return "Kuching, Sarawak";
  return "Voco Kuching, Jalan Lapangan Terbang Baru, 93350 Kuching, Sarawak";
}

function eventSummary(day: ScheduleDay, event: ScheduleEvent): string {
  return event.speaker ? `${event.title} — ${event.speaker}` : event.title;
}

function eventDescription(day: ScheduleDay, event: ScheduleEvent): string {
  const lines = [
    `${day.label} · ${day.title}`,
    day.venueNote ?? "",
    event.description ?? "",
    SITE.name,
  ].filter(Boolean);
  return lines.join("\n");
}

function buildVevent(day: ScheduleDay, event: ScheduleEvent, stamp: string): string {
  const isoDate = DAY_ISO_DATES[day.index];
  if (!isoDate) return "";

  const uid = `svb-2026-${event.id}@superteam.my`;
  const summary = escapeIcs(eventSummary(day, event));
  const description = escapeIcs(eventDescription(day, event));
  const location = escapeIcs(eventLocation(day.index, event));
  const start = toIcsDateTime(isoDate, event.start);
  const end = toIcsDateTime(isoDate, event.end);

  return [
    "BEGIN:VEVENT",
    foldLine(`UID:${uid}`),
    foldLine(`DTSTAMP:${stamp}`),
    foldLine(`DTSTART;TZID=${TIMEZONE}:${start}`),
    foldLine(`DTEND;TZID=${TIMEZONE}:${end}`),
    foldLine(`SUMMARY:${summary}`),
    foldLine(`DESCRIPTION:${description}`),
    foldLine(`LOCATION:${location}`),
    "END:VEVENT",
  ].join("\r\n");
}

const VTIMEZONE = [
  "BEGIN:VTIMEZONE",
  `TZID:${TIMEZONE}`,
  "BEGIN:STANDARD",
  "TZOFFSETFROM:+0800",
  "TZOFFSETTO:+0800",
  "TZNAME:+08",
  "DTSTART:19700101T000000",
  "END:STANDARD",
  "END:VTIMEZONE",
].join("\r\n");

/** Build a full iCalendar document for the SVB program schedule. */
export function generateScheduleIcs(days: ScheduleDay[] = SCHEDULE_DAYS): string {
  const stamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");

  const events = days.flatMap((day) =>
    day.events.map((event) => buildVevent(day, event, stamp)).filter(Boolean),
  );

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Superteam MY//Startup Village Borneo//EN",
    "CALSCALE:GREGORIAN",
    foldLine(`X-WR-CALNAME:${escapeIcs(SITE.name)} 2026`),
    foldLine(`X-WR-CALDESC:${escapeIcs(`${SITE.name} program - ${SITE.dates}`)}`),
    "X-WR-TIMEZONE:Asia/Kuching",
    "REFRESH-INTERVAL;VALUE=DURATION:PT24H",
    "X-PUBLISHED-TTL:PT24H",
    VTIMEZONE,
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
}

/** Canonical public HTTPS URL for the static schedule feed. */
export function scheduleIcsPublicUrl(): string {
  const base = SITE_URL.replace(/\/$/, "");
  return `${base}${SCHEDULE_ICS_PUBLIC_PATH}`;
}

export const GOOGLE_CALENDAR_ADD_BY_URL =
  "https://calendar.google.com/calendar/u/0/r/settings/addbyurl";

/** Google Calendar subscribes to a public iCal feed via `cid` (webcal URL). */
export function googleCalendarSubscribeUrl(icsFeedUrl: string): string {
  const webcal = icsFeedUrl.replace(/^https?:\/\//i, "webcal://");
  // Documented format: encoded webcal on google.com/calendar/render (not calendar.google.com/r).
  return `https://www.google.com/calendar/render?cid=${encodeURIComponent(webcal)}`;
}

export const SCHEDULE_ICS_FILENAME = "startup-village-borneo-2026.ics";

/** Public path (under basePath) for the static iCal file generated at build time. */
export const SCHEDULE_ICS_PUBLIC_PATH = `/${SCHEDULE_ICS_FILENAME}`;
