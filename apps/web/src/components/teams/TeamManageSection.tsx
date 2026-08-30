import { TeamForm, TeamMemberEditor } from "@/components/teams";
import type { PublicTeam } from "@/lib/teams/types";

type TeamManageSectionProps = {
  slug: string;
  team: PublicTeam;
};

export function TeamManageSection({ slug, team }: TeamManageSectionProps) {
  return (
    <div className="team-manage">
      <TeamForm
        mode="edit"
        slug={slug}
        inline
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
  );
}
