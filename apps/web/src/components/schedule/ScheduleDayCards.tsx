import Image from "next/image";
import Link from "next/link";
import type { ScheduleDay } from "@/data/schedule";

function formatCardDate(date: string): string {
  return `${date.toUpperCase()}, 2026`;
}

function dayTimeRange(day: ScheduleDay): string {
  if (!day.events.length) return "—";
  const start = day.events[0]?.start ?? "—";
  const end = day.events[day.events.length - 1]?.end ?? "—";
  return `${start}–${end}`;
}

/** Breakpoint-style horizontal day cards — extracted from solana.com/breakpoint event cards. */
export function ScheduleDayCards({ days }: { days: ScheduleDay[] }) {
  return (
    <ul className="schedule-day-cards" role="list" aria-label="Five days of build, race, and demos">
      {days.map((day) => (
        <li key={day.index} className="schedule-day-cards__item" data-event-card="true">
          <Link href={`/schedule?day=${day.index}`} className="schedule-day-cards__link">
            <span className="schedule-day-cards__media">
              {day.cardImage ? (
                <Image
                  src={day.cardImage}
                  alt=""
                  fill
                  className="schedule-day-cards__image"
                  sizes="(min-width: 768px) 33vw, 280px"
                />
              ) : null}
            </span>
            <span className="schedule-day-cards__body">
              <span className="schedule-day-cards__title">
                {day.label} — {day.title}
              </span>
              <span className="schedule-day-cards__meta">
                <span>{formatCardDate(day.date)}</span>
                <span aria-hidden="true">/</span>
                <span>{dayTimeRange(day)}</span>
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
