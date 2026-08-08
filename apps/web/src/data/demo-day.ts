export { DEMO_DAY_JUDGES } from "@/data/judges";

export const DEMO_DAY = {
  date: "Wed 9 Sept 2026",
  venue: "Voco Kuching",
  morningNote:
    "Check out of Sheraton first, then head straight to Voco for rehearsal and Demo Day.",
  summary:
    "Five days of building culminate in live pitches, Q&A, and prize announcements — the public capstone of Startup Village Borneo.",
};

export const DEMO_DAY_SCHEDULE = [
  {
    time: "09:15",
    title: "Rehearsal",
    detail: "Sound check, slide order, and timing with organizers.",
  },
  {
    time: "10:00",
    title: "Public Demo Day",
    detail: "Live pitches + Q&A in front of judges, partners, and the builder village.",
  },
  {
    time: "12:00",
    title: "Judging",
    detail: "Deliberation across hackathon placements, sustainability track, and honourable mentions.",
  },
  {
    time: "12:30",
    title: "Prizes & wrap",
    detail: "Winners announced, farewell lunch, and goodbyes before everyone scatters.",
  },
] as const;

export const PITCH_REQUIREMENTS = [
  "Upload your deck before Day 4 at 18:00 MYT — same cutoff as Amazing Race submissions.",
  "Pitch what you built during SVB, not a slide deck from before the event.",
  "Keep demos tight — organizers will share exact time limits at rehearsal.",
  "Sustainability track teams: be ready to explain your SOCOE-aligned angle.",
] as const;
