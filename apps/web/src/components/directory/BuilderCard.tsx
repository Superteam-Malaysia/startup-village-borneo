"use client";

import Link from "next/link";
import { firstUrl, telegramHref, type PublicParticipant } from "@/lib/participants/types";
import { teamCategoryLabel } from "@/lib/participants/team-categories";
import { builderProfileHref } from "@/lib/participants/profile-links";

function BriefcaseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 7V6a2 2 0 012-2h4a2 2 0 012 2v1M4 9h16v10a2 2 0 01-2 2H6a2 2 0 01-2-2V9z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 19c0-3 2.5-5 6-5s6 2 6 5M16 8a2.5 2.5 0 013 0M19 19c0-2-1.5-3.5-3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ConnectIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 11.5a8.4 8.4 0 01-.9 3.8 8 8 0 01-7.6 4.7 8.4 8.4 0 01-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 01-.9-3.8 8 8 0 014.7-7.6 8.4 8.4 0 013.8-.9h.5a8.5 8.5 0 018 8v.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type BuilderCardProps = {
  person: PublicParticipant;
  /** Link name to builder directory entry. Defaults to on when unset. */
  linkToProfile?: boolean;
  /** Team detail member cards — hide project row; team description covers it. */
  variant?: "default" | "team-section";
};

function TeamLinks({ teams }: { teams: PublicParticipant["hackathonTeams"] }) {
  if (teams.length === 0) {
    return <span className="builder-card__muted">No team yet</span>;
  }

  return (
    <span className="builder-card__team-links">
      {teams.map((team, index) => (
        <span key={team.slug}>
          {index > 0 ? ", " : null}
          <Link href={`/teams/${team.slug}`} className="builder-card__team-link">
            {team.name}
          </Link>
        </span>
      ))}
    </span>
  );
}

export function BuilderCard({
  person,
  linkToProfile = true,
  variant = "default",
}: BuilderCardProps) {
  const tg = telegramHref(person.telegram);
  const proofUrl = firstUrl(person.proofOfWork);
  const profileHref = linkToProfile ? builderProfileHref(person.id) : null;
  const isTeamSection = variant === "team-section";
  const teamLinks = person.hackathonTeams;
  const fallbackTeamLabel = teamCategoryLabel(person.teamCategory, person.teamSetup);

  return (
    <article className="builder-card" id={`builder-${person.id}`}>
      <div className="builder-card__top">
        <div className="builder-card__avatar" aria-hidden="true">
          {person.initials}
        </div>
        {tg ? (
          <Link
            href={tg}
            className="builder-card__connect"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ConnectIcon />
            Connect
          </Link>
        ) : (
          <span className="builder-card__connect builder-card__connect--disabled">Connect</span>
        )}
      </div>

      {profileHref ? (
        <Link href={profileHref} className="builder-card__name-link">
          <h2 className="builder-card__name">{person.name}</h2>
        </Link>
      ) : (
        <h2 className="builder-card__name">{person.name}</h2>
      )}

      <ul className="builder-card__meta">
        {!isTeamSection ? (
          <li>
            <BriefcaseIcon />
            <span className={person.projectIdea ? undefined : "builder-card__muted"}>
              {person.projectIdea ?? "Project details coming soon."}
            </span>
          </li>
        ) : null}
        <li>
          <UsersIcon />
          {teamLinks.length > 0 ? (
            <TeamLinks teams={teamLinks} />
          ) : (
            <span>{fallbackTeamLabel}</span>
          )}
        </li>
      </ul>

      {proofUrl ? (
        <Link
          href={proofUrl}
          className="builder-card__proof"
          target="_blank"
          rel="noopener noreferrer"
        >
          Proof of work
        </Link>
      ) : null}
    </article>
  );
}
