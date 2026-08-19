import { asc, eq, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { participants, teamMembers, teams } from "@/lib/db/schema";
import { participantInitials } from "@/lib/participants/team-categories";
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

export async function getPublicTeams(): Promise<PublicTeam[]> {
  if (!process.env.DATABASE_URL) return [];

  const db = getDb();
  const teamRows = await db.select().from(teams).orderBy(asc(teams.name));

  const result: PublicTeam[] = [];
  for (const team of teamRows) {
    const members = await db
      .select({
        id: participants.id,
        name: participants.name,
        firstName: participants.firstName,
        lastName: participants.lastName,
        role: teamMembers.role,
      })
      .from(teamMembers)
      .innerJoin(participants, eq(teamMembers.participantId, participants.id))
      .where(eq(teamMembers.teamId, team.id))
      .orderBy(asc(participants.name));

    result.push({
      id: team.id,
      slug: team.slug,
      name: team.name,
      tagline: team.tagline,
      description: team.description,
      category: team.category,
      websiteUrl: team.websiteUrl,
      proofUrl: team.proofUrl,
      memberCount: members.length,
      members: members.map((m) => {
        const name = displayName(m);
        return {
          id: m.id,
          name,
          initials: participantInitials(name),
          role: m.role,
        };
      }),
    });
  }

  return result;
}

export async function getPublicTeamBySlug(slug: string): Promise<PublicTeam | null> {
  const all = await getPublicTeams();
  return all.find((t) => t.slug === slug) ?? null;
}

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
