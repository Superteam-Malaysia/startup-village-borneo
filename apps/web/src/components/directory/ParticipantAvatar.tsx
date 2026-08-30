"use client";

import { useState } from "react";

type ParticipantAvatarProps = {
  avatarUrl: string | null | undefined;
  initials: string;
  className?: string;
  photoClassName?: string;
};

/** Renders profile photo with initials fallback when the URL is missing or broken. */
export function ParticipantAvatar({
  avatarUrl,
  initials,
  className = "builder-card__avatar",
  photoClassName = "mentor-card__photo",
}: ParticipantAvatarProps) {
  const [failed, setFailed] = useState(false);

  if (avatarUrl && !failed) {
    return (
      <div className={`${className} builder-card__avatar--photo`} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarUrl}
          alt=""
          className={photoClassName}
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className={className} aria-hidden="true">
      {initials}
    </div>
  );
}
