"use client";

import { useEffect, useState } from "react";
import { withBasePath } from "@/lib/base-path";
import {
  googleCalendarSubscribeUrl,
  SCHEDULE_ICS_PUBLIC_PATH,
} from "@/lib/calendar/schedule-ics";

function publicIcsUrl(): string {
  return `${window.location.origin}${withBasePath(SCHEDULE_ICS_PUBLIC_PATH)}`;
}

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
  const [googleHref, setGoogleHref] = useState<string | null>(null);

  useEffect(() => {
    setGoogleHref(googleCalendarSubscribeUrl(publicIcsUrl()));
  }, []);

  return (
    <div className="schedule-add-calendar">
      <span className="schedule-add-calendar__ripple" aria-hidden />
      <span className="schedule-add-calendar__ripple schedule-add-calendar__ripple--2" aria-hidden />
      <a
        className="schedule-add-calendar__pill"
        href={googleHref ?? undefined}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={!googleHref}
        tabIndex={googleHref ? undefined : -1}
      >
        <CalendarCheckIcon />
        <span>Add to Calendar</span>
      </a>
    </div>
  );
}
