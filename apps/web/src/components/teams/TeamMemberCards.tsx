import { BuilderCard } from "@/components/directory/BuilderCard";
import type { PublicParticipant } from "@/lib/participants/types";

type TeamMemberCardsProps = {
  members: PublicParticipant[];
  roles: Record<string, string>;
};

export function TeamMemberCards({ members, roles }: TeamMemberCardsProps) {
  if (members.length === 0) return null;

  const roleLabel = (id: string) => {
    const role = roles[id];
    if (!role) return null;
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <ul className="builder-directory__grid">
      {members.map((person) => (
        <li key={person.id}>
          <BuilderCard person={person} teamRole={roleLabel(person.id)} />
        </li>
      ))}
    </ul>
  );
}
