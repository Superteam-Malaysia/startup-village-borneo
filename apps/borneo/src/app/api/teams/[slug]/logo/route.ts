import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getParticipantForSession } from "@/lib/auth/participant";
import { getDb } from "@/lib/db";
import { teams } from "@/lib/db/schema";
import { requireTeamEditor } from "@/lib/teams/access";
import { getTeamRecordBySlug } from "@/lib/teams/public-teams";
import { saveTeamLogo } from "@/lib/uploads/save-upload";
import { uploadPublicUrl } from "@/lib/uploads/public-url";

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

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
  }

  try {
    const saved = await saveTeamLogo({
      teamId: record.id,
      file,
      previousPublicPath: record.logoUrl?.startsWith("/uploads/") ? record.logoUrl : null,
    });

    const db = getDb();
    await db
      .update(teams)
      .set({ logoUrl: saved.publicPath, updatedAt: new Date() })
      .where(eq(teams.id, record.id));

    return NextResponse.json({ logoUrl: uploadPublicUrl(saved.publicPath) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
