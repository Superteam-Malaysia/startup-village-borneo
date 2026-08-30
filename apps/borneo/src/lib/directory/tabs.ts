export type DirectoryTab = "teams" | "mentors";

export function parseDirectoryTab(value: string | undefined | null): DirectoryTab {
  if (value === "mentors") return "mentors";
  // Legacy ?tab=builders links fold into the teams view.
  return "teams";
}
