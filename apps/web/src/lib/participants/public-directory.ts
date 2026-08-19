import { asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { participants } from "@/lib/db/schema";
import {
  normalizeTeamCategory,
  participantInitials,
} from "./team-categories";
import type { PublicParticipant } from "./types";

export type { PublicParticipant } from "./types";
export { firstUrl, telegramHref } from "./types";

function displayName(row: {
  name: string | null;
  firstName: string | null;
  lastName: string | null;
}): string {
  const fromParts = [row.firstName, row.lastName].filter(Boolean).join(" ").trim();
  return row.name?.trim() || fromParts || "Participant";
}

/** Public-safe participant rows for the /teams directory. */
export async function getPublicParticipants(): Promise<PublicParticipant[]> {
  if (!process.env.DATABASE_URL) return [];

  const db = getDb();
  const rows = await db
    .select({
      id: participants.id,
      name: participants.name,
      firstName: participants.firstName,
      lastName: participants.lastName,
      projectIdea: participants.projectIdea,
      teamSetup: participants.teamSetup,
      telegram: participants.telegram,
      proofOfWork: participants.proofOfWork,
      lumaCreatedAt: participants.lumaCreatedAt,
    })
    .from(participants)
    .where(eq(participants.approvalStatus, "approved"))
    .orderBy(asc(participants.name));

  return rows.map((row) => {
    const name = displayName(row);
    return {
      id: row.id,
      name,
      projectIdea: row.projectIdea,
      teamSetup: row.teamSetup,
      teamCategory: normalizeTeamCategory(row.teamSetup),
      telegram: row.telegram,
      proofOfWork: row.proofOfWork,
      joinedAt: row.lumaCreatedAt?.toISOString() ?? null,
      initials: participantInitials(name),
    };
  });
}
