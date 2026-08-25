/**
 * Amazing Race task catalog — sourced from the official Startup Village Borneo agenda
 * (see docs/blueprint/01-event-context.md).
 */

export type TaskCategory = "content" | "race" | "wallet";

export type TaskTheme = "content" | "food" | "culture" | "waterfront" | "wallet";

export type RaceTask = {
  id: string;
  number: number;
  title: string;
  shortDescription: string;
  details: string[];
  /** Base or fixed points; use pointsMax + pointsNote for variable scoring. */
  pointsBase: number;
  pointsMax?: number;
  pointsNote?: string;
  category: TaskCategory;
  theme: TaskTheme;
  location?: string;
  deadline?: string;
};

export const RACE_CUTOFF = {
  label: "Day 4 · Tue 8 Sept",
  time: "18:00 MYT",
  iso: "2026-09-08T18:00:00+08:00",
} as const;

export const CONTENT_TASKS: RaceTask[] = [
  {
    id: "content-first-impressions",
    number: 1,
    title: "First impressions of Kuching",
    shortDescription:
      "Share your team's first take on the city — video or collage on X before the opening day wraps.",
    details: [
      "Each team member posts individually; each qualifying post earns 10 points for the team.",
      "Tag @superteamMY, @solana, and @socoe_s on every post.",
      "Due by 6 September 2026 — capture arrival energy, street scenes, or first bites.",
      "Quality over polish — authentic reactions beat produced reels.",
    ],
    pointsBase: 10,
    pointsNote: "10 pts per qualifying member post",
    category: "content",
    theme: "content",
    deadline: "6 Sept 2026",
  },
  {
    id: "content-overall-impressions",
    number: 2,
    title: "Overall impressions",
    shortDescription:
      "Reflect on the full SVB week — a final video or collage posted after Demo Day.",
    details: [
      "Posted on 10 September 2026 with the same partner tags: @superteamMY, @solana, @socoe_s.",
      "No race points — submissions count toward the Content Award ($100 × 10 prizes).",
      "Show what you built, who you met, and what Kuching meant to your team.",
      "Judged remotely within 24 hours after the event.",
    ],
    pointsBase: 0,
    pointsNote: "Content Award — no race points",
    category: "content",
    theme: "content",
    deadline: "10 Sept 2026",
  },
];

