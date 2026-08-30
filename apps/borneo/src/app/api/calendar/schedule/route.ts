import {
  generateScheduleIcs,
  SCHEDULE_ICS_FILENAME,
  SCHEDULE_ICS_PUBLIC_PATH,
} from "@/lib/calendar/schedule-ics";
import { withBasePath } from "@/lib/base-path";

export const dynamic = "force-static";

/** Back-compat alias — canonical feed is the static file at SCHEDULE_ICS_PUBLIC_PATH. */
export function GET() {
  const body = generateScheduleIcs();

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      Link: `<${withBasePath(SCHEDULE_ICS_PUBLIC_PATH)}>; rel="alternate"`,
    },
  });
}
