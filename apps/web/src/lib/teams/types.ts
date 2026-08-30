export type PublicTeamMember = {
  id: string;
  name: string;
  initials: string;
  role: string;
};

export type PublicTeam = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  category: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  proofUrl: string | null;
  memberCount: number;
  members: PublicTeamMember[];
};

export const TEAM_CATEGORIES = [
  "All",
  "DeFi",
  "Consumer",
  "Infrastructure",
  "AI",
  "Gaming",
  "Social",
  "Other",
] as const;
