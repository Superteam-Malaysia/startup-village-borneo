import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { participants, raceSubmissions, teamMembers, teams } from "@/lib/db/schema";
import { getRaceTask } from "@/lib/race/validation";

export type PublicRaceSubmission = {
  id: string;
  taskId: string;
  threadUrl: string;
  submittedAt: string;
  taskTitle: string;
  taskNumber: number;
};

export type AdminRaceSubmission = PublicRaceSubmission & {
  teamId: string;
  teamSlug: string;
  teamName: string;
  submitterName: string | null;
  submitterEmail: string | null;
};

export async function listTeamRaceSubmissions(teamId: string): Promise<PublicRaceSubmission[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(raceSubmissions)
    .where(eq(raceSubmissions.teamId, teamId))
    .orderBy(desc(raceSubmissions.submittedAt));

  return rows.flatMap((row) => {
    const task = getRaceTask(row.taskId);
    if (!task) return [];
    return [
      {
        id: row.id,
        taskId: row.taskId,
        threadUrl: row.threadUrl,
        submittedAt: row.submittedAt.toISOString(),
        taskTitle: task.title,
        taskNumber: task.number,
      },
    ];
  });
}

export async function upsertTeamRaceSubmission(input: {
  teamId: string;
  taskId: string;
  threadUrl: string;
  submittedBy: string;
}) {
  const db = getDb();
  const now = new Date();

  const [row] = await db
    .insert(raceSubmissions)
    .values({
      teamId: input.teamId,
      taskId: input.taskId,
      threadUrl: input.threadUrl,
      submittedBy: input.submittedBy,
      submittedAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [raceSubmissions.teamId, raceSubmissions.taskId],
      set: {
        threadUrl: input.threadUrl,
        submittedBy: input.submittedBy,
        updatedAt: now,
      },
    })
    .returning();

  return row;
}

export async function listAllRaceSubmissionsForAdmin(): Promise<AdminRaceSubmission[]> {
  const db = getDb();
  const rows = await db
    .select({
      id: raceSubmissions.id,
      teamId: raceSubmissions.teamId,
      taskId: raceSubmissions.taskId,
      threadUrl: raceSubmissions.threadUrl,
      submittedAt: raceSubmissions.submittedAt,
      teamSlug: teams.slug,
      teamName: teams.name,
      submitterName: participants.name,
      submitterEmail: participants.email,
    })
    .from(raceSubmissions)
    .innerJoin(teams, eq(raceSubmissions.teamId, teams.id))
    .leftJoin(participants, eq(raceSubmissions.submittedBy, participants.id))
    .orderBy(desc(raceSubmissions.submittedAt));

  return rows.flatMap((row) => {
    const task = getRaceTask(row.taskId);
    if (!task) return [];
    return [
      {
        id: row.id,
        teamId: row.teamId,
        teamSlug: row.teamSlug,
        teamName: row.teamName,
        taskId: row.taskId,
        threadUrl: row.threadUrl,
        submittedAt: row.submittedAt.toISOString(),
        taskTitle: task.title,
        taskNumber: task.number,
        submitterName: row.submitterName,
        submitterEmail: row.submitterEmail,
      },
    ];
  });
}

export async function listParticipantTeams(participantId: string) {
  const db = getDb();
  return db
    .select({
      teamId: teams.id,
      slug: teams.slug,
      name: teams.name,
      role: teamMembers.role,
    })
    .from(teamMembers)
    .innerJoin(teams, eq(teamMembers.teamId, teams.id))
    .where(eq(teamMembers.participantId, participantId))
    .orderBy(teams.name);
}
