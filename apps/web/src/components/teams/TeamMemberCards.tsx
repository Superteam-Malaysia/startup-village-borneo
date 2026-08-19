import { BuilderCard } from "@/components/directory/BuilderCard";
import type { PublicParticipant } from "@/lib/participants/types";

type TeamMemberCardsProps = {
  members: PublicParticipant[];
};

export function TeamMemberCards({ members }: TeamMemberCardsProps) {
  if (members.length === 0) return null;

  return (
    <ul className="builder-directory__grid">
      {members.map((person) => (
        <li key={person.id}>
          <BuilderCard person={person} />
        </li>
      ))}
    </ul>
  );
}
