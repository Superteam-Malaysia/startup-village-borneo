import { asc, eq, inArray, sql } from "drizzle-orm";
import { cache } from "react";
import { getDb } from "@/lib/db";
import { participants, teamMembers, teams } from "@/lib/db/schema";
import { participantInitials } from "@/lib/participants/team-categories";
import { uploadPublicUrl } from "@/lib/uploads/public-url";
import type { PublicTeam, PublicTeamMember } from "@/lib/teams/types";

export type { PublicTeam, PublicTeamMember } from "@/lib/teams/types";
export { TEAM_CATEGORIES } from "@/lib/teams/types";

function displayName(row: {
  name: string | null;
  firstName: string | null;
  lastName: string | null;
}): string {
  const fromParts = [row.firstName, row.lastName].filter(Boolean).join(" ").trim();
  return row.name?.trim() || fromParts || "Builder";
}

function mapMember(row: {
  id: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  role: string;
}): PublicTeamMember {
  const name = displayName(row);
  return {
    id: row.id,
    name,
    initials: participantInitials(name),
    role: row.role,
  };
}

function mapTeamRow(
  team: typeof teams.$inferSelect,
  members: PublicTeamMember[],
): PublicTeam {
  return {
    id: team.id,
    slug: team.slug,
    name: team.name,
    tagline: team.tagline,
    description: team.description,
    category: team.category,
    logoUrl: uploadPublicUrl(team.logoUrl),
    websiteUrl: team.websiteUrl,
    proofUrl: team.proofUrl,
    memberCount: members.length,
    members,
  };
}

async function fetchMembersByTeamIds(teamIds: string[]) {
  if (!process.env.DATABASE_URL || teamIds.length === 0) {
    return new Map<string, PublicTeamMember[]>();
  }

  const db = getDb();
  const rows = await db
    .select({
      teamId: teamMembers.teamId,
      id: participants.id,
      name: participants.name,
      firstName: participants.firstName,
      lastName: participants.lastName,
      role: teamMembers.role,
    })
    .from(teamMembers)
    .innerJoin(participants, eq(teamMembers.participantId, participants.id))
    .where(inArray(teamMembers.teamId, teamIds))
    .orderBy(asc(participants.name));

  const membersByTeam = new Map<string, PublicTeamMember[]>();
  for (const row of rows) {
    const list = membersByTeam.get(row.teamId) ?? [];
    list.push(mapMember(row));
    membersByTeam.set(row.teamId, list);
  }

  return membersByTeam;
}

export async function getPublicTeams(): Promise<PublicTeam[]> {
  if (!process.env.DATABASE_URL) return [];

  const db = getDb();
  const teamRows = await db.select().from(teams).orderBy(asc(teams.name));
  if (teamRows.length === 0) return [];

  const membersByTeam = await fetchMembersByTeamIds(teamRows.map((team) => team.id));

  return teamRows.map((team) =>
    mapTeamRow(team, membersByTeam.get(team.id) ?? []),
  );
}

export const getPublicTeamBySlug = cache(async (slug: string): Promise<PublicTeam | null> => {
  if (!process.env.DATABASE_URL) return null;

  const db = getDb();
  const [team] = await db.select().from(teams).where(eq(teams.slug, slug)).limit(1);
  if (!team) return null;

  const membersByTeam = await fetchMembersByTeamIds([team.id]);
  return mapTeamRow(team, membersByTeam.get(team.id) ?? []);
});

export async function getTeamRecordBySlug(slug: string) {
  if (!process.env.DATABASE_URL) return null;
  const db = getDb();
  const [team] = await db.select().from(teams).where(eq(teams.slug, slug)).limit(1);
  return team ?? null;
}

export async function slugExists(slug: string, excludeTeamId?: string): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;
  const db = getDb();
  const rows = await db
    .select({ id: teams.id })
    .from(teams)
    .where(eq(teams.slug, slug))
    .limit(1);
  if (rows.length === 0) return false;
  if (excludeTeamId && rows[0].id === excludeTeamId) return false;
  return true;
}

export async function searchParticipantsForTeam(query: string, limit = 12) {
  if (!process.env.DATABASE_URL || !query.trim()) return [];
  const db = getDb();
  const pattern = `%${query.trim()}%`;
  return db
    .select({
      id: participants.id,
      name: participants.name,
      firstName: participants.firstName,
      lastName: participants.lastName,
      projectIdea: participants.projectIdea,
    })
    .from(participants)
    .where(
      sql`${participants.approvalStatus} = 'approved' AND (
        ${participants.name} ILIKE ${pattern}
        OR ${participants.email} ILIKE ${pattern}
        OR ${participants.projectIdea} ILIKE ${pattern}
      )`,
    )
    .limit(limit);
}
