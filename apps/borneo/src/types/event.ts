export type ScheduleItem = {
  id: string;
  dayIndex: number;
  start: string; // HH:mm
  end?: string;
  title: string;
  detail?: string;
  kind: "session" | "workshop" | "meal" | "break" | "build" | "deadline" | "social";
  location?: string;
};

export type DaySchedule = {
  index: number;
  date: string; // ISO date
  label: string;
  title: string;
  subtitle?: string;
  venueNote?: string;
  items: ScheduleItem[];
};

export type RaceTask = {
  id: string;
  number: number;
  title: string;
  description: string;
  points: number | string;
  category: "content" | "race" | "wallet";
  group?: string;
  deadline?: string;
  tags?: string[];
  bonusNote?: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: "general" | "race" | "teams" | "submissions" | "wallet" | "travel";
};

export type PrizeRow = {
  label: string;
  amount: string;
  note?: string;
};

export type Partner = {
  name: string;
  role: "anchor" | "confirmed" | "pending";
  workshops?: boolean;
  /** Path under /public, e.g. /partners/foo.svg */
  logo?: string;
  /** How to render on dark footer-style surfaces (Breakpoint sponsor grid). */
  logoStyle?: "light" | "color" | "invert";
  /** Square/circular badge — tighter inset so it doesn't dominate the 16:9 cell */
  logoFit?: "default" | "icon";
};
