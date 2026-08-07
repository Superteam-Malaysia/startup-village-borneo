import type { ScheduleEvent } from "@/data/schedule";

const DEFAULT_CAL_START = 8;
const DEFAULT_CAL_END = 20;
/** Legible height for one 10-minute (shortest) slot — single-line label. */
const UNIT_BLOCK_REM = 4.5;
const EVENT_GAP_REM = 0.15;

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m ?? 0);
}

function shortestEventMinutes(events: ScheduleEvent[]): number {
  const durations = events
    .map((e) => timeToMinutes(e.end) - timeToMinutes(e.start))
    .filter((d) => d > 0);
  return durations.length > 0 ? Math.min(...durations) : 10;
}

/** Trim leading/trailing empty hours — show only the span that contains events. */
function calendarBounds(events: ScheduleEvent[]) {
  if (events.length === 0) {
    return { start: DEFAULT_CAL_START, end: DEFAULT_CAL_END };
  }

  let earliest = Infinity;
  let latest = 0;
  for (const event of events) {
    earliest = Math.min(earliest, timeToMinutes(event.start));
    latest = Math.max(latest, timeToMinutes(event.end));
  }

  const start = Math.floor(earliest / 60);
  const end = Math.ceil(latest / 60);
  return {
    start: Math.max(0, start),
    end: Math.min(24, Math.max(start + 1, end)),
  };
}

function colorClass(event: ScheduleEvent): string {
  if (event.isDeadline) return "schedule-event--deadline";
  switch (event.color) {
    case "azure":
      return "schedule-event--workshop";
    case "byte":
      return "schedule-event--social";
    default:
      return "";
  }
}

export function DayCalendar({ events }: { events: ScheduleEvent[] }) {
  const { start: calStart, end: calEnd } = calendarBounds(events);
  const hours = Array.from({ length: calEnd - calStart }, (_, i) => calStart + i);
  const minDurationMin = shortestEventMinutes(events);
  const hourHeight = (60 / minDurationMin) * UNIT_BLOCK_REM;

  return (
    <div
      className="schedule-calendar mt-8"
      style={{
        ["--cal-start" as string]: String(calStart),
        ["--cal-end" as string]: String(calEnd),
        ["--cal-hour-height" as string]: `${hourHeight}rem`,
        ["--cal-unit-minutes" as string]: String(minDurationMin),
      }}
    >
      {hours.map((hour) => (
        <div
          key={hour}
          className="schedule-hour-line"
          style={{ top: `${(hour - calStart) * hourHeight}rem` }}
        >
          <span>{String(hour).padStart(2, "0")}:00</span>
        </div>
      ))}

      {events.map((event) => {
        const startMin = timeToMinutes(event.start);
        const endMin = timeToMinutes(event.end);
        const durationMin = endMin - startMin;
        const topRem = (startMin / 60 - calStart) * hourHeight;
        const heightRem = (durationMin / 60) * hourHeight - EVENT_GAP_REM;
        const isCompact = durationMin <= 25;

        return (
          <div
            key={event.id}
            className={[
              "schedule-event",
              colorClass(event),
              isCompact ? "schedule-event--compact" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ top: `${topRem}rem`, height: `${heightRem}rem` }}
            title={`${event.start} – ${event.end} · ${event.title}`}
          >
            <div className="schedule-event__head">
              <p className="schedule-event__title">{event.title}</p>
              <p className="schedule-event__time">
                {isCompact ? event.start : `${event.start} – ${event.end}`}
              </p>
            </div>
            {!isCompact && event.speaker && (
              <p className="schedule-event__speaker">{event.speaker}</p>
            )}
            {!isCompact && event.description && (
              <p className="schedule-event__detail">{event.description}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
