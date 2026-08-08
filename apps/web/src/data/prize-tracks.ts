export type PrizeTrack = {
  id: string;
  title: string;
  description: string;
  amount?: string;
};

/** Prize pool tracks — Summit-style panel copy for the homepage prizes section. */
export const PRIZE_TRACKS: PrizeTrack[] = [
  {
    id: "demo-day",
    title: "Demo Day",
    amount: "$6,000",
    description:
      "1st, 2nd, 3rd, and honourable mentions. Top builds pitch live — capital and judges in the room.",
  },
  {
    id: "sustainability",
    title: "Sustainability",
    amount: "2×$500",
    description:
      "SOCOE-aligned projects with real environmental or community impact. Criteria announced Day 2.",
  },
  {
    id: "content",
    title: "Content Award",
    amount: "10×$100",
    description:
      "Standout posts about Kuching and Startup Village Borneo — judged remotely after the event.",
  },
  {
    id: "race",
    title: "Amazing Race",
    amount: "2×$500",
    description:
      "Points-weighted stations across Kuching — food, culture, waterfront, and wallet onboarding.",
  },
];
