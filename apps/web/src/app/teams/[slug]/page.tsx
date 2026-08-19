import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaButton, SectionArticle } from "@/components/ui";
import { PageHeader } from "@/components/shell";
import { getParticipantForSession } from "@/lib/auth/participant";
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

  return (
    <main className="site-main site-main--stack">
      <PageHeader
        meta={team.category ?? "Team"}
        title={team.name}
        lead={team.tagline ?? undefined}
      />

      <SectionArticle>
        <div className="team-detail">
          <div className="team-detail__hero">
            <div className="team-detail__logo" aria-hidden="true">
              {teamInitials(team.name)}
            </div>
            <div>
              <div className="team-detail__meta">
                <span className="team-card__category">{team.category ?? "Other"}</span>
                <span className="team-card__members">
                  {team.memberCount} {team.memberCount === 1 ? "member" : "members"}
                </span>
              </div>
              {(team.websiteUrl || team.proofUrl) && (
                <div className="team-detail__links mt-3">
                  {team.websiteUrl ? (
                    <a
                      href={team.websiteUrl}
                      className="team-detail__link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Website
                    </a>
                  ) : null}
                  {team.proofUrl ? (
                    <a
                      href={team.proofUrl}
                      className="team-detail__link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Proof of work
                    </a>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {team.description ? (
            <p className="team-detail__description">{team.description}</p>
          ) : null}

          <section className="team-detail__members">
            <h2 className="font-mono text-sm uppercase tracking-wider text-[color:color-mix(in_srgb,var(--color-wisp)_72%,transparent)]">
              Members
            </h2>
            <ul className="team-detail__members-list">
              {team.members.map((member) => (
                <li key={member.id}>
                  <span className="team-member-chip">
                    <span className="team-member-chip__avatar" aria-hidden="true">
                      {member.initials}
                    </span>
                    <span className="team-member-chip__name">{member.name}</span>
                    <span className="team-member-chip__role">{member.role}</span>
                  </span>
                </li>
              ))}
            </ul>
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
              className="font-mono text-sm text-[var(--color-byte)] hover:underline self-center"
            >
              Browse builders
            </Link>
          </div>
        </div>
      </SectionArticle>
    </main>
  );
}
