/**
 * On-stage program — sourced from official Startup Village Borneo agenda.
 */

import { withBasePath } from "@/lib/base-path";

export type SpeakerSession = {
  id: string;
  title: string;
  speaker: string;
  organization?: string;
  start?: string;
  end?: string;
  kind: "opening" | "keynote" | "workshop" | "program" | "ministry";
};

export type SpeakerDay = {
  dayIndex: number;
  label: string;
  date: string;
  theme: string;
  sessions: SpeakerSession[];
};

export const SPEAKER_DAYS: SpeakerDay[] = [
  {
    dayIndex: 2,
    label: "Day 2",
    date: "Sun 6 Sept",
    theme: "Opening & Problem Framing",
    sessions: [
      { id: "s2-open", title: "Opening", speaker: "Superteam MY", kind: "opening", start: "10:00", end: "10:10" },
      { id: "s2-socoe", title: "SOCOE welcome", speaker: "Edvin", organization: "SOCOE · Director", kind: "keynote", start: "10:10", end: "10:20" },
      {
        id: "s2-sf",
        title: "Solana Foundation keynote",
        speaker: "Seraphim / Chaerin",
        organization: "Solana Foundation",
        kind: "keynote",
        start: "10:20",
        end: "10:30",
      },
      {
        id: "s2-minister",
        title: "Minister address + launch",
        speaker: "TBC",
        kind: "ministry",
        start: "10:30",
        end: "10:45",
      },
      {
        id: "s2-elfa",
        title: "Finding real problems — user research & market framing",
        speaker: "Tristan",
        organization: "Elfa AI",
        kind: "workshop",
        start: "11:15",
        end: "11:45",
      },
      {
        id: "s2-semi",
        title: "solana.new — from idea to running code",
        speaker: "Semi",
        organization: "Solana",
        kind: "workshop",
        start: "11:45",
        end: "12:30",
      },
      {
        id: "s2-virtuals",
        title: "Building the agent economy — AI agents & autonomous payments via EconomyOS",
        speaker: "Joey",
        organization: "Virtuals",
        kind: "workshop",
        start: "13:30",
        end: "14:15",
      },
      {
        id: "s2-roast",
        title: "Roast My Pitch — round 1",
        speaker: "Mentors",
        kind: "program",
        start: "16:00",
        end: "17:00",
      },
    ],
  },
  {
    dayIndex: 3,
    label: "Day 3",
    date: "Mon 7 Sept",
    theme: "Build & Traction",
    sessions: [
      {
        id: "s3-ecosystem",
        title: "Solana Ecosystem Call",
        speaker: "Simon",
        organization: "Solana ID",
        kind: "workshop",
        start: "10:00",
        end: "10:45",
      },
      {
        id: "s3-sanctum",
        title: "Sanctum",
        speaker: "Nic",
        organization: "Sanctum",
        kind: "workshop",
        start: "10:45",
        end: "11:15",
      },
      {
        id: "s3-monke",
        title: "MonkeDAO — community-led building",
        speaker: "Jemmy",
        organization: "MonkeDAO",
        kind: "workshop",
        start: "11:15",
        end: "11:45",
      },
      {
        id: "s3-meteora",
        title: "Meteora Ecosystem",
        speaker: "Vesper",
        organization: "Meteora",
        kind: "workshop",
        start: "11:45",
        end: "12:15",
      },
      {
        id: "s3-kyzzen",
        title: "Kyzzen",
        speaker: "OhMeOhMy",
        organization: "Kyzzen",
        kind: "workshop",
        start: "13:30",
        end: "14:15",
      },
      {
        id: "s3-users",
        title: "Teams go out for first 10 users",
        speaker: "All teams",
        kind: "program",
        start: "14:15",
        end: "16:30",
      },
    ],
  },
  {
    dayIndex: 4,
    label: "Day 4",
    date: "Tue 8 Sept",
    theme: "Storytelling & Pitch",
    sessions: [
      {
        id: "s4-super",
        title: "What investors look for — what kills a pitch in 30 seconds",
        speaker: "Jacob",
        organization: "Superscrypt",
        kind: "workshop",
        start: "10:00",
        end: "10:45",
      },
      {
        id: "s4-rarible",
        title: "Go-to-market & distribution",
        speaker: "Shuen Rui",
        organization: "Impossible Finance / Rarible",
        kind: "workshop",
        start: "10:45",
        end: "11:30",
      },
      {
        id: "s4-content",
        title: "Contentmaxxing",
        speaker: "Nikki",
        kind: "workshop",
        start: "11:30",
        end: "12:00",
      },
      {
        id: "s4-deck",
        title: "Deck clinic — one-liner, story arc, demo",
        speaker: "Mentors",
        kind: "program",
        start: "13:30",
        end: "15:00",
      },
      {
        id: "s4-roast2",
        title: "Roast My Pitch — round 2 (full dry run)",
        speaker: "Mentors",
        kind: "program",
        start: "15:00",
        end: "17:30",
      },
    ],
  },
  {
    dayIndex: 5,
    label: "Day 5",
    date: "Wed 9 Sept",
    theme: "Demo Day",
    sessions: [
      {
        id: "s5-tech",
        title: "Tech check",
        speaker: "Ops",
        kind: "program",
        start: "10:00",
        end: "10:15",
      },
      {
        id: "s5-opening",
        title: "Opening address",
        speaker: "Ops",
        kind: "opening",
        start: "10:15",
        end: "10:30",
      },
      {
        id: "s5-demo",
        title: "Public Demo Day — live pitches + Q&A",
        speaker: "All teams",
        kind: "keynote",
        start: "10:30",
        end: "12:30",
      },
      {
        id: "s5-judging",
        title: "Judging deliberation",
        speaker: "Judges",
        kind: "program",
        start: "12:30",
        end: "12:45",
      },
      {
        id: "s5-prizes",
        title: "Prizes, group photo, closing",
        speaker: "Everyone",
        kind: "keynote",
        start: "12:45",
        end: "13:00",
      },
    ],
  },
];

