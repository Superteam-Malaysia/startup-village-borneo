export type DirectoryTab = "teams" | "builders" | "mentors";

export function parseDirectoryTab(value: string | undefined | null): DirectoryTab {
  if (value === "builders" || value === "mentors") return value;
  return "teams";
}