export const RACE_TASKS: RaceTask[] = [
  {
    id: "race-bourdain",
    number: 3,
    title: "The Bourdain pilgrimage",
    shortDescription:
      "Team photo at Choon Hui Cafe and a laksa ranking — Kuching vs West Malaysia.",
    details: [
      "Find Choon Hui Cafe and get a team photo outside. It's a morning spot so it may be shut — that's part of the game.",
      "Then hunt down a laksa you can actually eat, and rank it against a West Malaysian laksa (Johor, Penang, etc.).",
      "Submit via one Twitter thread tagging every team member.",
      "One team submission per task.",
    ],
    pointsBase: 6,
    category: "race",
    theme: "food",
    location: "Choon Hui Cafe",
  },
  {
    id: "race-kek-lapis",
    number: 4,
    title: "Kek lapis at Mama Su",
    shortDescription: "Taste layered cake, film the first bite, and buy your team's favourite.",
    details: [
      "Show the layers — kek lapis is Sarawak's signature bake.",
      "Film each teammate's first bite reaction.",
      "Buy at least one cake to take back — team choice documented in the thread.",
    ],
    pointsBase: 4,
    category: "race",
    theme: "food",
    location: "Mama Su",
  },
  {
    id: "race-sams-ice-cream",
    number: 5,
    title: "Sam's ice cream",
    shortDescription: "Photo eating ice cream and name the flavour of the day.",
    details: [
      "Everyone in frame — no solo stealth scoops.",
      "State the flavour of the day clearly in your post or caption.",
      "Bonus creativity if you tie the flavour to your product pitch (optional).",
    ],
    pointsBase: 3,
    category: "race",
    theme: "food",
    location: "Sam's Ice Cream",
  },
  {
    id: "race-ceylonese-naan",
    number: 6,
    title: "Ceylonese cheese naan",
    shortDescription:
      "Visit the Ceylonese restaurant and film the longest cheese pull in town.",
    details: [
      "Claim: best cheese naan in Kuching — prove it with footage.",
      "Film the longest cheese pull your team can achieve — extra points for the longest pull.",
      "Keep it respectful — staff and other diners are not props.",
    ],
    pointsBase: 4,
    category: "race",
    theme: "food",
    location: "Ceylonese Restaurant",
  },
  {
    id: "race-cats",
    number: 7,
    title: "Cats of Kuching",
    shortDescription: "Team photo at the iconic cat statue — more statues, more points.",
    details: [
      "Base points for one cat statue team photo.",
      "+1 point for each additional distinct cat statue in separate photos (same thread).",
      "Kuching is Cat City — find the statues, don't harass real cats.",
    ],
    pointsBase: 2,
    pointsMax: 10,
    pointsNote: "2 pts base + 1 per extra statue",
    category: "race",
    theme: "culture",
    location: "Cat statues, Kuching",
  },
  {
    id: "race-carpenter-street",
    number: 9,
    title: "Carpenter Street murals",
    shortDescription: "Three unique murals, three photos — one point each.",
    details: [
      "Carpenter Street is a mural gallery — find three distinct works.",
      "One photo per mural; teammates should appear in each shot.",
      "No duplicate murals across teams — originality matters for judges.",
    ],
    pointsBase: 1,
    pointsMax: 3,
    pointsNote: "1 pt per mural (max 3)",
    category: "race",
    theme: "culture",
    location: "Carpenter Street",
  },
  {
    id: "race-old-court-house",
    number: 12,
    title: "Old Court House",
    shortDescription: "Team photo inside or outside the heritage Old Court House.",
    details: [
      "Full team in frame at the Old Court House — inside or outside, best shot.",
      "Brief context in your thread — what did you notice about the architecture?",
      "Daytime lighting recommended for clarity.",
    ],
    pointsBase: 3,
    category: "race",
    theme: "culture",
    location: "Old Court House",
  },
  {
    id: "race-brookes-dockyard",
    number: 13,
    title: "Brooke's Dockyard Heritage Museum",
    shortDescription: "Team photo with the biggest anchor on display.",
    details: [
      "Find the largest anchor in the museum collection.",
      "Everyone visible — scale against the anchor is the vibe.",
      "Respect museum rules on flash and touch surfaces.",
    ],
    pointsBase: 3,
    category: "race",
    theme: "culture",
    location: "Brooke's Dockyard Heritage Museum",
  },
  {
    id: "race-traditional-attire",
    number: 14,
    title: "Traditional Sarawakian attire",
    shortDescription: "Photograph five distinct Sarawakian outfits — one point each.",
    details: [
      "Document five different traditional Sarawakian garments or styles.",
      "Can be worn by teammates, locals (with permission), or museum displays.",
      "Name each outfit in your thread — educational captions welcome.",
    ],
    pointsBase: 1,
    pointsMax: 5,
    pointsNote: "1 pt per attire (max 5)",
    category: "race",
    theme: "culture",
  },
  {
    id: "race-word-sign",
    number: 8,
    title: "Kuching Word Sign",
    shortDescription: "Creative team photo at the waterfront KUCHING letter sign.",
    details: [
      "The giant letters along the waterfront — compose something memorable.",
      "Creative angles, team formations, or product tie-ins encouraged.",
      "Keep it tasteful — this photo may end up in the event gallery.",
    ],
    pointsBase: 4,
    category: "race",
    theme: "waterfront",
    location: "Kuching Waterfront",
  },
  {
    id: "race-sampan-ride",
    number: 10,
    title: "Waterfront sampan ride",
    shortDescription: "Film your team on a sampan ride along the Sarawak River.",
    details: [
      "One of three waterfront options — this is the highest-value pick.",
      "Film the ride — motion and river context should be clear.",
      "Teams may complete multiple waterfront tasks; points cap at 8 total from waterfront picks.",
    ],
    pointsBase: 8,
    category: "race",
    theme: "waterfront",
    location: "Kuching Waterfront",
  },
  {
    id: "race-flagpole-lean",
    number: 10,
    title: "Lean on the flagpole",
    shortDescription: "Team photo leaning on the waterfront flagpole.",
    details: [
      "Quick win — creative lean poses welcome.",
      "Counts toward waterfront points (max 8 pts combined across waterfront option tasks).",
      "Stay safe — don't climb the pole.",
    ],
    pointsBase: 2,
    category: "race",
    theme: "waterfront",
    location: "Kuching Waterfront",
  },
  {
    id: "race-flagpole-group",
    number: 10,
    title: "Group photo under the flagpole",
    shortDescription: "Full team grouped under the waterfront flagpole.",
    details: [
      "Everyone in frame beneath the flagpole.",
      "Pairs well with the lean task — different shot, different points.",
      "Waterfront sub-tasks share an 8-point cap across optional picks.",
    ],
    pointsBase: 3,
    category: "race",
    theme: "waterfront",
    location: "Kuching Waterfront",
  },
  {
    id: "race-darul-hana-bridge",
    number: 11,
    title: "Darul Hana Bridge",
    shortDescription: "Best mid-span team photo on the golden bridge.",
    details: [
      "Shoot from or on the bridge mid-span — symmetry is your friend.",
      "Evening golden hour matches the bridge lighting.",
      "Mind pedestrian traffic — don't block the walkway.",
    ],
    pointsBase: 3,
    category: "race",
    theme: "waterfront",
    location: "Darul Hana Bridge",
  },
  {
    id: "race-onboard-user",
    number: 15,
    title: "Onboard a real user",
    shortDescription:
      "Teach someone a blockchain product — a wallet like RedotPay — and document what was hard.",
    details: [
      "Teach, don't sell — no pitching investments or asking for money.",
      "Use a real product (a wallet like RedotPay).",
      "Document what confused your learner — that's gold for your build.",
      "If they aren't interested, thank them and move on.",
    ],
    pointsBase: 10,
    category: "wallet",
    theme: "wallet",
  },
  {
    id: "race-photobooth",
    number: 16,
    title: "Photobooth",
    shortDescription:
      "Team photo at the Superteam MY x Solana x SOCOE photobooth at Voco — Day 2 only.",
    details: [
      "The photobooth is at Voco on Sunday 6 September.",
      "One team shot in the Superteam MY x Solana x SOCOE booth.",
      "Submit via your team Twitter thread tagging every member.",
    ],
    pointsBase: 3,
    category: "race",
    theme: "culture",
    location: "Voco Kuching",
    deadline: "6 Sept 2026",
  },
];

