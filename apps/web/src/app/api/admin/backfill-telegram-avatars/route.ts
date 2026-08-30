import { NextResponse } from "next/server";
import { getParticipantForSession } from "@/lib/auth/participant";
import { requireOrganizerApi } from "@/lib/auth/organizer";
import { runTelegramAvatarBackfill } from "@/lib/uploads/backfill-telegram-avatars";

export async function POST(request: Request) {
  const participant = await getParticipantForSession();
  const auth = requireOrganizerApi(participant);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const url = new URL(request.url);
  const dryRun = url.searchParams.get("dryRun") === "1";

  const result = await runTelegramAvatarBackfill({ dryRun });
  return NextResponse.json({ result });
}
