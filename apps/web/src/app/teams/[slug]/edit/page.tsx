import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { TeamForm, TeamMemberEditor } from "@/components/teams";
import { SectionArticle, SectionIntro } from "@/components/ui";
import { getParticipantForSession } from "@/lib/auth/participant";
import { requireTeamEditor } from "@/lib/teams/access";
import { getPublicTeamBySlug, getTeamRecordBySlug } from "@/lib/teams/public-teams";

export const dynamic = "force-dynamic";

type TeamEditPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: TeamEditPageProps): Promise<Metadata> {
  const { slug } = await params;
  const team = await getPublicTeamBySlug(slug);
  if (!team) return { title: "Team not found" };
  return { title: `Edit ${team.name}` };
}

export default async function TeamEditPage({ params }: TeamEditPageProps) {
  const { slug } = await params;
  const participant = await getParticipantForSession();
  if (!participant) redirect("/login");

  const record = await getTeamRecordBySlug(slug);
  if (!record) notFound();

  const membership = await requireTeamEditor(record.id, participant.id);
  if (!membership) notFound();

  const team = await getPublicTeamBySlug(slug);
  if (!team) notFound();

  return (
    <main className="site-main site-main--stack">
      <div className="max-w-[90rem] mx-auto px-4 md:px-8 py-16 md:py-24">
        <SectionArticle>
          <SectionIntro
            title={`Edit ${team.name}`}
            lead="Update your team profile and add builders from the directory."
            accent="byte"
          />
          <div className="mt-10">
            <TeamForm
              mode="edit"
              slug={slug}
              logoUrl={team.logoUrl}
              logoFallback={team.name.slice(0, 2).toUpperCase()}
              initial={{
                name: team.name,
                tagline: team.tagline ?? "",
                description: team.description ?? "",
                category: team.category ?? "Other",
                websiteUrl: team.websiteUrl ?? "",
                proofUrl: team.proofUrl ?? "",
              }}
            />
            <TeamMemberEditor slug={slug} initialMembers={team.members} />
          </div>
        </SectionArticle>
      </div>
    </main>
  );
}
