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
  { id: "ground", label: "Ground", image: "/map/ground.webp", locationCount: 8 },
  { id: "mezz", label: "Mezzanine", image: "/map/mezz.webp", locationCount: 2 },
  { id: "floor-1", label: "Floor 1", image: "/map/floor-1.webp", locationCount: 4 },
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
