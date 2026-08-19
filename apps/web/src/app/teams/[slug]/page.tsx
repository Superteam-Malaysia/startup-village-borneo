import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TeamDetailActions } from "@/components/teams/TeamDetailActions";
import { TeamMemberCards } from "@/components/teams/TeamMemberCards";
import { SectionArticle } from "@/components/ui";
import { getPublicParticipantsByIds } from "@/lib/participants/public-directory";
import { getPublicTeamBySlug } from "@/lib/teams/public-teams";
import { getDb } from "@/lib/db";
import { teams } from "@/lib/db/schema";

export const revalidate = 60;

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

export async function generateStaticParams() {
  if (!process.env.DATABASE_URL) return [];

  const db = getDb();
  const rows = await db.select({ slug: teams.slug }).from(teams);
  return rows.map((row) => ({ slug: row.slug }));
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

            <TeamDetailActions slug={slug} />
          </div>
        </SectionArticle>
      </div>
    </main>
  );
}
