import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getParticipantForSession } from "@/lib/auth/participant";
import { getDb } from "@/lib/db";
import { teamMembers, teams } from "@/lib/db/schema";
import { getPublicTeams, slugExists } from "@/lib/teams/public-teams";
import { slugifyTeamName } from "@/lib/teams/slug";

export async function GET() {
  const teamsList = await getPublicTeams();
  return NextResponse.json({ teams: teamsList });
}

export async function POST(request: Request) {
  const participant = await getParticipantForSession();
  if (!participant) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const body = (await request.json()) as {
    name?: string;
    tagline?: string;
    description?: string;
    category?: string;
    websiteUrl?: string;
    proofUrl?: string;
  };

  const name = body.name?.trim();
  if (!name) {
    return NextResponse.json({ error: "Team name is required" }, { status: 400 });
  }

  let slug = slugifyTeamName(name);
  if (!slug) slug = "team";
  let suffix = 0;
  while (await slugExists(slug)) {
    suffix += 1;
    slug = `${slugifyTeamName(name)}-${suffix}`;
  }

  const db = getDb();
  const [team] = await db
    .insert(teams)
    .values({
      slug,
      name,
      tagline: body.tagline?.trim() || null,
      description: body.description?.trim() || null,
      category: body.category?.trim() || "Other",
      websiteUrl: body.websiteUrl?.trim() || null,
      proofUrl: body.proofUrl?.trim() || null,
      createdBy: participant.id,
      updatedAt: new Date(),
    })
    .returning();

  await db.insert(teamMembers).values({
    teamId: team.id,
    participantId: participant.id,
    role: "owner",
  });

  return NextResponse.json({ team: { id: team.id, slug: team.slug, name: team.name } });
}
