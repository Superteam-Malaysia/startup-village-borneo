import { and, eq, or } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { teamMembers, teams } from "@/lib/db/schema";
import type { TeamMemberRole } from "@/lib/db/schema";

export async function getTeamMembership(teamId: string, participantId: string) {
  const db = getDb();
  const [row] = await db
    .select()
    .from(teamMembers)
    .where(
      and(eq(teamMembers.teamId, teamId), eq(teamMembers.participantId, participantId)),
    )
    .limit(1);
  return row ?? null;
}

export function canEditTeam(role: TeamMemberRole | string | null | undefined): boolean {
  return role === "owner" || role === "editor";
}

export async function requireTeamEditor(teamId: string, participantId: string) {
  const membership = await getTeamMembership(teamId, participantId);
  if (!membership || !canEditTeam(membership.role)) {
    return null;
  }
  return membership;
}

export async function listEditableTeamIds(participantId: string): Promise<string[]> {
  const db = getDb();
  const rows = await db
    .select({ teamId: teamMembers.teamId })
    .from(teamMembers)
    .where(
      and(
        eq(teamMembers.participantId, participantId),
        or(eq(teamMembers.role, "owner"), eq(teamMembers.role, "editor")),
      ),
    );
  return rows.map((r) => r.teamId);
}

export async function listEditableTeamSlugs(participantId: string): Promise<string[]> {
  const db = getDb();
  const rows = await db
    .select({ slug: teams.slug })
    .from(teamMembers)
    .innerJoin(teams, eq(teamMembers.teamId, teams.id))
    .where(
      and(
        eq(teamMembers.participantId, participantId),
        or(eq(teamMembers.role, "owner"), eq(teamMembers.role, "editor")),
      ),
    );
  return rows.map((r) => r.slug);
}
