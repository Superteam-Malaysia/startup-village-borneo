import { withBasePath } from "@/lib/base-path";

export type FloorId = "ground" | "mezz" | "floor-1";

export type MapZone = {
  id: string;
  floor: FloorId;
  number: number;
  name: string;
  x: number;
  y: number;
  locations: string[];
};

export type FloorConfig = {
  id: FloorId;
  label: string;
  image: string;
  locationCount: number;
};

export const FLOOR_CONFIG: FloorConfig[] = [
  {
    id: "ground",
    label: "Ground",
    image: withBasePath("/map/bp-map-ground.webp"),
    locationCount: 8,
  },
  {
    id: "mezz",
    label: "Mezzanine",
    image: withBasePath("/map/bp-map-mezz.webp"),
    locationCount: 2,
  },
  {
    id: "floor-1",
    label: "Floor 1",
    image: withBasePath("/map/bp-map-floor-1.webp"),
    locationCount: 4,
  },
];

/** Sample data reverse-engineered from Breakpoint 2025 event-day archive (Dec 11). */
export const BREAKPOINT_VENUE_ZONES: MapZone[] = [
  {
    id: "touch-grass",
    floor: "ground",
    number: 1,
    name: "Touch Grass",
    x: -30,
    y: 40,
    locations: [
      "Merch | Solana Press Lab",
      "KAST - Coffee / Barista",
      "Squads - Booth",
      "Unitas - Arabian Lounge",
      "0xMatcha - Matcha Station & Majlis",
      "Phantom - Majlis",
      "Solayer - Majlis",
      "Streamflow - Majlis",
    ],
  },
  {
    id: "zone-2",
    floor: "ground",
    number: 2,
    name: "Main Hall East",
    x: 8,
    y: 20,
    locations: ["Registration desk"],
  },
  {
    id: "zone-3",
    floor: "ground",
    number: 3,
    name: "Expo A",
    x: 20,
    y: 15,
    locations: ["Partner booths row A"],
  },
  {
    id: "zone-4",
    floor: "ground",
    number: 4,
    name: "Expo B",
    x: 33,
    y: 10,
    locations: ["Partner booths row B"],
  },
  {
    id: "zone-5",
    floor: "ground",
    number: 5,
    name: "Outdoor Terrace",
    x: 57,
    y: 88,
    locations: ["Outdoor seating"],
  },
  {
    id: "zone-6",
    floor: "ground",
    number: 6,
    name: "Food Court",
    x: 71,
    y: 88,
    locations: ["Food & beverage"],
  },
  {
    id: "zone-7",
    floor: "ground",
    number: 7,
    name: "Arena Entry North",
    x: 70,
    y: 10,
    locations: ["North entrance"],
  },
  {
    id: "zone-8",
    floor: "ground",
    number: 8,
    name: "Arena Entry South",
    x: 45,
    y: 10,
    locations: ["South entrance"],
  },
  {
    id: "mezz-1",
    floor: "mezz",
    number: 1,
    name: "Mezzanine West",
    x: 30,
    y: 50,
    locations: ["Upper bowl seating west"],
  },
  {
    id: "mezz-2",
    floor: "mezz",
    number: 2,
    name: "Mezzanine East",
    x: 70,
    y: 50,
    locations: ["Upper bowl seating east"],
  },
  {
    id: "f1-1",
    floor: "floor-1",
    number: 1,
    name: "Breakout Room 1",
    x: 25,
    y: 40,
    locations: ["Workshop space"],
  },
  {
    id: "f1-2",
    floor: "floor-1",
    number: 2,
    name: "Breakout Room 2",
    x: 50,
    y: 40,
    locations: ["Workshop space"],
  },
  {
    id: "f1-3",
    floor: "floor-1",
    number: 3,
    name: "Press Room",
    x: 75,
    y: 35,
    locations: ["Media"],
  },
  {
    id: "f1-4",
    floor: "floor-1",
    number: 4,
    name: "Green Room",
    x: 50,
    y: 70,
    locations: ["Speaker prep"],
  },
];

/** Sheraton Kuching sample zones — illustrative pins on Breakpoint floor images. */
export const SVB_VENUE_ZONES: MapZone[] = [
  {
    id: "sheraton-lobby",
    floor: "ground",
    number: 1,
    name: "Main lobby & check-in",
    x: 12,
    y: 45,
    locations: ["Reception & concierge", "Team WhatsApp QR / ops desk", "Grab pickup — Jalan Tunku Abdul Rahman"],
  },
  {
    id: "sheraton-dinner",
    floor: "ground",
    number: 2,
    name: "Welcome dinner ballroom",
    x: 28,
    y: 28,
    locations: ["Day 1 welcome dinner · 18:30", "Race results & team formation"],
  },
  {
    id: "sheraton-breakfast",
    floor: "ground",
    number: 3,
    name: "Breakfast restaurant",
    x: 42,
    y: 22,
    locations: ["Buffet breakfast · Day 2–5 before 09:00", "Meet coaches in lobby after eating"],
  },
  {
    id: "sheraton-build",
    floor: "ground",
    number: 4,
    name: "Evening build lounge",
    x: 55,
    y: 35,
    locations: ["Post-17:30 hacking space", "Mentor drop-ins & pair programming", "Quiet corners for deck work"],
  },
  {
    id: "sheraton-pool",
    floor: "ground",
    number: 5,
    name: "Pool terrace",
    x: 62,
    y: 82,
    locations: ["Outdoor debriefs", "Casual team syncs"],
  },
  {
    id: "sheraton-fnb",
    floor: "ground",
    number: 6,
    name: "Lobby lounge & F&B",
    x: 74,
    y: 78,
    locations: ["Coffee & light bites", "Late-night snacks"],
  },
  {
    id: "sheraton-waterfront",
    floor: "ground",
    number: 7,
    name: "Waterfront exit",
    x: 8,
    y: 88,
    locations: ["5-min walk to Kuching Waterfront", "Gateway to Amazing Race stations"],
  },
  {
    id: "sheraton-parking",
    floor: "ground",
    number: 8,
    name: "Coach & shuttle bay",
    x: 85,
    y: 18,
    locations: ["Morning shuttle to Voco (Day 2–5)", "Luggage hold on Demo Day"],
  },
  {
    id: "sheraton-mezz-west",
    floor: "mezz",
    number: 1,
    name: "Meeting rooms (west)",
    x: 32,
    y: 48,
    locations: ["Small team breakouts", "1:1 mentor slots"],
  },
  {
    id: "sheraton-mezz-east",
    floor: "mezz",
    number: 2,
    name: "Executive lounge",
    x: 68,
    y: 52,
    locations: ["Partner office hours (invite only)", "Quiet calls"],
  },
  {
    id: "sheraton-tower-a",
    floor: "floor-1",
    number: 1,
    name: "Guest tower A",
    x: 28,
    y: 38,
    locations: ["Standard rooms", "Elevators to lobby"],
  },
  {
    id: "sheraton-tower-b",
    floor: "floor-1",
    number: 2,
    name: "Guest tower B",
    x: 52,
    y: 42,
    locations: ["Standard & deluxe rooms"],
  },
  {
    id: "sheraton-suites",
    floor: "floor-1",
    number: 3,
    name: "Suites",
    x: 76,
    y: 36,
    locations: ["Larger rooms for teams sharing"],
  },
  {
    id: "sheraton-sky-bar",
    floor: "floor-1",
    number: 4,
    name: "Panorama bar",
    x: 50,
    y: 72,
    locations: ["Optional evening socials", "River views"],
  },
];
