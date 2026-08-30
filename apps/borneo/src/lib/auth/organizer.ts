import type { Participant } from "@/lib/db/schema";
import { normalizeEmail } from "@/lib/auth/session";

function organizerEmails(): Set<string> {
  const raw = process.env.ORGANIZER_EMAILS ?? "";
  return new Set(
    raw
      .split(",")
      .map((email) => normalizeEmail(email))
      .filter(Boolean),
  );
}

/** Staff accounts and ORGANIZER_EMAILS env can review race submissions. */
export function isOrganizer(participant: Pick<Participant, "emailNormalized" | "guestId">): boolean {
  if (participant.guestId.startsWith("staff-")) return true;
  return organizerEmails().has(participant.emailNormalized);
}

export function requireOrganizerApi(participant: Participant | null) {
  if (!participant) {
    return { error: "Sign in required", status: 401 as const };
  }
  if (!isOrganizer(participant)) {
    return { error: "Forbidden", status: 403 as const };
  }
  return { participant };
}
