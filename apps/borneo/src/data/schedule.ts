/**
 * Startup Village Borneo program schedule — Sept 5–9 2026.
 * Source: official agenda Google Doc (1TzDzEcqziytHEnogOBAXrXvEP5TJi1lkklY-Ed01QWI).
 */

import { withBasePath } from "@/lib/base-path";

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
  isDeadline?: boolean;
};

export type ScheduleDay = {
  index: number;
  label: string;
  date: string;
  /** Day theme — e.g. "Arrive & Explore Kuching" */
  title: string;
  /** Short line for cards — typically the calendar date */
  subtitle: string;
  /** Homepage card image — from Superteam MY announce post */
  cardImage?: string;
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
    cardImage: withBasePath("/schedule/days/day-1.jpg"),
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
        title: "Welcome dinner · Rooftop Bar",
        start: "18:30",
        end: "20:00",
        description: "Sheraton Rooftop Bar with RedotsClub. Race standings and team formation begins.",
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
    cardImage: withBasePath("/schedule/days/day-2.jpg"),
    venueNote: "Breakfast at Sheraton, then bus to Voco",
    events: [
      {
        id: "d2-bus",
        title: "Bus to Voco",
        start: "09:30",
        end: "10:00",
        color: "wisp",
      },
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
        speaker: "Edvin, Director",
        color: "wisp",
      },
      {
        id: "d2-solana-keynote",
        title: "Solana Foundation keynote",
        start: "10:20",
        end: "10:30",
        speaker: "Chaerin",
        color: "wisp",
      },
      {
        id: "d2-minister",
        title: "Minister address + launch",
        start: "10:30",
        end: "10:45",
        description: "If confirmed.",
        color: "wisp",
      },
      {
        id: "d2-break",
        title: "Break",
        start: "10:45",
        end: "11:15",
        color: "wisp",
      },
      {
        id: "d2-elfa",
        title: "Workshop · Finding real problems",
        start: "11:15",
        end: "11:45",
        speaker: "Tristan · Elfa AI",
        description: "User research and market framing.",
        color: "azure",
      },
      {
        id: "d2-meteora",
        title: "Workshop · Meteora Ecosystem",
        start: "11:45",
        end: "12:30",
        speaker: "Vesper · Meteora",
        color: "azure",
      },
      {
        id: "d2-lunch",
        title: "Lunch + team formation",
        start: "12:30",
        end: "13:30",
        description: "Solo founders welcome — we help match anyone who wants a team.",
        color: "wisp",
      },
      {
        id: "d2-superscrypt",
        title: "Workshop · Superscrypt",
        start: "13:30",
        end: "14:15",
        speaker: "Jacob · Superscrypt",
        description: "What investors look for, and what kills a pitch in 30 seconds.",
        color: "azure",
      },
      {
        id: "d2-build",
        title: "Build + mentorship",
        start: "14:15",
        end: "16:00",
        description: "Define your problem and your first user. Office hours run alongside.",
        color: "azure",
      },
      {
        id: "d2-roast-1",
        title: "Roast My Pitch · Round 1",
        start: "16:00",
        end: "17:00",
        description: "90 seconds, problem and solution only. One slide.",
        color: "byte",
      },
      {
        id: "d2-bus-back",
        title: "Bus back to Sheraton",
        start: "17:00",
        end: "17:30",
        color: "wisp",
      },
      {
        id: "d2-dinner",
        title: "Buffet dinner at Sheraton",
        start: "18:00",
        end: "19:30",
        description: "Building continues after dinner.",
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
    cardImage: withBasePath("/schedule/days/day-3.jpg"),
    venueNote: "Breakfast at Sheraton, then bus to Voco",
    events: [
      {
        id: "d3-bus",
        title: "Bus to Voco",
        start: "09:30",
        end: "10:00",
        color: "wisp",
      },
      {
        id: "d3-monkedao",
        title: "Workshop · MonkeDAO",
        start: "10:00",
        end: "10:45",
        speaker: "Jemmy · MonkeDAO",
        color: "azure",
      },
      {
        id: "d3-sanctum",
        title: "Workshop · Sanctum",
        start: "10:45",
        end: "11:15",
        speaker: "Nic · Sanctum",
        color: "azure",
      },
      {
        id: "d3-getblock",
        title: "Workshop · GetBlock",
        start: "11:15",
        end: "11:45",
        speaker: "Vasily · GetBlock",
        color: "azure",
      },
      {
        id: "d3-sf-rwa",
        title: "Workshop · RWA & Insti",
        start: "11:45",
        end: "12:15",
        speaker: "Seraphim · Solana Foundation",
        color: "azure",
      },
      {
        id: "d3-lunch",
        title: "Lunch",
        start: "12:15",
        end: "13:30",
        color: "wisp",
      },
      {
        id: "d3-kyzzen",
        title: "Workshop · Kyzzen",
        start: "13:30",
        end: "14:00",
        speaker: "OhMeOhMy · Kyzzen",
        color: "azure",
      },
      {
        id: "d3-elfa-sales",
        title: "Workshop · Using AI for sales process",
        start: "14:00",
        end: "14:30",
        speaker: "Ming Yang · Elfa AI",
        color: "azure",
      },
      {
        id: "d3-office-hours",
        title: "Office hours · First 10 users",
        start: "14:30",
        end: "16:30",
        description: "Teams go out to get their first 10 users / feedback.",
        color: "azure",
      },
      {
        id: "d3-regroup",
        title: "Regroup · User learnings",
        start: "16:30",
        end: "17:00",
        description: "What did you learn from real users?",
        color: "byte",
      },
      {
        id: "d3-bus-back",
        title: "Bus back to Sheraton",
        start: "17:00",
        end: "17:30",
        description: "Free-and-easy evening. Roam Kuching for dinner. Building continues after.",
        color: "wisp",
      },
      {
        id: "d3-monke-meetup",
        title: "Monke Meetup · KANTIN at Granary",
        start: "18:30",
        end: "20:00",
        speaker: "MonkeDAO",
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
    cardImage: withBasePath("/schedule/days/day-4.jpg"),
    venueNote: "Breakfast at Sheraton, then bus to Voco",
    events: [
      {
        id: "d4-bus",
        title: "Bus to Voco",
        start: "09:30",
        end: "10:00",
        color: "wisp",
      },
      {
        id: "d4-impossible",
        title: "Workshop · Impossible Finance / Rarible",
        start: "10:00",
        end: "10:45",
        speaker: "Shuen Rui",
        description: "Go-to-market and distribution.",
        color: "azure",
      },
      {
        id: "d4-nolimit",
        title: "Workshop · No Limit Holdings",
        start: "10:45",
        end: "11:30",
        speaker: "Chris · No Limit Holdings",
        color: "azure",
      },
      {
        id: "d4-virtuals",
        title: "Workshop · Virtuals",
        start: "11:30",
        end: "12:15",
        speaker: "Joey · Virtuals",
        description:
          "Building the Agent Economy with AI Agents and Autonomous Payments via EconomyOS.",
        color: "azure",
      },
      {
        id: "d4-content",
        title: "Workshop · Contentmaxxing",
        start: "12:15",
        end: "12:45",
        speaker: "Nikki",
        color: "azure",
      },
      {
        id: "d4-lunch",
        title: "Lunch",
        start: "12:45",
        end: "13:30",
        color: "wisp",
      },
      {
        id: "d4-deck",
        title: "Deck clinic",
        start: "13:30",
        end: "15:00",
        description: "The one-liner, the story arc, the demo.",
        color: "azure",
      },
      {
        id: "d4-roast-2",
        title: "Roast My Pitch · Round 2",
        start: "15:00",
        end: "17:30",
        description: "Full dry run with mentors.",
        color: "byte",
      },
      {
        id: "d4-wrap",
        title: "Wrap",
        start: "17:30",
        end: "18:00",
        color: "wisp",
      },
      {
        id: "d4-cutoff",
        title: "HARD CUTOFF · Amazing Race & deck submission",
        start: "18:00",
        end: "18:30",
        description: "Nothing accepted after 18:00. Dinner at Fable follows.",
        color: "byte",
        isDeadline: true,
      },
      {
        id: "d4-dinner",
        title: "Dinner at Fable",
        start: "18:30",
        end: "21:00",
        color: "byte",
      },
      {
        id: "d4-bus-back",
        title: "Bus back to Sheraton",
        start: "21:00",
        end: "21:30",
        color: "wisp",
      },
    ],
  },
  {
    index: 5,
    label: "Day 5",
    date: "Wed 9 Sept",
    title: "Demo Day",
    subtitle: "Wed 9 Sept",
    cardImage: withBasePath("/schedule/days/day-5-demo-day.jpg"), // Superteam MY Demo Day — x.com/SuperteamMY/status/2082366956288758235
    venueNote: "Check out of Sheraton, then bus to Voco",
    events: [
      {
        id: "d5-bus",
        title: "Bus to Voco",
        start: "09:30",
        end: "10:00",
        color: "wisp",
      },
      {
        id: "d5-tech",
        title: "Tech check",
        start: "10:00",
        end: "10:15",
        color: "azure",
      },
      {
        id: "d5-opening",
        title: "Opening address",
        start: "10:15",
        end: "10:30",
        color: "wisp",
      },
      {
        id: "d5-demo",
        title: "Public Demo Day",
        start: "10:30",
        end: "12:30",
        description: "Live pitches + Q&A.",
        color: "byte",
      },
      {
        id: "d5-judging",
        title: "Judging deliberation",
        start: "12:30",
        end: "12:45",
        description: "Judges: SOCOE (Sam), Solana Foundation (Chaerin, Seraphim), No Limit Holdings (Anatoly), + one more.",
        color: "wisp",
      },
      {
        id: "d5-prizes",
        title: "Prizes, group photo, closing",
        start: "12:45",
        end: "13:00",
        description: "Amazing Race, Demo Day, and Meteora challenge winners announced.",
        color: "byte",
      },
      {
        id: "d5-lunch",
        title: "Lunch",
        start: "13:00",
        end: "15:00",
        color: "wisp",
      },
      {
        id: "d5-bus-back",
        title: "Bus back to Sheraton",
        start: "15:00",
        end: "15:30",
        color: "wisp",
      },
    ],
  },
];

/** Calendar viewport fallback — 08:00 through 21:00 */
export const CALENDAR_START_HOUR = 8;
export const CALENDAR_END_HOUR = 21;

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
