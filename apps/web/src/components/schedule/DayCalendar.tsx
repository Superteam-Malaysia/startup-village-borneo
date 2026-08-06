import type { ScheduleEvent } from "@/data/schedule";

const CAL_START = 8;
const CAL_END = 20;
const HOUR_HEIGHT = 3.25;

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m ?? 0);
}

function colorClass(color: ScheduleEvent["color"]): string {
  switch (color) {
    case "azure":
      return "schedule-event--workshop";
    case "byte":
      return "schedule-event--social";
    default:
      return "";
  }
}

export function DayCalendar({ events }: { events: ScheduleEvent[] }) {
  const hours = Array.from({ length: CAL_END - CAL_START }, (_, i) => CAL_START + i);

  return (
    <div
      className="schedule-calendar mt-8"
      style={{
        ["--cal-hour-height" as string]: `${HOUR_HEIGHT}rem`,
      }}
    >
      {hours.map((hour) => (
        <div
          key={hour}
          className="schedule-hour-line"
          style={{ top: `${(hour - CAL_START) * HOUR_HEIGHT}rem` }}
        >
          <span className="absolute left-0 w-12">{String(hour).padStart(2, "0")}:00</span>
        </div>
      ))}

      {events.map((event) => {
        const startMin = timeToMinutes(event.start);
        const endMin = timeToMinutes(event.end);
        const topRem = (startMin / 60 - CAL_START) * HOUR_HEIGHT;
        const heightRem = Math.max(((endMin - startMin) / 60) * HOUR_HEIGHT, 1.5);

        return (
          <div
            key={event.id}
            className={`schedule-event ${colorClass(event.color)}`}
            style={{ top: `${topRem}rem`, height: `${heightRem}rem` }}
          >
            <p className="font-[family-name:var(--font-mono)] text-[0.65rem] uppercase tracking-wider text-[var(--color-byte)]">
              {event.start} – {event.end}
            </p>
            <p className="font-[family-name:var(--font-display)] text-sm md:text-base leading-snug mt-1">
              {event.title}
            </p>
            {event.speaker && (
              <p className="text-xs text-[var(--color-wisp)]/50 mt-1">{event.speaker}</p>
            )}
            {event.description && (
              <p className="text-xs text-[var(--color-wisp)]/60 mt-1 line-clamp-2">
                {event.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
