"use client";

import {
  googleCalendarSubscribeUrl,
  scheduleIcsPublicUrl,
} from "@/lib/calendar/schedule-ics";

const GOOGLE_CALENDAR_HREF = googleCalendarSubscribeUrl(scheduleIcsPublicUrl());

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
  return (
    <div className="schedule-add-calendar">
      <span className="schedule-add-calendar__ripple" aria-hidden />
      <span className="schedule-add-calendar__ripple schedule-add-calendar__ripple--2" aria-hidden />
      <a
        className="schedule-add-calendar__pill"
        href={GOOGLE_CALENDAR_HREF}
        target="_blank"
        rel="noopener noreferrer"
      >
        <CalendarCheckIcon />
        <span>Add to Calendar</span>
      </a>
    </div>
  );
}
