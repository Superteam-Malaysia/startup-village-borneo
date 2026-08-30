import { NextResponse } from "next/server";
import { getParticipantForSession } from "@/lib/auth/participant";
import { searchParticipantsForTeam } from "@/lib/teams/public-teams";

export async function GET(request: Request) {
  const participant = await getParticipantForSession();
  if (!participant) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const results = await searchParticipantsForTeam(q);

  return NextResponse.json({
    results: results.map((r) => {
      const name =
        r.name?.trim() ||
        [r.firstName, r.lastName].filter(Boolean).join(" ").trim() ||
        "Builder";
      return {
        id: r.id,
        name,
        projectIdea: r.projectIdea,
      };
    }),
  });
}
