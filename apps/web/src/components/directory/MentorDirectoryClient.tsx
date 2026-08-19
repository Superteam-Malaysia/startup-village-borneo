"use client";

import Image from "next/image";
import { ConnectLink } from "@/components/directory/ConnectLink";
import { mentorConnectHref, mentorConnectLabel, type PublicMentor } from "@/data/mentors";

function MentorAvatar({ mentor }: { mentor: PublicMentor }) {
  if (mentor.avatar) {
    return (
      <div className="builder-card__avatar builder-card__avatar--photo">
        <Image src={mentor.avatar} alt="" width={88} height={88} className="mentor-card__photo" />
      </div>
    );
  }

  return (
    <div className="builder-card__avatar" aria-hidden="true">
      {mentor.initials}
    </div>
  );
}

function MentorCard({ mentor }: { mentor: PublicMentor }) {
  return (
    <article className="builder-card mentor-card">
      <div className="builder-card__top">
        <MentorAvatar mentor={mentor} />
        <ConnectLink href={mentorConnectHref(mentor)} label={mentorConnectLabel(mentor)} />
      </div>

      <h2 className="builder-card__name">{mentor.name}</h2>
      {mentor.organization ? (
        <p className="mentor-card__role">{mentor.organization}</p>
      ) : null}
    </article>
  );
}

export function MentorDirectoryClient({ mentors }: { mentors: PublicMentor[] }) {
  return (
    <div className="builder-directory">
      <ul className="builder-directory__grid">
        {mentors.map((mentor) => (
          <li key={mentor.id}>
            <MentorCard mentor={mentor} />
          </li>
        ))}
      </ul>
    </div>
  );
}
