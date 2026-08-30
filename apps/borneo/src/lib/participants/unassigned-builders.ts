import type { PublicParticipant } from "./types";

/** Builders with no hackathon team membership in the directory. */
export function getUnassignedBuilders(people: PublicParticipant[]): PublicParticipant[] {
  return people.filter((person) => person.hackathonTeams.length === 0);
}
