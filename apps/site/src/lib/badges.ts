/** Single source of truth for member badges — list, permissions, and styling. */

export const ADMIN_ONLY_BADGES = ["Core Contributor"] as const;

/** Members pick these themselves from Dashboard → My Profile. */
export const SELF_SERVICE_BADGES = [
  "Solana Builder",
  "Founder",
  "Creator",
  "Production",
  "Bounty Hunter",
  "Hackathon Winner",
] as const;

/** Everything an admin can assign, in display order. */
export const MEMBER_BADGES = [
  ...SELF_SERVICE_BADGES,
  ...ADMIN_ONLY_BADGES,
] as const;

export type MemberBadge = (typeof MEMBER_BADGES)[number];

export function isAdminOnlyBadge(badge: string): boolean {
  return (ADMIN_ONLY_BADGES as readonly string[]).includes(badge);
}

/** Pill styling on the member card. */
export const BADGE_PILL_CLASS: Record<string, string> = {
  "Bounty Hunter": "bg-[#CB5454]/50 border-[#6B2929]/50 text-white",
  "Solana Builder": "bg-[#49C942]/50 border-[#6BF863]/50 text-white",
  "Hackathon Winner": "bg-[#E7D763]/50 border-[#A38A33]/50 text-white",
  "Core Contributor": "bg-[#424FC9]/50 border-[#6863F8]/50 text-white",
  Founder: "bg-[#8B5CF6]/50 border-[#A78BFA]/50 text-white",
  Creator: "bg-[#D946A0]/50 border-[#F472B6]/50 text-white",
  Production: "bg-[#14B8A6]/50 border-[#5EEAD4]/50 text-white",
};

export const BADGE_PILL_FALLBACK =
  "bg-amber-500/20 text-amber-400 border-transparent";

/**
 * Card background gradient. A member can hold several badges, so the first
 * match in this order wins — hence an ordered list rather than a map.
 */
const CARD_GRADIENTS: [string, string][] = [
  ["Bounty Hunter", "linear-gradient(180deg, #4C1D1D 0%, #933939 100%)"],
  ["Solana Builder", "linear-gradient(180deg, #153C13 0%, #287824 100%)"],
  ["Hackathon Winner", "linear-gradient(180deg, #504A20 0%, #8B8138 100%)"],
  ["Core Contributor", "linear-gradient(180deg, #14173D 0%, #293280 100%)"],
  ["Founder", "linear-gradient(180deg, #2A1740 0%, #5B2E8C 100%)"],
  ["Creator", "linear-gradient(180deg, #3D1330 0%, #8C2E6E 100%)"],
  ["Production", "linear-gradient(180deg, #0C3230 0%, #17706A 100%)"],
];

export const DEFAULT_CARD_GRADIENT =
  "linear-gradient(180deg, #1C1C1C 0%, #343535 100%)";

export function cardGradientFor(badges: string[] | undefined | null): string {
  const held = badges || [];
  for (const [badge, gradient] of CARD_GRADIENTS) {
    if (held.includes(badge)) return gradient;
  }
  return DEFAULT_CARD_GRADIENT;
}
