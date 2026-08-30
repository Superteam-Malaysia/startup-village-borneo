import type { Participant } from "@/lib/db/schema";

export type NavAuthLink = {
  href: string;
  label: string;
};

export function navAuthLink(participant: Participant | null): NavAuthLink {
  if (!participant) {
    return { href: "/login", label: "Sign in" };
  }

  const label =
    participant.firstName?.trim() ||
    participant.name?.trim()?.split(/\s+/)[0] ||
    "Profile";

  return { href: "/profile", label };
}
