import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TeamMemberCards } from "@/components/teams/TeamMemberCards";
import { CtaButton, SectionArticle } from "@/components/ui";
import { getParticipantForSession } from "@/lib/auth/participant";
import { getPublicParticipantsByIds } from "@/lib/participants/public-directory";
import { canEditTeam, getTeamMembership } from "@/lib/teams/access";
import { getPublicTeamBySlug } from "@/lib/teams/public-teams";

export const dynamic = "force-dynamic";

type TeamDetailPageProps = {
  params: Promise<{ slug: string }>;
};

function teamInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export async function generateMetadata({ params }: TeamDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const team = await getPublicTeamBySlug(slug);
  if (!team) return { title: "Team not found" };
  return {
    title: team.name,
    description: team.tagline ?? team.description ?? `${team.name} — SVB 2026`,
  };
}

export default async function TeamDetailPage({ params }: TeamDetailPageProps) {
  const { slug } = await params;
  const team = await getPublicTeamBySlug(slug);
  if (!team) notFound();

  const participant = await getParticipantForSession();
  const membership = participant
    ? await getTeamMembership(team.id, participant.id)
    : null;
  const canEdit = canEditTeam(membership?.role);
  const category = team.category ?? "Other";
  const memberIds = team.members.map((m) => m.id);
  const memberProfiles = await getPublicParticipantsByIds(memberIds);
  const websiteUrl = team.websiteUrl ?? team.proofUrl;

  return (
    <main className="site-main site-main--stack">
      <div className="max-w-[90rem] mx-auto px-4 md:px-8 py-16 md:py-24 w-full">
        <SectionArticle>
          <div className="team-detail">
            <Link href="/teams" className="team-detail__back">
              <span aria-hidden="true">&lt;</span> Back to teams
            </Link>

            <div className="team-detail__hero">
              <div className="team-detail__logo-frame">
                <span className="team-detail__logo-corner team-detail__logo-corner--tl" />
                <span className="team-detail__logo-corner team-detail__logo-corner--tr" />
                <span className="team-detail__logo-corner team-detail__logo-corner--bl" />
                <span className="team-detail__logo-corner team-detail__logo-corner--br" />
                <div className="team-detail__logo" aria-hidden="true">
                  {teamInitials(team.name)}
                </div>
              </div>

              <div>
                <h1 className="team-detail__title">{team.name}</h1>
                <p className="team-detail__meta">
                  <span className="team-detail__badge">{category}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {team.memberCount} {team.memberCount === 1 ? "member" : "members"}
                  </span>
                </p>

                {websiteUrl ? (
                  <div className="team-detail__links">
                    <a
                      href={websiteUrl}
                      className="team-detail__link-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Website
                      <ExternalIcon />
                    </a>
                  </div>
                ) : null}
              </div>
            </div>

            {(team.description || team.tagline) && (
              <p className="team-detail__description">
                {team.description?.trim() || team.tagline}
              </p>
            )}

            <section>
              <h2 className="team-detail__section-label">Team</h2>
              <TeamMemberCards members={memberProfiles} />
            </section>

            <div className="flex flex-wrap gap-4">
              {canEdit ? (
                <CtaButton href={`/teams/${slug}/edit`} variant="byte" size="md">
                  Edit team
                </CtaButton>
              ) : null}
              <CtaButton href="/teams" variant="ghost-wisp" size="md" showArrow={false}>
                All teams
              </CtaButton>
              <Link
                href="/teams?tab=builders"
                className="font-mono text-sm text-[var(--team-colosseum-accent,#6ee7a8)] hover:underline self-center"
              >
                Browse builders
              </Link>
            </div>
          </div>
        </SectionArticle>
      </div>
    </main>
  );
}
