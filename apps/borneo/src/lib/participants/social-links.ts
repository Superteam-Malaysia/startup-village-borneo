import { telegramHref } from "./types";
import type { PublicParticipant } from "./types";

function firstMatch(text: string, pattern: RegExp): string | null {
  const match = text.match(pattern);
  return match?.[0] ?? null;
}

export function twitterHrefFromText(text: string | null | undefined): string | null {
  if (!text?.trim()) return null;
  return firstMatch(text, /https?:\/\/(?:www\.)?(?:x\.com|twitter\.com)\/[^\s,)\"']+/i);
}

export function linkedinHrefFromText(text: string | null | undefined): string | null {
  if (!text?.trim()) return null;
  return firstMatch(text, /https?:\/\/(?:www\.)?linkedin\.com\/in\/[^\s,)\"']+/i);
}

export function builderSocialLinks(sources: {
  proofOfWork?: string | null;
  projectIdea?: string | null;
}): { twitter: string | null; linkedin: string | null } {
  const combined = [sources.proofOfWork, sources.projectIdea].filter(Boolean).join("\n");
  return {
    twitter: twitterHrefFromText(combined),
    linkedin: linkedinHrefFromText(combined),
  };
}

export function builderConnectHref(person: PublicParticipant): string | null {
  return person.twitter ?? person.linkedin ?? telegramHref(person.telegram) ?? null;
}

export function builderConnectLabel(person: PublicParticipant): string {
  if (person.twitter) return "Twitter";
  if (person.linkedin) return "LinkedIn";
  if (telegramHref(person.telegram)) return "Telegram";
  return "Connect";
}
