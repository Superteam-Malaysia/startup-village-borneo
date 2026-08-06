/**
 * Travel & logistics for Kuching — practical companion to the program PDF.
 */

export type TravelSection = {
  id: string;
  title: string;
  items: { label: string; detail: string }[];
};

export const TRAVEL_HERO = {
  airport: "Kuching International Airport (KCH)",
  distance: "~15 min drive to city centre & Sheraton",
  timezone: "Malaysia Time (MYT, UTC+8)",
};

export const TRAVEL_SECTIONS: TravelSection[] = [
  {
    id: "fly",
    title: "Getting here",
    items: [
      {
        label: "Airport",
        detail: "Kuching International Airport (KCH) — direct flights from Kuala Lumpur, Singapore, Johor Bahru, and regional hubs.",
      },
      {
        label: "Ground transport",
        detail: "Grab is reliable. Airport taxi counters are available. Sheraton is ~15 minutes from KCH in light traffic.",
      },
      {
        label: "Arrival Day 1",
        detail: "Teams are assigned before landing. Check in, join your WhatsApp group, and the Amazing Race starts immediately.",
      },
    ],
  },
  {
    id: "stay",
    title: "Where you'll be",
    items: [
      {
        label: "Sheraton Kuching",
        detail: "Primary hotel — welcome dinner Day 1, evening building every night, breakfast before workshop days.",
      },
      {
        label: "Voco Kuching",
        detail: "Workshop venue from Day 2. Breakfast at Sheraton, then travel to Voco for 10:00 sessions.",
      },
      {
        label: "Rhythm",
        detail: "Sessions hard stop 17:00–17:30. Evenings are free for building at the hotel.",
      },
    ],
  },
  {
    id: "local",
    title: "Around Kuching",
    items: [
      {
        label: "Waterfront",
        detail: "Darul Hana bridge, cat statues, sampan rides — core Amazing Race territory. Walkable from downtown.",
      },
      {
        label: "Food",
        detail: "Laksa, kek lapis, cheese naan — the race is literally a food tour. Cash and e-wallet both work widely.",
      },
      {
        label: "Weather",
        detail: "Tropical — expect heat and humidity. Light rain is common; pack a compact umbrella.",
      },
    ],
  },
  {
    id: "essentials",
    title: "Essentials",
    items: [
      {
        label: "Currency",
        detail: "Malaysian Ringgit (MYR). ATMs and card payments are common in the city.",
      },
      {
        label: "Connectivity",
        detail: "eSIMs and local SIMs are easy at the airport. WhatsApp is the ops channel for teams.",
      },
      {
        label: "Visa",
        detail: "Check Malaysia entry requirements for your passport. Many nationalities get visa-free or e-visa access.",
      },
    ],
  },
];

export const TRAVEL_TIPS = [
  "Land with your team WhatsApp group ready — race brief goes out on arrival.",
  "Book Sheraton early; Demo Day week fills quickly.",
  "Grab > hailing — saves negotiating in the heat.",
  "Amazing Race stations span the city — plan evenings, not workshop hours.",
];
