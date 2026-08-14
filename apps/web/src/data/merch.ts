import { withBasePath } from "@/lib/base-path";

/** Kit list from Superteam MY merch sneak peek (14 Aug 2026). */
// export const MERCH_TWEET_URL =
//   "https://x.com/SuperteamMY/status/2088094672359190838";

export const MERCH_IMAGE = {
  src: withBasePath("/merch/svb-merch-drop.png"),
  alt: "Startup Village Borneo merch: jersey, backpack, bottle, and wash kit",
  width: 666,
  height: 666,
};

export const MERCH_ITEMS = [
  { id: "jersey", name: "Jersey", note: "Rep the village" },
  { id: "backpack", name: "Backpack", note: "Carry the grind" },
  { id: "bottle", name: "Bottle", note: "Stay locked in" },
  { id: "wash", name: "Shampoo and soap", note: "Five days is five days" },
] as const;
