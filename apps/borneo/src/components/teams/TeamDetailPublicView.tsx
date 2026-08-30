import Link from "next/link";
import type { PublicTeam } from "@/lib/teams/types";

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

type TeamDetailPublicViewProps = {
  team: PublicTeam;
};

export function TeamDetailPublicView({ team }: TeamDetailPublicViewProps) {
  const category = team.category ?? "Other";
  const websiteUrl = team.websiteUrl ?? team.proofUrl;

  return (
    <>
      <div className="team-detail__hero">
        <div className="team-detail__logo-frame">
          <span className="team-detail__logo-corner team-detail__logo-corner--tl" />
          <span className="team-detail__logo-corner team-detail__logo-corner--tr" />
          <span className="team-detail__logo-corner team-detail__logo-corner--bl" />
          <span className="team-detail__logo-corner team-detail__logo-corner--br" />
          <div className="team-detail__logo" aria-hidden="true">
            {team.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={team.logoUrl} alt="" className="team-detail__logo-img" />
            ) : (
              teamInitials(team.name)
            )}
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
    </>
  );
}
