"use client";

import { ParticipantDirectoryClient } from "@/components/directory/ParticipantDirectoryClient";
import type { PublicParticipant } from "@/lib/participants/types";

export function UnassignedBuildersSection({ people }: { people: PublicParticipant[] }) {
  if (people.length === 0) return null;

  return (
    <section id="team-not-yet-defined" className="team-ecosystem__unassigned">
      <h2 className="team-ecosystem__section-label">Team not yet defined</h2>
      <p className="team-ecosystem__section-lead">
        Registered builders who are not on a hackathon team yet.
      </p>
      <ParticipantDirectoryClient people={people} />
    </section>
  );
}
