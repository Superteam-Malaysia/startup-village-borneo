import type { Metadata } from "next";
import { RacePageContent } from "@/components/race";
import { getParticipantForSession } from "@/lib/auth/participant";
import { isOrganizer } from "@/lib/auth/organizer";
import { listParticipantTeams, listTeamRaceSubmissions } from "@/lib/race/submissions";
import { isRaceCutoffPassed } from "@/lib/race/validation";

export const metadata: Metadata = {
  title: "Amazing Race · Startup Village Borneo",
  description:
    "Sixteen race stations across Kuching — food, culture, waterfront, photobooth, and wallet onboarding. Hard cutoff Day 4 at 18:00 MYT.",
};

export const dynamic = "force-dynamic";

export default async function AmazingRacePage() {
  const participant = await getParticipantForSession();
  let submission = null;

  if (participant) {
    const teams = await listParticipantTeams(participant.id);
    const initialTeam = teams[0] ?? null;
    const initialSubmissions = initialTeam
      ? await listTeamRaceSubmissions(initialTeam.teamId)
      : [];

    submission = {
      teams,
      initialTeamSlug: initialTeam?.slug ?? null,
      initialSubmissions,
      cutoffPassed: isRaceCutoffPassed(),
    };
  }

  return (
    <main className="site-main site-main--stack">
      <RacePageContent
        isSignedIn={!!participant}
        isOrganizer={participant ? isOrganizer(participant) : false}
        submission={submission}
      />
    </main>
  );
}
