import { NextResponse } from "next/server";
import { getParticipantForSession } from "@/lib/auth/participant";
import { requireOrganizerApi } from "@/lib/auth/organizer";
import { listAllRaceSubmissionsForAdmin } from "@/lib/race/submissions";

export async function GET() {
  const participant = await getParticipantForSession();
  const auth = requireOrganizerApi(participant);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const submissions = await listAllRaceSubmissionsForAdmin();
  return NextResponse.json({ submissions });
}
