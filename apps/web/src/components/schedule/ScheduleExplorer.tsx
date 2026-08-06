"use client";

import { useState } from "react";
import { SCHEDULE_DAYS } from "@/data/schedule";
import { DayCalendar } from "./DayCalendar";

export type ScheduleExplorerProps = {
  initialDay?: number;
};

/** EL-16 / EL-39 — Day tabs with single-day calendar view. */
export function ScheduleExplorer({ initialDay = 1 }: ScheduleExplorerProps) {
  const [activeDay, setActiveDay] = useState(initialDay);
  const selected = SCHEDULE_DAYS.find((d) => d.index === activeDay) ?? SCHEDULE_DAYS[0];

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <nav
        className="flex gap-4 sm:gap-8 overflow-x-auto pb-2 -mx-1 px-1"
        aria-label="Schedule days"
      >
        {SCHEDULE_DAYS.map((day) => {
          const isActive = day.index === activeDay;
          return (
            <button
              key={day.index}
              type="button"
              onClick={() => setActiveDay(day.index)}
              className={[
                "schedule-day-tab shrink-0",
                isActive ? "" : "opacity-65",
              ].join(" ")}
              data-active={isActive}
              aria-current={isActive ? "true" : undefined}
            >
              <span className="block font-[family-name:var(--font-display)] text-base sm:text-lg normal-case tracking-normal">
                {day.label}
              </span>
              <span className="block mt-1 text-[0.65rem] opacity-70">{day.date}</span>
            </button>
          );
        })}
      </nav>

      <DayCalendar day={selected} />
    </div>
  );
}
