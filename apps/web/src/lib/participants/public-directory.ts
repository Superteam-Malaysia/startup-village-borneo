import { asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { participants } from "@/lib/db/schema";
import {
  normalizeTeamCategory,
  participantInitials,
  type TeamCategory,
} from "./team-categories";

export type PublicParticipant = {
  id: string;
  name: string;
  projectIdea: string | null;
  teamSetup: string | null;
  teamCategory: TeamCategory;
  telegram: string | null;
  proofOfWork: string | null;
  joinedAt: string | null;
  initials: string;
};

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

export function firstUrl(text: string | null | undefined): string | null {
  if (!text?.trim()) return null;
  const match = text.match(/https?:\/\/[^\s,)"']+/i);
  return match?.[0] ?? null;
}

export function telegramHref(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const handle = trimmed.replace(/^@/, "");
  return handle ? `https://t.me/${handle}` : null;
}
