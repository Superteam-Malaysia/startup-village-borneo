import type { Metadata } from "next";
import { Suspense } from "react";
import { ParticipantDirectoryClient } from "@/components/directory/ParticipantDirectoryClient";
import { DirectoryTabsClient, TeamEcosystemClient } from "@/components/teams";
import { CtaButton, SectionArticle } from "@/components/ui";
import { PageHeader } from "@/components/shell";
import { getParticipantForSession } from "@/lib/auth/participant";
import { getPublicParticipants } from "@/lib/participants/public-directory";
import { getPublicTeams } from "@/lib/teams/public-teams";

export const metadata: Metadata = {
  title: "Teams & Builders",
  description:
    "Hackathon teams and registered builders for Startup Village Borneo — find projects and collaborators before Day 1.",
};

export const dynamic = "force-dynamic";

export default async function TeamsPage() {
  const [teams, people, participant] = await Promise.all([
    getPublicTeams(),
    getPublicParticipants(),
    getParticipantForSession(),
  ]);

  const teamsPanel =
    teams.length === 0 ? (
      <SectionArticle className="team-ecosystem__empty">
        <p className="text-sm text-[var(--color-wisp)]/60 max-w-xl">
          No teams yet.{" "}
          {participant ? (
            <>Create one to showcase your project.</>
          ) : (
            <>
              <a href="/login" className="text-[var(--color-byte)] hover:underline">
                Sign in
              </a>{" "}
              to create a team.
            </>
          )}
        </p>
      </SectionArticle>
    ) : (
      <SectionArticle>
        <TeamEcosystemClient teams={teams} />
      </SectionArticle>
    );

  const buildersPanel =
    people.length === 0 ? (
      <SectionArticle className="builder-directory__empty">
        <p className="text-sm text-[var(--color-wisp)]/60 max-w-xl">
          Participant directory syncs from Luma registration. Check back once imports are live.
        </p>
      </SectionArticle>
    ) : (
      <SectionArticle>
        <ParticipantDirectoryClient people={people} />
      </SectionArticle>
    );

  return (
    <main className="site-main site-main--stack">
      <PageHeader
        meta="SVB 2026 · ecosystem"
        title="Teams & builders"
        lead="Explore hackathon teams in Base ecosystem style, or browse every registered builder to find collaborators."
      />

      <Suspense fallback={null}>
        <DirectoryTabsClient
          teamsPanel={teamsPanel}
          buildersPanel={buildersPanel}
          isSignedIn={!!participant}
        />
      </Suspense>

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
