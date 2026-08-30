import type { TeamCategory } from "./team-categories";

export type PublicParticipantTeam = {
  name: string;
  slug: string;
};

export type PublicParticipant = {
  id: string;
  name: string;
  projectIdea: string | null;
  teamSetup: string | null;
  teamCategory: TeamCategory;
  telegram: string | null;
  twitter: string | null;
  linkedin: string | null;
  joinedAt: string | null;
  initials: string;
  avatarUrl: string | null;
  hackathonTeams: PublicParticipantTeam[];
};

export function firstUrl(text: string | null | undefined): string | null {
  if (!text?.trim()) return null;
  const match = text.match(/https?:\/\/[^\s,)"']+/i);
  return match?.[0] ?? null;
}

export function telegramHref(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const handle = trimmed.replace(/^@/, "");
  return handle ? `https://t.me/${handle}` : null;
}
