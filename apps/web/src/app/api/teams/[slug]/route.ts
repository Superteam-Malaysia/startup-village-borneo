import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getParticipantForSession } from "@/lib/auth/participant";
import { getDb } from "@/lib/db";
import { teams } from "@/lib/db/schema";
import { requireTeamEditor } from "@/lib/teams/access";
import { getPublicTeamBySlug, getTeamRecordBySlug } from "@/lib/teams/public-teams";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  const team = await getPublicTeamBySlug(slug);
  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }
  return NextResponse.json({ team });
}

export async function PATCH(request: Request, { params }: Params) {
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

  const body = (await request.json()) as {
    name?: string;
    tagline?: string;
    description?: string;
    category?: string;
    websiteUrl?: string;
    proofUrl?: string;
  };

  const db = getDb();
  await db
    .update(teams)
    .set({
      name: body.name?.trim() || record.name,
      tagline: body.tagline?.trim() ?? record.tagline,
      description: body.description?.trim() ?? record.description,
      category: body.category?.trim() ?? record.category,
      websiteUrl: body.websiteUrl?.trim() ?? record.websiteUrl,
      proofUrl: body.proofUrl?.trim() ?? record.proofUrl,
      updatedAt: new Date(),
    })
    .where(eq(teams.id, record.id));

  const updated = await getPublicTeamBySlug(slug);
  return NextResponse.json({ team: updated });
}
