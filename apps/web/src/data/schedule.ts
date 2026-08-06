/**
 * Startup Village Borneo program schedule — Sept 5–9 2026.
 * Source: docs/blueprint/01-event-context.md (official program PDF).
 */

export type ScheduleEventColor = "wisp" | "azure" | "byte";

export type ScheduleEvent = {
  id: string;
  title: string;
  /** 24h time, e.g. "10:00" */
  start: string;
  end: string;
  speaker?: string;
  description?: string;
  color: ScheduleEventColor;
};

export type ScheduleDay = {
  index: number;
  label: string;
  date: string;
  /** Day theme — e.g. "Arrive & Explore Kuching" */
  title: string;
  /** Short line for cards — typically the calendar date */
  subtitle: string;
  venueNote?: string;
  events: ScheduleEvent[];
};

export const SCHEDULE_DAYS: ScheduleDay[] = [
  {
    index: 1,
    label: "Day 1",
    date: "Sat 5 Sept",
    title: "Arrive & Explore Kuching",
    subtitle: "Sat 5 Sept",
    events: [
      {
        id: "d1-explore",
        title: "Amazing Race · Explore Kuching",
        start: "08:00",
        end: "18:00",
        description: "Teams assigned before arrival. Race starts on landing.",
        color: "azure",
      },
      {
        id: "d1-return",
        title: "All teams back at Sheraton Kuching",
        start: "18:00",
        end: "18:30",
        color: "wisp",
      },
      {
        id: "d1-dinner",
        title: "Welcome dinner",
        start: "18:30",
        end: "20:00",
        description: "Race results, points standings, team formation begins.",
        color: "byte",
      },
    ],
  },
  {
    index: 2,
    label: "Day 2",
    date: "Sun 6 Sept",
    title: "Opening & Problem Framing",
    subtitle: "Sun 6 Sept",
    venueNote: "Workshops at Voco from Day 2",
    events: [
      {
        id: "d2-opening",
        title: "Opening",
        start: "10:00",
        end: "10:10",
        speaker: "Superteam MY",
        color: "wisp",
      },
      {
        id: "d2-socoe",
        title: "SOCOE",
        start: "10:10",
        end: "10:20",
        color: "wisp",
      },
      {
        id: "d2-solana-keynote",
        title: "Solana Foundation keynote",
        start: "10:20",
        end: "10:30",
        speaker: "Solana Foundation",
        color: "wisp",
      },
      {
        id: "d2-minister",
        title: "Minister address",
        start: "10:30",
        end: "11:15",
        color: "wisp",
      },
      {
        id: "d2-elfa",
        title: "Workshop · Finding real problems",
        start: "11:15",
        end: "11:45",
        speaker: "Elfa AI",
        description: "User research and market framing.",
        color: "azure",
      },
      {
        id: "d2-solana-new",
        title: "Workshop · solana.new",
        start: "11:45",
        end: "12:30",
        speaker: "Semi",
        description: "From idea to running code.",
        color: "azure",
      },
      {
        id: "d2-lunch",
        title: "Lunch + team formation",
        start: "12:30",
        end: "13:30",
        description: "Solo founders matched. Formation closes at lunch.",
        color: "wisp",
      },
      {
        id: "d2-virtuals",
        title: "Workshop · Virtuals",
        start: "13:30",
        end: "14:15",
        color: "azure",
      },
      {
        id: "d2-build",
        title: "Build session",
        start: "14:15",
        end: "15:30",
        color: "azure",
      },
      {
        id: "d2-mentorship",
        title: "Mentorship",
        start: "15:30",
        end: "16:30",
        color: "azure",
      },
      {
        id: "d2-roast-1",
        title: "Roast My Pitch · Round 1",
        start: "16:30",
        end: "17:00",
        description: "90 seconds, no slides.",
        color: "byte",
      },
    ],
  },
  {
    index: 3,
    label: "Day 3",
    date: "Mon 7 Sept",
    title: "Build & Traction",
    subtitle: "Mon 7 Sept",
    venueNote: "Workshops at Voco",
    events: [
      {
        id: "d3-magicblock",
        title: "MagicBlock",
        start: "10:00",
        end: "10:45",
        speaker: "MagicBlock",
        color: "wisp",
      },
      {
        id: "d3-solana-id",
        title: "Solana ID",
        start: "10:45",
        end: "11:30",
        speaker: "Solana ID / Solana Ecosystem Call",
        color: "wisp",
      },
      {
        id: "d3-monkedao",
        title: "MonkeDAO",
        start: "11:30",
        end: "12:30",
        speaker: "MonkeDAO / MonkeFoundry",
        color: "wisp",
      },
      {
        id: "d3-lunch",
        title: "Lunch",
        start: "12:30",
        end: "13:30",
        color: "wisp",
      },
      {
        id: "d3-office-hours",
        title: "Office hours · First 10 users",
        start: "13:30",
        end: "17:00",
        description: "Teams go out to get their first 10 users.",
        color: "azure",
      },
      {
        id: "d3-regroup",
        title: "Regroup · User learnings",
        start: "17:00",
        end: "17:30",
        description: "What did you learn from real users?",
        color: "byte",
      },
    ],
  },
  {
    index: 4,
    label: "Day 4",
    date: "Tue 8 Sept",
    title: "Storytelling & Pitch",
    subtitle: "Tue 8 Sept",
    venueNote: "Workshops at Voco",
    events: [
      {
        id: "d4-superscrypt",
        title: "Superscrypt",
        start: "10:00",
        end: "10:45",
        speaker: "Superscrypt",
        color: "wisp",
      },
      {
        id: "d4-impossible",
        title: "Impossible Finance / Rarible",
        start: "10:45",
        end: "11:30",
        color: "wisp",
      },
      {
        id: "d4-content",
        title: "Contentmaxxing",
        start: "11:30",
        end: "12:30",
        color: "wisp",
      },
      {
        id: "d4-lunch",
        title: "Lunch",
        start: "12:30",
        end: "13:30",
        color: "wisp",
      },
      {
        id: "d4-deck",
        title: "Deck clinic",
        start: "13:30",
        end: "15:00",
        color: "azure",
      },
      {
        id: "d4-roast-2",
        title: "Roast My Pitch · Round 2",
        start: "15:00",
        end: "16:30",
        description: "Full dry run.",
        color: "byte",
      },
      {
        id: "d4-cutoff",
        title: "HARD CUTOFF · Race & deck submission",
        start: "18:00",
        end: "18:15",
        description: "Nothing accepted after this time.",
        color: "byte",
      },
    ],
  },
  {
    index: 5,
    label: "Day 5",
    date: "Wed 9 Sept",
    title: "Demo Day",
    subtitle: "Wed 9 Sept",
    venueNote: "Sheraton Kuching",
    events: [
      {
        id: "d5-rehearsal",
        title: "Rehearsal",
        start: "09:15",
        end: "10:00",
        color: "azure",
      },
      {
        id: "d5-demo",
        title: "Public Demo Day",
        start: "10:00",
        end: "12:00",
        description: "Live pitches + Q&A.",
        color: "byte",
      },
      {
        id: "d5-judging",
        title: "Judging",
        start: "12:00",
        end: "12:30",
        description: "Judges: SOCOE, Solana Foundation, Superscrypt, + one more.",
        color: "wisp",
      },
      {
        id: "d5-prizes",
        title: "Prizes & wrap",
        start: "12:30",
        end: "13:00",
        color: "byte",
      },
    ],
  },
];

/** Calendar viewport — 08:00 through 19:00 */
export const CALENDAR_START_HOUR = 8;
export const CALENDAR_END_HOUR = 19;

export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function eventPosition(
  start: string,
  end: string,
  viewportStart = CALENDAR_START_HOUR,
  viewportEnd = CALENDAR_END_HOUR,
): { top: number; height: number } {
  const startMin = parseTimeToMinutes(start);
  const endMin = parseTimeToMinutes(end);
  const viewportStartMin = viewportStart * 60;
  const viewportEndMin = viewportEnd * 60;
  const total = viewportEndMin - viewportStartMin;
  const top = ((startMin - viewportStartMin) / total) * 100;
  const height = ((endMin - startMin) / total) * 100;
  return { top, height };
}

export function formatTimeDisplay(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour}${period}` : `${hour}:${String(m).padStart(2, "0")}${period}`;
}
