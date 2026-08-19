import { and, asc, eq, inArray, notLike } from "drizzle-orm";
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

type ParticipantRow = {
  id: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  projectIdea: string | null;
  teamSetup: string | null;
  telegram: string | null;
  proofOfWork: string | null;
  lumaCreatedAt: Date | null;
};

function toPublicParticipant(row: ParticipantRow): PublicParticipant {
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
}

const participantSelect = {
  id: participants.id,
  name: participants.name,
  firstName: participants.firstName,
  lastName: participants.lastName,
  projectIdea: participants.projectIdea,
  teamSetup: participants.teamSetup,
  telegram: participants.telegram,
  proofOfWork: participants.proofOfWork,
  lumaCreatedAt: participants.lumaCreatedAt,
};

/** Public-safe participant rows for the /teams directory. */
export async function getPublicParticipants(): Promise<PublicParticipant[]> {
  if (!process.env.DATABASE_URL) return [];

  const db = getDb();
  const rows = await db
    .select(participantSelect)
    .from(participants)
    .where(and(eq(participants.approvalStatus, "approved"), notLike(participants.guestId, "staff-%")))
    .orderBy(asc(participants.name));

  return rows.map(toPublicParticipant);
}

/** Builder cards for team members — same shape as the directory. */
export async function getPublicParticipantsByIds(ids: string[]): Promise<PublicParticipant[]> {
  if (!process.env.DATABASE_URL || ids.length === 0) return [];

  const db = getDb();
  const rows = await db
    .select(participantSelect)
    .from(participants)
    .where(
      and(
        eq(participants.approvalStatus, "approved"),
        notLike(participants.guestId, "staff-%"),
        inArray(participants.id, ids),
      ),
    )
    .orderBy(asc(participants.name));

  const byId = new Map(rows.map((row) => [row.id, toPublicParticipant(row)]));
  return ids.map((id) => byId.get(id)).filter((p): p is PublicParticipant => p != null);
}
