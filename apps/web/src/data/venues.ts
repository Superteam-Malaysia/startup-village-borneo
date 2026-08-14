/**
 * Sheraton & Voco venue details — Startup Village Borneo program.
 * Source: official agenda + public hotel listings.
 */

export type VenueId = "sheraton" | "voco";

export type Venue = {
  id: VenueId;
  name: string;
  shortName: string;
  address: string;
  addressLines: string[];
  role: string;
  checkInNote: string;
  breakfastNote?: string;
  phone?: string;
  mapsQuery: string;
};

export type VenueDayPlan = {
  day: string;
  date: string;
  venueId: VenueId | "city";
  headline: string;
  detail: string;
};

export type WaterfrontStation = {
  id: string;
  name: string;
  points: string;
  href: string;
};

export const VENUES: Record<VenueId, Venue> = {
  sheraton: {
    id: "sheraton",
    name: "Sheraton Kuching",
    shortName: "Sheraton",
    address: "Jalan Tunku Abdul Rahman, 93100 Kuching, Sarawak, Malaysia",
    addressLines: [
      "Jalan Tunku Abdul Rahman",
      "93100 Kuching, Sarawak",
      "Malaysia",
    ],
    role: "Primary hotel — welcome dinner, evening building, breakfast hub",
    checkInNote:
      "Standard check-in from 15:00. SVB teams are assigned before arrival — head to reception, collect your key, and join your team WhatsApp group. The Amazing Race starts the moment you land.",
    breakfastNote:
      "Buffet breakfast at the hotel on workshop days (Day 2–5). Eat before 09:00 — coaches leave for Voco at 09:30 so sessions can start at 10:00.",
    phone: "+60 82-423 111",
    mapsQuery: "Sheraton+Kuching+Jalan+Tunku+Abdul+Rahman",
  },
  voco: {
    id: "voco",
    name: "voco Kuching",
    shortName: "Voco",
    address:
      "Lot 3186-3187, Block 16 KCLD, Jalan Lapangan Terbang Baru, 93350 Kuching, Sarawak, Malaysia",
    addressLines: [
      "Lot 3186-3187, Block 16 KCLD",
      "Jalan Lapangan Terbang Baru",
      "93350 Kuching, Sarawak",
    ],
    role: "Workshop venue — opening day through Demo Day (Day 2–5)",
    checkInNote:
      "Not a residential hotel for SVB — you visit for daytime programming. Arrive by 09:45 for the 10:00 hard start. Day 5: check out of Sheraton first, then the 09:30 bus to Voco for tech check and Demo Day.",
    phone: "+60 82-537 666",
    mapsQuery: "voco+Kuching+Jalan+Lapangan+Terbang+Baru",
  },
};

export const BREAKFAST_RHYTHM =
  "Breakfast at Sheraton every workshop morning (Day 2–5). Grab food before 09:00, meet your team in the lobby, then the 09:30 bus to Voco for a 10:00 session start. Day 5 adds check-out — bags with concierge or in the coach, then straight to Voco for tech check.";

export const WHATSAPP_OPS_NOTE =
  "Teams are placed in WhatsApp groups before landing. Your race brief drops on arrival — ops updates, shuttle timing, and mentor office hours all run through the group. Save the hotel front desk number, but check WhatsApp first for SVB-specific moves.";

export const SHERATON_TO_VOCO = {
  distance: "~12 km · 15–20 min by car",
  summary:
    "Sheraton sits on the downtown waterfront (Jalan Tunku Abdul Rahman). Voco is on Jalan Lapangan Terbang Baru near the airport. Grab is the default — pin both hotels in the app before Day 2.",
  steps: [
    "Exit Sheraton via the main lobby; Grab pickup is along Jalan Tunku Abdul Rahman.",
    "Ride to voco Kuching — Jalan Lapangan Terbang Baru, 93350 (allow 15–20 min in morning traffic).",
    "Return to Sheraton after the 17:00–17:30 wrap for evening building.",
  ],
  grabTip: "Book GrabCar (not GrabShare) when travelling with laptops and demo gear.",
};

export const VENUE_DAY_PLAN: VenueDayPlan[] = [
  {
    day: "Day 1",
    date: "Sat 5 Sept",
    venueId: "city",
    headline: "Arrive & explore Kuching",
    detail:
      "Check in at Sheraton, join your WhatsApp group, race across the city. All teams back by 18:00; welcome dinner at the Sheraton Rooftop Bar with RedotsClub at 18:30.",
  },
  {
    day: "Day 2",
    date: "Sun 6 Sept",
    venueId: "voco",
    headline: "Opening & problem framing",
    detail: "Breakfast at Sheraton → 09:30 bus to Voco for workshops 10:00–17:00. Buffet dinner back at the hotel.",
  },
  {
    day: "Day 3",
    date: "Mon 7 Sept",
    venueId: "voco",
    headline: "Build & traction",
    detail:
      "Breakfast at Sheraton → 09:30 bus to Voco. Teams go out for first 10 users after lunch; regroup at Voco by 16:30. Monke Meetup 18:30.",
  },
  {
    day: "Day 4",
    date: "Tue 8 Sept",
    venueId: "voco",
    headline: "Storytelling & pitch",
    detail:
      "Breakfast at Sheraton → 09:30 bus to Voco for deck clinic and Roast My Pitch. Hard cutoff 18:00 — race & deck submissions, then dinner at Fable. Bus back to Sheraton at 21:00.",
  },
  {
    day: "Day 5",
    date: "Wed 9 Sept",
    venueId: "voco",
    headline: "Demo Day",
    detail:
      "Breakfast at Sheraton, check out, then 09:30 bus to Voco for tech check (10:00), public Demo Day (10:30), prizes, lunch, and the 15:00 bus back.",
  },
];

export const WATERFRONT_RACE_STATIONS: WaterfrontStation[] = [
  { id: "race-word-sign", name: "Kuching Word Sign", points: "4 pts", href: "/amazing-race#race-word-sign" },
  { id: "race-sampan-ride", name: "Waterfront sampan ride", points: "8 pts", href: "/amazing-race#race-sampan-ride" },
  { id: "race-flagpole-lean", name: "Lean on the flagpole", points: "2 pts", href: "/amazing-race#race-flagpole-lean" },
  { id: "race-flagpole-group", name: "Group under the flagpole", points: "3 pts", href: "/amazing-race#race-flagpole-group" },
  { id: "race-darul-hana-bridge", name: "Darul Hana Bridge", points: "3 pts", href: "/amazing-race#race-darul-hana-bridge" },
  { id: "race-old-court-house", name: "Old Court House", points: "3 pts", href: "/amazing-race#race-old-court-house" },
];

export function venueLabel(id: VenueId | "city"): string {
  if (id === "city") return "Kuching city";
  return VENUES[id].shortName;
}
