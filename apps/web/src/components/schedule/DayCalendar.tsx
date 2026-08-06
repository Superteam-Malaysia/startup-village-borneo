import {
  CALENDAR_END_HOUR,
  CALENDAR_START_HOUR,
  type ScheduleDay,
  type ScheduleEvent,
  type ScheduleEventColor,
  eventPosition,
  formatTimeDisplay,
} from "@/data/schedule";

const HOUR_LABELS = Array.from(
  { length: CALENDAR_END_HOUR - CALENDAR_START_HOUR + 1 },
  (_, i) => CALENDAR_START_HOUR + i,
);

const COLOR_STYLES: Record<
  ScheduleEventColor,
  { bg: string; border: string; text: string; time: string }
> = {
  wisp: {
    bg: "bg-[color:var(--color-transparent-wisp-10)]",
    border: "border-[color:var(--color-transparent-wisp-10)]",
    text: "text-[var(--color-wisp)]",
    time: "text-[var(--color-wisp)]/70",
  },
  azure: {
    bg: "bg-[var(--color-azure)]/15",
    border: "border-[var(--color-azure)]/40",
    text: "text-[var(--color-azure)]",
    time: "text-[var(--color-azure)]/80",
  },
  byte: {
    bg: "bg-[var(--color-byte)]/15",
    border: "border-[var(--color-byte)]/50",
    text: "text-[var(--color-byte)]",
    time: "text-[var(--color-byte)]/80",
  },
};

function EventBlock({ event }: { event: ScheduleEvent }) {
  const { top, height } = eventPosition(event.start, event.end);
  const styles = COLOR_STYLES[event.color];
  const minHeight = height < 4 ? "min-h-[2.5rem]" : "";

  return (
    <div
      className={[
        "absolute left-0 right-0 px-2 sm:px-3 py-1.5 sm:py-2",
        "border rounded-sm overflow-hidden",
        "transition-colors duration-[var(--duration-normal)]",
        "hover:border-[var(--color-byte)]/60",
        styles.bg,
        styles.border,
        minHeight,
      ].join(" ")}
      style={{
        top: `${top}%`,
        height: `${height}%`,
      }}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <time
          className={[
            "font-[family-name:var(--font-mono)] text-[0.625rem] sm:text-xs tracking-wide uppercase shrink-0",
            styles.time,
          ].join(" ")}
        >
          {formatTimeDisplay(event.start)}–{formatTimeDisplay(event.end)}
        </time>
        <p
          className={[
            "font-[family-name:var(--font-sans)] text-xs sm:text-sm font-medium leading-snug truncate",
            styles.text,
          ].join(" ")}
        >
          {event.title}
        </p>
        {event.speaker && height >= 6 && (
          <p className="font-[family-name:var(--font-sans)] text-[0.6875rem] sm:text-xs text-[var(--color-wisp)]/60 truncate">
            {event.speaker}
          </p>
        )}
        {event.description && height >= 10 && (
          <p className="font-[family-name:var(--font-sans)] text-[0.6875rem] text-[var(--color-wisp)]/50 leading-snug line-clamp-2 hidden sm:block">
            {event.description}
          </p>
        )}
      </div>
    </div>
  );
}

export type DayCalendarProps = {
  day: ScheduleDay;
};

/** EL-17 — Single-day vertical calendar (08:00–19:00) with positioned event blocks. */
export function DayCalendar({ day }: DayCalendarProps) {
  const totalHours = CALENDAR_END_HOUR - CALENDAR_START_HOUR;

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-1 border-b border-[color:var(--color-transparent-wisp-10)] pb-4">
        <p className="text-eyebrow">{day.date}</p>
        <h3
          className="font-[family-name:var(--font-display)] text-xl sm:text-2xl tracking-wide text-[var(--color-wisp)]"
        >
          {day.title}
        </h3>
        {day.venueNote && (
          <p className="text-sm text-[var(--color-wisp)]/50 font-[family-name:var(--font-sans)]">
            {day.venueNote}
          </p>
        )}
      </header>

      <div className="flex gap-2 sm:gap-4">
        <div
          className="relative shrink-0 w-10 sm:w-14"
          style={{ height: `${totalHours * 3.5}rem` }}
          aria-hidden="true"
        >
          {HOUR_LABELS.map((hour) => {
            const offset = ((hour - CALENDAR_START_HOUR) / totalHours) * 100;
            return (
              <span
                key={hour}
                className="absolute left-0 font-[family-name:var(--font-mono)] text-[0.625rem] sm:text-xs text-[var(--color-wisp)]/40 -translate-y-1/2 tabular-nums"
                style={{ top: `${offset}%` }}
              >
                {String(hour).padStart(2, "0")}:00
              </span>
            );
          })}
        </div>

        <div
          className="relative flex-1 min-w-0 border-l border-[color:var(--color-transparent-wisp-10)]"
          style={{ height: `${totalHours * 3.5}rem` }}
        >
          {HOUR_LABELS.map((hour) => {
            const offset = ((hour - CALENDAR_START_HOUR) / totalHours) * 100;
            return (
              <div
                key={hour}
                className="absolute left-0 right-0 border-t border-[color:var(--color-transparent-wisp-10)]"
                style={{ top: `${offset}%` }}
              />
            );
          })}

          {day.events.map((event) => (
            <EventBlock key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}