/** Flat list for homepage preview — featured workshop leaders */
export const FEATURED_SPEAKERS = [
  { name: "Edvin", org: "SOCOE" },
  { name: "Seraphim / Chaerin", org: "Solana Foundation" },
  { name: "Tristan", org: "Elfa AI" },
  { name: "Semi", org: "solana.new" },
  { name: "Nic", org: "Sanctum" },
  { name: "Simon", org: "Solana ID" },
  { name: "Jemmy", org: "MonkeDAO" },
  { name: "Vesper", org: "Meteora" },
  { name: "OhMeOhMy", org: "Kyzzen" },
  { name: "Jacob", org: "Superscrypt" },
  { name: "Shuen Rui", org: "Impossible Finance / Rarible" },
  { name: "Nikki", org: "Content" },
];

export type WorkshopPreview = {
  id: string;
  title: string;
  speaker: string;
  organization?: string;
  avatar?: string;
  twitter?: string;
  linkedin?: string;
  dayIndex: number;
  dayLabel: string;
  date: string;
  start: string;
};

/** Workshop leader avatars — sourced from X / LinkedIn profile photos. */
export const WORKSHOP_LEADER_PROFILES: Record<
  string,
  { avatar: string; twitter?: string; linkedin?: string }
> = {
  "s2-elfa": { avatar: withBasePath("/speakers/hypetris.jpg"), twitter: "hypetris_" },
  "s2-semi": { avatar: withBasePath("/speakers/semi.jpg"), twitter: "semiii" },
  "s2-virtuals": {
    avatar: withBasePath("/speakers/virtuals.jpg"),
    twitter: "virtuals_io",
  },
  // "s3-magic": MagicBlock session removed from the Aug 2026 agenda.
  "s3-ecosystem": {
    avatar: withBasePath("/speakers/simon.jpg"),
    twitter: "simonmolitor",
  },
  "s3-monke": {
    avatar: withBasePath("/speakers/jemmy.jpg"),
    twitter: "jemmmyjemm",
  },
  "s4-super": {
    avatar: withBasePath("/speakers/jacob-ko.jpg"),
    linkedin: "jacob-ko-10989b24",
  },
  "s4-rarible": {
    avatar: withBasePath("/speakers/shuen-rui.jpg"),
    twitter: "shuenrui",
  },
  "s4-content": {
    avatar: withBasePath("/speakers/nikkideyy.jpg"),
    twitter: "nikkideyy",
  },
};

/** On-stage workshops — Breakout livestream row layout (title · speaker · slot). */
export const WORKSHOP_SESSIONS: WorkshopPreview[] = SPEAKER_DAYS.flatMap((day) =>
  day.sessions
    .filter((session) => session.kind === "workshop")
    .map((session) => {
      const profile = WORKSHOP_LEADER_PROFILES[session.id];
      return {
        id: session.id,
        title: session.title,
        speaker: session.speaker,
        organization: session.organization,
        avatar: profile?.avatar,
        twitter: profile?.twitter,
        linkedin: profile?.linkedin,
        dayIndex: day.dayIndex,
        dayLabel: day.label,
        date: day.date,
        start: session.start ?? "",
      };
    }),
);