export const ALL_TASKS: RaceTask[] = [...CONTENT_TASKS, ...RACE_TASKS];

export const THEME_LABELS: Record<TaskTheme, string> = {
  content: "Content",
  food: "Food & flavours",
  culture: "Culture & heritage",
  waterfront: "Waterfront",
  wallet: "Wallet onboarding",
};

export const THEME_ORDER: TaskTheme[] = ["food", "culture", "waterfront", "wallet"];

export const SUMMARY_THEME_ORDER: TaskTheme[] = [
  "content",
  "food",
  "culture",
  "waterfront",
  "wallet",
];

export const THEME_MAX_POINTS: Record<TaskTheme, number> = {
  content: 10,
  food: 17,
  culture: 27,
  waterfront: 15,
  wallet: 10,
};

export const THEME_METER_COLORS: Record<
  TaskTheme,
  "green" | "orange" | "purple" | "blue" | "red"
> = {
  content: "purple",
  food: "orange",
  culture: "blue",
  waterfront: "green",
  wallet: "red",
};

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  content: "Content",
  race: "Race",
  wallet: "Wallet",
};

/** Max race points if every task is completed at cap (excludes per-member content posts). */
export const MAX_RACE_POINTS = RACE_TASKS.reduce(
  (sum, t) => sum + (t.pointsMax ?? t.pointsBase),
  0,
);

export function getThemePointsSummary(): { theme: TaskTheme; max: number }[] {
  return SUMMARY_THEME_ORDER.map((theme) => ({
    theme,
    max: THEME_MAX_POINTS[theme],
  }));
}

export function groupRaceTasksByTheme(): Record<TaskTheme, RaceTask[]> {
  const groups = Object.fromEntries(
    THEME_ORDER.map((theme) => [theme, [] as RaceTask[]]),
  ) as Record<TaskTheme, RaceTask[]>;

  for (const task of RACE_TASKS) {
    groups[task.theme].push(task);
  }

  return groups;
}

export const RACE_SUBMISSION_RULES = [
  "Submit via one Twitter thread per task, tagging every team member.",
  "Amazing Race and deck cutoff: Day 4 at 18:00 — nothing accepted after.",
  "Teach wallet users; never pressure anyone about money or investment.",
  "Content posts must tag @superteamMY, @solana, and @socoe_s.",
  "Your build comes first — race runs in evenings and gaps.",
];

export const SAMPLE_LEADERBOARD = [
  { rank: 1, team: "Borneo Builders", points: 62, trend: [12, 28, 45, 58, 62] },
  { rank: 2, team: "Kuching Coders", points: 54, trend: [10, 22, 38, 48, 54] },
  { rank: 3, team: "Sarawak Stack", points: 47, trend: [8, 18, 30, 42, 47] },
  { rank: 4, team: "Monke Foundry", points: 41, trend: [6, 14, 25, 35, 41] },
  { rank: 5, team: "Laksa Labs", points: 36, trend: [5, 12, 20, 28, 36] },
];
