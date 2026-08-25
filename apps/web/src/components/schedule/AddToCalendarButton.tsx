"use client";

import { useCallback, useEffect, useState } from "react";
import { CtaButton } from "@/components/ui";
import { withBasePath } from "@/lib/base-path";
import {
  googleCalendarSubscribeUrl,
  SCHEDULE_ICS_FILENAME,
  SCHEDULE_ICS_PUBLIC_PATH,
} from "@/lib/calendar/schedule-ics";

function publicIcsUrl(): string {
  return `${window.location.origin}${withBasePath(SCHEDULE_ICS_PUBLIC_PATH)}`;
}

/** Add the full SVB program to Google Calendar or download an .ics file. */
export function AddToCalendarButton() {
  const [googleHref, setGoogleHref] = useState<string | null>(null);

  useEffect(() => {
    setGoogleHref(googleCalendarSubscribeUrl(publicIcsUrl()));
  }, []);

  const downloadIcs = useCallback(() => {
    const link = document.createElement("a");
    link.href = publicIcsUrl();
    link.download = SCHEDULE_ICS_FILENAME;
    link.click();
  }, []);

  return (
    <div className="schedule-calendar-actions">
      <p className="schedule-calendar-actions__lead text-sm text-[var(--color-wisp)]/60">
        Add all five days of sessions, workshops, and key moments to your calendar.
      </p>
      <div className="schedule-calendar-actions__buttons">
        <CtaButton
          href={googleHref ?? undefined}
          external
          variant="azure"
          size="md"
          showArrow={false}
          disabled={!googleHref}
        >
          Add to Google Calendar
        </CtaButton>
        <CtaButton
          variant="ghost-wisp"
          size="md"
          showArrow={false}
          onClick={downloadIcs}
        >
          Download .ics
        </CtaButton>
      </div>
    </div>
  );
}
