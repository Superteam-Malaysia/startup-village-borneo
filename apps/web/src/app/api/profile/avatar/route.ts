import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getParticipantForSession } from "@/lib/auth/participant";
import { getDb } from "@/lib/db";
import { participants } from "@/lib/db/schema";
import { saveParticipantAvatar } from "@/lib/uploads/save-upload";
import { uploadPublicUrl } from "@/lib/uploads/public-url";

export async function POST(request: Request) {
  const participant = await getParticipantForSession();
  if (!participant) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
  }

  try {
    const saved = await saveParticipantAvatar({
      participantId: participant.id,
      file,
      previousPublicPath: participant.avatarUrl?.startsWith("/uploads/")
        ? participant.avatarUrl
        : null,
    });

    const db = getDb();
    await db
      .update(participants)
      .set({ avatarUrl: saved.publicPath, updatedAt: new Date() })
      .where(eq(participants.id, participant.id));

    return NextResponse.json({ avatarUrl: uploadPublicUrl(saved.publicPath) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
