/** Normalized team filter buckets from Luma `teamSetup` free text. */
export type TeamCategory =
  | "all"
  | "solo"
  | "team-of-2"
  | "team-of-3"
  | "team-of-4"
  | "looking-for-team"
  | "other";

export const TEAM_FILTER_TABS: { id: TeamCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "solo", label: "Solo" },
  { id: "team-of-2", label: "Team of 2" },
  { id: "team-of-3", label: "Team of 3" },
  { id: "team-of-4", label: "Team of 4" },
  { id: "looking-for-team", label: "Looking for team" },
];

export function normalizeTeamCategory(teamSetup: string | null | undefined): TeamCategory {
  const raw = teamSetup?.trim().toLowerCase() ?? "";
  if (!raw) return "other";
  if (raw === "solo") return "solo";
  if (raw === "no" || raw.includes("looking for") || raw.includes("need a team")) {
    return "looking-for-team";
  }
  if (raw.includes("team of 2") || raw.includes("team of two")) return "team-of-2";
  if (raw.includes("team of 3") || raw.includes("team of three")) return "team-of-3";
  if (raw.includes("team of 4") || raw.includes("team of four")) return "team-of-4";
  return "other";
}

export function teamCategoryLabel(category: TeamCategory, teamSetup: string | null): string {
  if (category === "all") return "All";
  if (category === "looking-for-team") return "Looking for team";
  if (category === "other") return teamSetup?.trim() || "Other";
  return TEAM_FILTER_TABS.find((t) => t.id === category)?.label ?? "Other";
}

export function participantInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

export function formatJoinedDate(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return `Joined ${date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
}
