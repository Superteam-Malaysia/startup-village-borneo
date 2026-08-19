"use client";

import Link from "next/link";
import {
  builderConnectHref,
  builderConnectLabel,
} from "@/lib/participants/social-links";
import type { PublicParticipant } from "@/lib/participants/types";

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
};

export function BuilderCard({ person }: BuilderCardProps) {
  const connectHref = builderConnectHref(person);
  const connectLabel = builderConnectLabel(person);
  const teams = person.hackathonTeams;

  return (
    <article className="builder-card mentor-card" id={`builder-${person.id}`}>
      <div className="builder-card__top">
        <div className="builder-card__avatar" aria-hidden="true">
          {person.initials}
        </div>
        {connectHref ? (
          <Link
            href={connectHref}
            className="builder-card__connect"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ConnectIcon />
            {connectLabel}
          </Link>
        ) : (
          <span className="builder-card__connect builder-card__connect--disabled">Connect</span>
        )}
      </div>

      <h2 className="builder-card__name">{person.name}</h2>
      {teams.length > 0 ? (
        <p className="mentor-card__role builder-card__team-subtext">
          {teams.map((team, index) => (
            <span key={team.slug}>
              {index > 0 ? ", " : null}
              <Link href={`/teams/${team.slug}`} className="builder-card__team-link">
                {team.name}
              </Link>
            </span>
          ))}
        </p>
      ) : null}
    </article>
  );
}
