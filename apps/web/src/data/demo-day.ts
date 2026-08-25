export { DEMO_DAY_JUDGES } from "@/data/judges";

export const DEMO_DAY = {
  date: "Wed 9 Sept 2026",
  venue: "Voco Kuching",
  morningNote:
    "Breakfast at Sheraton, check out, then the 09:30 bus to Voco for tech check and Demo Day.",
  summary:
    "Five days of building culminate in live pitches, Q&A, and prize announcements — the public capstone of Startup Village Borneo.",
};

export const DEMO_DAY_SCHEDULE = [
  {
    time: "09:30",
    title: "Bus to Voco",
    detail: "Check out of Sheraton first. Bags with concierge or on the coach.",
  },
  {
    time: "10:00",
    title: "Tech check",
    detail: "Sound check, slide order, and timing with organizers.",
  },
  {
    time: "10:15",
    title: "Opening address",
    detail: "Welcome into the public Demo Day hall.",
  },
  {
    time: "10:30",
    title: "Public Demo Day",
    detail: "Live pitches + Q&A in front of judges, partners, and the builder village.",
  },
  {
    time: "12:30",
    title: "Judging deliberation",
    detail: "Placements, sustainability track, and honourable mentions.",
  },
  {
    time: "12:45",
    title: "Prizes, group photo, closing",
    detail: "Amazing Race, Demo Day, and Meteora challenge winners announced, then lunch before the 15:00 bus back to Sheraton.",
  },
  {
    time: "13:00",
    title: "Lunch",
    detail: "Farewell lunch at Voco.",
  },
  {
    time: "15:00",
    title: "Bus back to Sheraton",
    detail: "Coach returns downtown after lunch.",
  },
] as const;

export const PITCH_REQUIREMENTS = [
  "Upload your deck before Day 4 at 18:00 MYT — same cutoff as Amazing Race submissions.",
  "Pitch what you built during SVB, not a slide deck from before the event.",
  "Keep demos tight — organizers will share exact time limits at tech check.",
  "Sustainability track teams: be ready to explain your SOCOE-aligned angle.",
] as const;
