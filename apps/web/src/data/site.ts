export const SITE = {
  name: "Startup Village Borneo",
  shortName: "SVB",
  dates: "5–9 September 2026",
  venue: "Sheraton Kuching, Sarawak",
  workshopVenue: "Voco (from Day 2)",
  anchors: ["Solana Foundation", "SOCOE"],
  rhythm:
    "Sessions start at 10:00. Hard stop 17:00–17:30. Evenings are free for building at the hotel.",
  cutoff: "Day 4 · 18:00 — Amazing Race & deck submission cutoff",
  email: "hello@superteam.my",
};

export const NAV_LINKS = [
  { href: "/#overview", label: "Overview" },
  { href: "/schedule", label: "Schedule" },
  { href: "/speakers", label: "Speakers" },
  { href: "/amazing-race", label: "Amazing Race" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/prizes", label: "Prizes" },
  { href: "/travel", label: "Travel" },
  { href: "/faq", label: "FAQ" },
] as const;

export const FOOTER_LINKS = [
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/submissions", label: "Submissions" },
  { href: "/demo-day", label: "Demo Day" },
  { href: "/wallet", label: "Wallet onboarding" },
  { href: "/sustainability", label: "Sustainability track" },
  { href: "/content-awards", label: "Content Award" },
  { href: "/venue", label: "Venue" },
  { href: "/get-involved", label: "Get involved" },
  { href: "/partners", label: "Partners" },
  { href: "/code-of-conduct", label: "Code of conduct" },
  { href: "/design-system", label: "Design system" },
] as const;
