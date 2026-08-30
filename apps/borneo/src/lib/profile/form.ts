export type ProfileFormValues = {
  name: string;
  phoneNumber: string;
  telegram: string;
  passportFirstName: string;
  passportLastName: string;
  projectIdea: string;
  proofOfWork: string;
  teamSetup: string;
  commitmentProof: string;
  jerseySize: string;
  ownAccommodation: string;
};

export type ProfileReadonlyMeta = {
  email: string;
  approvalStatus: string | null;
  ticketName: string | null;
};

export const PROFILE_FIELD_LIMITS = {
  short: 200,
  long: 4000,
} as const;

export function participantToProfileForm(participant: {
  name: string | null;
  phoneNumber: string | null;
  telegram: string | null;
  passportFirstName: string | null;
  passportLastName: string | null;
  projectIdea: string | null;
  proofOfWork: string | null;
  teamSetup: string | null;
  commitmentProof: string | null;
  jerseySize: string | null;
  ownAccommodation: string | null;
}): ProfileFormValues {
  return {
    name: participant.name?.trim() ?? "",
    phoneNumber: participant.phoneNumber?.trim() ?? "",
    telegram: participant.telegram?.trim() ?? "",
    passportFirstName: participant.passportFirstName?.trim() ?? "",
    passportLastName: participant.passportLastName?.trim() ?? "",
    projectIdea: participant.projectIdea?.trim() ?? "",
    proofOfWork: participant.proofOfWork?.trim() ?? "",
    teamSetup: participant.teamSetup?.trim() ?? "",
    commitmentProof: participant.commitmentProof?.trim() ?? "",
    jerseySize: participant.jerseySize?.trim() ?? "",
    ownAccommodation: participant.ownAccommodation?.trim() ?? "",
  };
}

export function sanitizeProfileInput(body: Partial<ProfileFormValues>): ProfileFormValues {
  const trim = (value: unknown, max: number) =>
    typeof value === "string" ? value.trim().slice(0, max) : "";

  return {
    name: trim(body.name, PROFILE_FIELD_LIMITS.short),
    phoneNumber: trim(body.phoneNumber, PROFILE_FIELD_LIMITS.short),
    telegram: trim(body.telegram, PROFILE_FIELD_LIMITS.short),
    passportFirstName: trim(body.passportFirstName, PROFILE_FIELD_LIMITS.short),
    passportLastName: trim(body.passportLastName, PROFILE_FIELD_LIMITS.short),
    projectIdea: trim(body.projectIdea, PROFILE_FIELD_LIMITS.long),
    proofOfWork: trim(body.proofOfWork, PROFILE_FIELD_LIMITS.long),
    teamSetup: trim(body.teamSetup, PROFILE_FIELD_LIMITS.long),
    commitmentProof: trim(body.commitmentProof, PROFILE_FIELD_LIMITS.long),
    jerseySize: trim(body.jerseySize, PROFILE_FIELD_LIMITS.short),
    ownAccommodation: trim(body.ownAccommodation, PROFILE_FIELD_LIMITS.short),
  };
}
