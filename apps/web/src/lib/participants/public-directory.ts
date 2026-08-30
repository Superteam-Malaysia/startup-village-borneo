import { and, asc, eq, inArray, notLike } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { participants, teamMembers, teams } from "@/lib/db/schema";
import {
  normalizeTeamCategory,
  participantInitials,
} from "./team-categories";
import { builderSocialLinks } from "./social-links";
import { uploadPublicUrl } from "@/lib/uploads/public-url";
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
  avatarUrl: string | null;
};

function toPublicParticipant(
  row: ParticipantRow,
  hackathonTeams: PublicParticipant["hackathonTeams"] = [],
): PublicParticipant {
  const name = displayName(row);
  const social = builderSocialLinks({
    proofOfWork: row.proofOfWork,
    projectIdea: row.projectIdea,
  });
  return {
    id: row.id,
    name,
    projectIdea: row.projectIdea,
    teamSetup: row.teamSetup,
    teamCategory: normalizeTeamCategory(row.teamSetup),
    telegram: row.telegram,
    twitter: social.twitter,
    linkedin: social.linkedin,
    joinedAt: row.lumaCreatedAt?.toISOString() ?? null,
    initials: participantInitials(name),
    avatarUrl: uploadPublicUrl(row.avatarUrl),
    hackathonTeams,
  };
}

async function hackathonTeamsByParticipantId(
  participantIds: string[],
): Promise<Map<string, PublicParticipant["hackathonTeams"]>> {
  const map = new Map<string, PublicParticipant["hackathonTeams"]>();
  if (!process.env.DATABASE_URL || participantIds.length === 0) return map;

  const db = getDb();
  const rows = await db
    .select({
      participantId: teamMembers.participantId,
      name: teams.name,
      slug: teams.slug,
    })
    .from(teamMembers)
    .innerJoin(teams, eq(teamMembers.teamId, teams.id))
    .where(inArray(teamMembers.participantId, participantIds))
    .orderBy(asc(teams.name));

  for (const row of rows) {
    const existing = map.get(row.participantId) ?? [];
    existing.push({ name: row.name, slug: row.slug });
    map.set(row.participantId, existing);
  }

  return map;
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
  avatarUrl: participants.avatarUrl,
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

  const teamMap = await hackathonTeamsByParticipantId(rows.map((row) => row.id));
  return rows.map((row) => toPublicParticipant(row, teamMap.get(row.id) ?? []));
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

  const teamMap = await hackathonTeamsByParticipantId(ids);
  const byId = new Map(
    rows.map((row) => [row.id, toPublicParticipant(row, teamMap.get(row.id) ?? [])]),
  );
  return ids.map((id) => byId.get(id)).filter((p): p is PublicParticipant => p != null);
}
