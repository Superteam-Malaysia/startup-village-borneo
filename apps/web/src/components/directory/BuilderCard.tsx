"use client";

import Link from "next/link";
import { firstUrl, telegramHref, type PublicParticipant } from "@/lib/participants/types";
import {
  formatJoinedDate,
  teamCategoryLabel,
} from "@/lib/participants/team-categories";
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

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 5v2M18 5v2M4 9h16M6 5h12a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2z"
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
  /** Overrides the team-setup row — e.g. owner/editor on a hackathon team. */
  teamRole?: string | null;
  /** Link name to builder directory entry. Defaults to on when unset. */
  linkToProfile?: boolean;
};

export function BuilderCard({ person, teamRole, linkToProfile = true }: BuilderCardProps) {
  const tg = telegramHref(person.telegram);
  const proofUrl = firstUrl(person.proofOfWork);
  const joined = formatJoinedDate(person.joinedAt);
  const teamLabel =
    teamRole?.trim() ||
    teamCategoryLabel(person.teamCategory, person.teamSetup);
  const profileHref = linkToProfile ? builderProfileHref(person.id) : null;

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
        <li>
          <BriefcaseIcon />
          <span className={person.projectIdea ? undefined : "builder-card__muted"}>
            {person.projectIdea ?? "Project details coming soon."}
          </span>
        </li>
        <li>
          <UsersIcon />
          <span>{teamLabel}</span>
        </li>
        {joined ? (
          <li>
            <CalendarIcon />
            <span>{joined}</span>
          </li>
        ) : null}
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
