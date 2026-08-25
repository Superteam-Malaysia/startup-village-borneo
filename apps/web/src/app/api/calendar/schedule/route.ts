import { generateScheduleIcs, SCHEDULE_ICS_FILENAME } from "@/lib/calendar/schedule-ics";

export const dynamic = "force-static";

export function GET() {
  const body = generateScheduleIcs();

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${SCHEDULE_ICS_FILENAME}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
