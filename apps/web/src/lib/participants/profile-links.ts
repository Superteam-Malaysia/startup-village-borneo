export function builderProfileHref(participantId: string): string {
  return `/teams?tab=builders#builder-${participantId}`;
}

export function builderProfileHash(participantId: string): string {
  return `#builder-${participantId}`;
}
