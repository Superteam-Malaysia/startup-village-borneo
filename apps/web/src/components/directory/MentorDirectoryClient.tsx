"use client";

import Image from "next/image";
import Link from "next/link";
import { mentorConnectHref, mentorConnectLabel, type PublicMentor } from "@/data/mentors";

function ConnectIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 11.5a8.4 8.4 0 01-.9 3.8 8 8 0 01-7.6 4.7 8.4 8.4 0 01-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 01-.9-3.8 8 8 0 014.7-7.6 8.4 8.4 0 013.8-.9h.5a8.5 8.5 0 018 8v.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
  const connectHref = mentorConnectHref(mentor);
  const connectLabel = mentorConnectLabel(mentor);

  return (
    <article className="builder-card mentor-card">
      <div className="builder-card__top">
        <MentorAvatar mentor={mentor} />
        {connectHref ? (
          <Link
            href={connectHref}
            className="builder-card__connect"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ConnectIcon />
            {connectLabel}
          </Link>
        ) : (
          <span className="builder-card__connect builder-card__connect--disabled">Connect</span>
        )}
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
