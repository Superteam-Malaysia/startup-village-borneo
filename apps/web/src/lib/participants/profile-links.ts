export function builderProfileHref(participantId: string): string {
  return `/teams#builder-${participantId}`;
}

export function builderProfileHash(participantId: string): string {
  return `#builder-${participantId}`;
}
