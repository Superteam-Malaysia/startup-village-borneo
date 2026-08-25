"use client";

import { useCallback, useState } from "react";
import {
  GOOGLE_CALENDAR_ADD_BY_URL,
  googleCalendarSubscribeUrl,
  scheduleIcsPublicUrl,
} from "@/lib/calendar/schedule-ics";

const FEED_URL = scheduleIcsPublicUrl();
const GOOGLE_SUBSCRIBE_URL = googleCalendarSubscribeUrl(FEED_URL);

function CalendarCheckIcon() {
  return (
    <svg
      className="schedule-add-calendar__icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 9h16" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3v3M16 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M9.5 14.5l1.75 1.75L15 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
      <span className="schedule-add-calendar__ripple" aria-hidden />
      <span className="schedule-add-calendar__ripple schedule-add-calendar__ripple--2" aria-hidden />
      <a
        className="schedule-add-calendar__pill"
        href={GOOGLE_SUBSCRIBE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleAdd}
      >
        <CalendarCheckIcon />
        <span>Add to Calendar</span>
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
