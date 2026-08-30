import { TeamForm, TeamMemberEditor } from "@/components/teams";
import type { PublicTeam } from "@/lib/teams/types";

type TeamManageSectionProps = {
  slug: string;
  team: PublicTeam;
  /** Raw DB value (HTTPS URL or legacy /uploads path), not the display-resolved URL. */
  storedLogoUrl?: string | null;
};

export function TeamManageSection({ slug, team, storedLogoUrl }: TeamManageSectionProps) {
  return (
    <div className="team-manage">
      <TeamForm
        mode="edit"
        slug={slug}
        inline
        logoFallback={team.name.slice(0, 2).toUpperCase()}
        initial={{
          name: team.name,
          tagline: team.tagline ?? "",
          description: team.description ?? "",
          category: team.category ?? "Other",
          websiteUrl: team.websiteUrl ?? "",
          proofUrl: team.proofUrl ?? "",
          logoUrl: storedLogoUrl ?? "",
        }}
      />
      <TeamMemberEditor slug={slug} initialMembers={team.members} />
    </div>
  );
}
