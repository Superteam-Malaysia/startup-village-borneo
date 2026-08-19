import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getParticipantForSession } from "@/lib/auth/participant";
import { getDb } from "@/lib/db";
import { participants, teamMembers } from "@/lib/db/schema";
import { requireTeamEditor } from "@/lib/teams/access";
import { getPublicTeamBySlug, getTeamRecordBySlug } from "@/lib/teams/public-teams";

type Params = { params: Promise<{ slug: string }> };

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

  const membership = await requireTeamEditor(record.id, participant.id);
  if (!membership) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as { participantId?: string; role?: string };
  const participantId = body.participantId?.trim();
  if (!participantId) {
    return NextResponse.json({ error: "participantId required" }, { status: 400 });
  }

  const db = getDb();
  const [target] = await db
    .select({ id: participants.id })
    .from(participants)
    .where(
      and(eq(participants.id, participantId), eq(participants.approvalStatus, "approved")),
    )
    .limit(1);

  if (!target) {
    return NextResponse.json({ error: "Builder not found" }, { status: 404 });
  }

  const role = body.role === "editor" ? "editor" : "member";

  await db
    .insert(teamMembers)
    .values({
      teamId: record.id,
      participantId: target.id,
      role,
    })
    .onConflictDoUpdate({
      target: [teamMembers.teamId, teamMembers.participantId],
      set: { role },
    });

  const team = await getPublicTeamBySlug(slug);
  return NextResponse.json({ team });
}

export async function DELETE(request: Request, { params }: Params) {
  const { slug } = await params;
  const participant = await getParticipantForSession();
  if (!participant) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const record = await getTeamRecordBySlug(slug);
  if (!record) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  const membership = await requireTeamEditor(record.id, participant.id);
  if (!membership) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const participantId = searchParams.get("participantId");
  if (!participantId) {
    return NextResponse.json({ error: "participantId required" }, { status: 400 });
  }

  const db = getDb();
  await db
    .delete(teamMembers)
    .where(
      and(eq(teamMembers.teamId, record.id), eq(teamMembers.participantId, participantId)),
    );

  const team = await getPublicTeamBySlug(slug);
  return NextResponse.json({ team });
}
