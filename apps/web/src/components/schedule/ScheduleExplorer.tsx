"use client";

import { useMemo, useState } from "react";
import { SCHEDULE_DAYS } from "@/data/schedule";
import { DayCalendar } from "./DayCalendar";
import { SectionArticle, SectionIntro } from "@/components/ui";

export function ScheduleExplorer({ initialDay = 1 }: { initialDay?: number }) {
  const [dayIndex, setDayIndex] = useState(initialDay);
  const day = useMemo(
    () => SCHEDULE_DAYS.find((d) => d.index === dayIndex) ?? SCHEDULE_DAYS[0],
    [dayIndex],
  );

  return (
    <SectionArticle>
      <SectionIntro eyebrow="Calendar" title={day.title} />
      <p className="mt-4 text-sm text-[var(--color-wisp)]/60 font-[family-name:var(--font-mono)] uppercase tracking-widest">
        {day.subtitle}
        {day.venueNote ? ` · ${day.venueNote}` : ""}
      </p>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
        {SCHEDULE_DAYS.map((d) => (
          <button
            key={d.index}
            type="button"
            className="schedule-day-tab"
            data-active={d.index === dayIndex}
            onClick={() => setDayIndex(d.index)}
          >
            {d.label}
          </button>
        ))}
      </div>

      <DayCalendar events={day.events} />
    </SectionArticle>
  );
}
