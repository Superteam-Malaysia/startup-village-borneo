"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  filterMentors,
  mentorConnectHref,
  mentorConnectLabel,
  mentorPrimaryLine,
  mentorRoleLabel,
  mentorSecondaryLine,
  MENTOR_FILTER_TABS,
  type PublicMentor,
} from "@/data/mentors";
import type { MentorFilter } from "@/lib/mentors/types";

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 14a3 3 0 003-3V6a3 3 0 10-6 0v5a3 3 0 003 3zM6 11a6 6 0 0012 0M12 17v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OrgIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 7V6a2 2 0 012-2h4a2 2 0 012 2v1M4 9h16v10a2 2 0 01-2 2H6a2 2 0 01-2-2V9z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 5v2M18 5v2M4 9h16M6 5h12a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
  const hasWorkshop = mentor.workshops.length > 0;

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
      <p className="mentor-card__role">{mentorRoleLabel(mentor)}</p>

      <ul className="builder-card__meta">
        <li>
          <MicIcon />
          <span>{mentorPrimaryLine(mentor)}</span>
        </li>
        {mentor.organization ? (
          <li>
            <OrgIcon />
            <span>{mentor.organization}</span>
          </li>
        ) : null}
        {hasWorkshop ? (
          <li>
            <CalendarIcon />
            <span>{mentorSecondaryLine(mentor)}</span>
          </li>
        ) : null}
      </ul>
    </article>
  );
}

export function MentorDirectoryClient({ mentors }: { mentors: PublicMentor[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<MentorFilter>("all");

  const counts = useMemo(() => {
    const map = new Map<MentorFilter, number>();
    map.set("all", mentors.length);
    map.set("workshop", mentors.filter((m) => m.isWorkshopLeader).length);
    map.set("judge", mentors.filter((m) => m.isJudge).length);
    return map;
  }, [mentors]);

  const filtered = useMemo(
    () => filterMentors(mentors, query, filter),
    [mentors, query, filter],
  );

  const activeTab = MENTOR_FILTER_TABS.find((tab) => tab.id === filter);

  return (
    <div className="builder-directory">
      <div className="builder-directory__toolbar">
        <label className="builder-directory__search">
          <SearchIcon />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search mentors, workshops, orgs"
            aria-label="Search mentors"
          />
        </label>

        <div className="builder-directory__tabs" role="tablist" aria-label="Filter mentors">
          {MENTOR_FILTER_TABS.map((tab) => {
            const count = counts.get(tab.id) ?? 0;
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={[
                  "builder-directory__tab",
                  active ? "builder-directory__tab--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setFilter(tab.id)}
              >
                {tab.label}
                <span className="builder-directory__tab-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="builder-directory__summary">
        {filtered.length} of {mentors.length} mentors
        {filter !== "all" && activeTab ? ` · ${activeTab.label}` : ""}
      </p>

      {filtered.length === 0 ? (
        <p className="builder-directory__empty-results">No mentors match this search.</p>
      ) : (
        <ul className="builder-directory__grid">
          {filtered.map((mentor) => (
            <li key={mentor.id}>
              <MentorCard mentor={mentor} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
