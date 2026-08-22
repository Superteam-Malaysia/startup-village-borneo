import { NextResponse } from "next/server";
import { getParticipantForSession } from "@/lib/auth/participant";
import { getTeamMembership } from "@/lib/teams/access";
import { getTeamRecordBySlug } from "@/lib/teams/public-teams";
import { listTeamRaceSubmissions, upsertTeamRaceSubmission } from "@/lib/race/submissions";
import { validateRaceSubmissionInput } from "@/lib/race/validation";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  const participant = await getParticipantForSession();
  if (!participant) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const record = await getTeamRecordBySlug(slug);
  if (!record) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  const membership = await getTeamMembership(record.id, participant.id);
  if (!membership) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const submissions = await listTeamRaceSubmissions(record.id);
  return NextResponse.json({ submissions });
}

export async function POST(request: Request, { params }: Params) {
  const { slug } = await params;
  const participant = await getParticipantForSession();
  if (!participant) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const record = await getTeamRecordBySlug(slug);
  if (!record) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  const membership = await getTeamMembership(record.id, participant.id);
  if (!membership) {
    return NextResponse.json({ error: "You must be on this team to submit." }, { status: 403 });
  }

  const body = (await request.json()) as { taskId?: string; threadUrl?: string };
  const validation = validateRaceSubmissionInput(body.taskId ?? "", body.threadUrl ?? "");
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const row = await upsertTeamRaceSubmission({
    teamId: record.id,
    taskId: validation.taskId,
    threadUrl: validation.threadUrl,
    submittedBy: participant.id,
  });

  return NextResponse.json({
    submission: {
      id: row.id,
      taskId: row.taskId,
      threadUrl: row.threadUrl,
      submittedAt: row.submittedAt.toISOString(),
    },
  });
}
