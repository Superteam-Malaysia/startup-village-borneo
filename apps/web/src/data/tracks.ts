/**
 * Program tracks — sustainability and content awards (official agenda).
 */

export const SUSTAINABILITY_TRACK = {
  title: "Sustainability track",
  prizes: { count: 2, amount: "$500" },
  total: "$1,000",
  partner: "SOCOE",
  announcedOn: "Day 2 — Sunday 6 September",
  summary:
    "SOCOE-aligned projects addressing real environmental or community sustainability challenges in Borneo and beyond.",
  criteria: [
    "Clear problem tied to sustainability — not a retrofit label on Day 4.",
    "Evidence of local impact or measurable environmental benefit.",
    "Opt in when criteria are announced on Day 2 — plan early.",
    "Judged on Demo Day; two teams receive $500 each.",
  ],
  timeline: [
    { when: "Day 2", what: "Criteria announced during opening workshops" },
    { when: "Day 2–4", what: "Build with sustainability lens if opted in" },
    { when: "Day 5", what: "Demo Day judging includes sustainability track" },
  ],
};

export const CONTENT_AWARD = {
  title: "Content Award",
  prizes: { count: 10, amount: "$100" },
  total: "$1,000",
  judged: "Remotely within 24 hours after the event",
  summary:
    "Ten $100 prizes for standout content about Kuching and Startup Village Borneo — judged after Demo Day.",
  tags: ["@superteamMY", "@solana", "SOCOE"],
  tasks: [
    {
      id: "first-impressions",
      title: "First impressions of Kuching",
      deadline: "6 September 2026",
      points: "10 pts per qualifying team member post (race)",
      format: "Video or picture collage on X",
    },
    {
      id: "overall-impressions",
      title: "Overall impressions of SVB",
      deadline: "10 September 2026",
      points: "Content Award — no race points",
      format: "Video or collage reflecting the full week",
    },
  ],
  rules: [
    "Tag @superteamMY, @solana, and SOCOE on every post.",
    "Final impressions due 10 September — judged remotely after the event.",
    "Quality and authenticity beat production polish.",
  ],
};
