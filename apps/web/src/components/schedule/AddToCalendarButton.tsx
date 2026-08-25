"use client";

import { useCallback, useState } from "react";
import {
  GOOGLE_CALENDAR_ADD_BY_URL,
  googleCalendarSubscribeUrl,
  scheduleIcsPublicUrl,
} from "@/lib/calendar/schedule-ics";

const FEED_URL = scheduleIcsPublicUrl();
const GOOGLE_SUBSCRIBE_URL = googleCalendarSubscribeUrl(FEED_URL);

/** Subscribe to the full SVB program in Google Calendar. */
export function AddToCalendarButton() {
  const [hint, setHint] = useState<string | null>(null);

  const handleAdd = useCallback(async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.open(GOOGLE_SUBSCRIBE_URL, "_blank", "noopener,noreferrer");

    let copied = false;
    try {
      await navigator.clipboard.writeText(FEED_URL);
      copied = true;
    } catch {
      copied = false;
    }

    setHint(
      copied
        ? "Opened Google Calendar. If it shows an error, paste the copied link in Settings → From URL."
        : "Opened Google Calendar. If it shows an error, use Settings → From URL and paste the program link.",
    );
  }, []);

  return (
    <div className="schedule-add-calendar">
      <a
        className="schedule-add-calendar__btn"
        href={GOOGLE_SUBSCRIBE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleAdd}
      >
        Add to Calendar
      </a>
      {hint ? (
        <p className="schedule-add-calendar__hint" role="status">
          {hint}{" "}
          <a href={GOOGLE_CALENDAR_ADD_BY_URL} target="_blank" rel="noopener noreferrer">
            Open calendar settings
          </a>
        </p>
      ) : null}
    </div>
  );
}
