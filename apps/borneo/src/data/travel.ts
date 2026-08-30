/**
 * Travel & logistics for Kuching — practical companion to the official agenda.
 */

export type TravelSection = {
  id: string;
  title: string;
  items: { label: string; detail: string }[];
};

export const TRAVEL_HERO = {
  airport: "Kuching International Airport (KCH)",
  airportCode: "KCH · WBGG",
  distance: "~11 km south of downtown · ~15 min to Sheraton",
  timezone: "Malaysia Time (MYT, UTC+8)",
  terminal: "Single integrated terminal — domestic & international",
};

export const KCH_AIRPORT_DETAILS = {
  name: "Kuching International Airport",
  iata: "KCH",
  icao: "WBGG",
  address: "Jalan Lapangan Terbang, 93756 Kuching, Sarawak, Malaysia",
  driveToSheraton: "~15 minutes in light traffic (11 km north to downtown)",
  driveToVoco: "~5 minutes — Voco sits on Jalan Lapangan Terbang Baru near the airport",
  arrivalFlow: [
    "Complete your Malaysia Digital Arrival Card (MDAC) within 3 days of landing if required — imigresen-online.imi.gov.my/mdac/main. Singapore citizens and Malaysian PRs are exempt.",
    "Immigration & baggage claim on the ground floor for international arrivals.",
    "ATMs and telco counters (Celcom, Digi, Maxis) in arrivals — grab a local SIM or eSIM before Grab.",
    "Grab pickup bay is signed outside arrivals; airport taxis also operate from the official counter.",
  ],
};

export const GRAB_TIPS = [
  "Download Grab before you land — it works reliably across Kuching and is cheaper than airport taxis.",
  "Pin \"Kuching International Airport (KCH)\" for pickup; exit via the main arrivals doors.",
  "Pay with card or GrabPay; small cash top-up works if your home card declines.",
  "GrabCar (not GrabShare) when travelling with teammates, luggage, or demo hardware.",
  "Save both Sheraton Kuching and voco Kuching as favourites before Day 2 morning rush.",
  "Morning Sheraton → Voco runs ~15–20 min; allow buffer so the 10:00 hard start isn't missed.",
];

export const TRAVEL_SECTIONS: TravelSection[] = [
  {
    id: "fly",
    title: "Getting here",
    items: [
      {
        label: "Airport",
        detail:
          "Kuching International Airport (KCH / WBGG) — single terminal with domestic and international gates. Direct flights from Kuala Lumpur, Singapore, Johor Bahru, and regional hubs.",
      },
      {
        label: "KCH → Sheraton",
        detail:
          "Sheraton is downtown on Jalan Tunku Abdul Rahman, ~11 km north of the airport. Grab or airport taxi: ~15 minutes in light traffic. Voco is only ~5 minutes from KCH if you need the workshop venue first.",
      },
      {
        label: "Arrival Day 1",
        detail:
          "Teams are assigned before landing. Check in at Sheraton, join your WhatsApp group, and the Amazing Race starts immediately — race brief drops on arrival.",
      },
    ],
  },
  {
    id: "stay",
    title: "Where you'll be",
    items: [
      {
        label: "Sheraton Kuching",
        detail:
          "Jalan Tunku Abdul Rahman, 93100 Kuching — primary hotel. Welcome dinner Day 1, evening building every night, breakfast before workshop days.",
      },
      {
        label: "voco Kuching",
        detail:
          "Jalan Lapangan Terbang Baru, 93350 Kuching — workshop venue Day 2–5. Breakfast at Sheraton, then the 09:30 bus to Voco for 10:00 sessions.",
      },
      {
        label: "Rhythm",
        detail:
          "Sessions hard stop 17:00–17:30. Evenings are free for building at the hotel. Day 4 dinner is at Fable (race & deck cutoff 18:00). Day 5: check out of Sheraton, Demo Day at Voco.",
      },
    ],
  },
  {
    id: "local",
    title: "Around Kuching",
    items: [
      {
        label: "Waterfront",
        detail:
          "Five minutes on foot from Sheraton — Darul Hana bridge, cat statues, sampan rides, and the KUCHING letter sign. Core Amazing Race territory.",
      },
      {
        label: "Food",
        detail:
          "Laksa, kek lapis, cheese naan — the race is literally a food tour. Cash and e-wallet both work widely.",
      },
      {
        label: "Weather",
        detail:
          "Tropical — expect heat and humidity. Light rain is common; pack a compact umbrella.",
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
        detail:
          "eSIMs and local SIMs at KCH arrivals. WhatsApp is the ops channel for teams — join your group before leaving the airport.",
      },
      {
        label: "Visa",
        detail:
          "Check Malaysia entry requirements for your passport. Many nationalities get visa-free or e-visa access.",
      },
    ],
  },
];

export const TRAVEL_TIPS = [
  "Complete your Malaysia Digital Arrival Card (MDAC) within 3 days of landing if required — free at imigresen-online.imi.gov.my/mdac/main.",
  "Land with your team WhatsApp group ready — race brief goes out on arrival.",
  "Book Sheraton early; Demo Day week fills quickly.",
  "Grab > hailing — saves negotiating in the heat.",
  "Amazing Race stations span the city — plan evenings, not workshop hours.",
  "Pin Sheraton and Voco in Grab before Day 2; morning traffic adds 5–10 minutes.",
];
