import type { Metadata } from "next";
import { DirectoryTabsClient } from "@/components/teams/DirectoryTabsClient";
import { parseDirectoryTab } from "@/lib/directory/tabs";
import { CtaButton } from "@/components/ui";
import { PageHeader } from "@/components/shell";
import { getPublicMentors } from "@/data/mentors";
import { getParticipantForSession } from "@/lib/auth/participant";
import { getPublicParticipants } from "@/lib/participants/public-directory";
import { getPublicTeams } from "@/lib/teams/public-teams";

export const metadata: Metadata = {
  title: "Teams, Builders & Mentors",
  description:
    "Hackathon teams, registered builders, and on-stage mentors for Startup Village Borneo.",
};

export const dynamic = "force-dynamic";

type TeamsPageProps = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function TeamsPage({ searchParams }: TeamsPageProps) {
  const params = await searchParams;
  const [teams, people, mentors, participant] = await Promise.all([
    getPublicTeams(),
    getPublicParticipants(),
    Promise.resolve(getPublicMentors()),
    getParticipantForSession(),
  ]);

  return (
    <main className="site-main site-main--stack">
      <PageHeader
        title="Teams, builders & mentors"
        lead="Explore hackathon teams, registered builders, and workshop leaders plus Demo Day judges."
      />

      <DirectoryTabsClient
        initialTab={parseDirectoryTab(params.tab)}
        teams={teams}
        people={people}
        mentors={mentors}
        isSignedIn={!!participant}
      />

      <div className="flex flex-wrap gap-4">
        {!participant ? (
          <CtaButton href="/login" variant="byte" size="md">
            Sign in to your profile
          </CtaButton>
        ) : null}
        <CtaButton href="/submissions" variant="ghost-wisp" size="md" showArrow={false}>
          Submission guide
        </CtaButton>
      </div>
    </main>
  );
}
