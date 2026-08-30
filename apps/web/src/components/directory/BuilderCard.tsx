"use client";

import Link from "next/link";
import { ConnectLink } from "@/components/directory/ConnectLink";
import { ParticipantAvatar } from "@/components/directory/ParticipantAvatar";
import {
  builderConnectHref,
  builderConnectLabel,
} from "@/lib/participants/social-links";
import type { PublicParticipant } from "@/lib/participants/types";

export type BuilderCardProps = {
  person: PublicParticipant;
};

export function BuilderCard({ person }: BuilderCardProps) {
  const teams = person.hackathonTeams;

  return (
    <article className="builder-card mentor-card" id={`builder-${person.id}`}>
      <div className="builder-card__top">
        <ParticipantAvatar avatarUrl={person.avatarUrl} initials={person.initials} />
        <ConnectLink href={builderConnectHref(person)} label={builderConnectLabel(person)} />
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
