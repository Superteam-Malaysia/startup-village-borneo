"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { firstUrl, telegramHref, type PublicParticipant } from "@/lib/participants/types";
import {
  formatJoinedDate,
  TEAM_FILTER_TABS,
  teamCategoryLabel,
  type TeamCategory,
} from "@/lib/participants/team-categories";

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BriefcaseIcon() {
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

function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 19c0-3 2.5-5 6-5s6 2 6 5M16 8a2.5 2.5 0 013 0M19 19c0-2-1.5-3.5-3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
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

function ParticipantCard({ person }: { person: PublicParticipant }) {
  const tg = telegramHref(person.telegram);
  const proofUrl = firstUrl(person.proofOfWork);
  const joined = formatJoinedDate(person.joinedAt);
  const teamLabel = teamCategoryLabel(person.teamCategory, person.teamSetup);

  return (
    <article className="builder-card">
      <div className="builder-card__top">
        <div className="builder-card__avatar" aria-hidden="true">
          {person.initials}
        </div>
        {tg ? (
          <Link
            href={tg}
            className="builder-card__connect"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ConnectIcon />
            Connect
          </Link>
        ) : (
          <span className="builder-card__connect builder-card__connect--disabled">Connect</span>
        )}
      </div>

      <h2 className="builder-card__name">{person.name}</h2>

      <ul className="builder-card__meta">
        <li>
          <BriefcaseIcon />
          <span className={person.projectIdea ? undefined : "builder-card__muted"}>
            {person.projectIdea ?? "Project details coming soon."}
          </span>
        </li>
        <li>
          <UsersIcon />
          <span>{teamLabel}</span>
        </li>
        {joined ? (
          <li>
            <CalendarIcon />
            <span>{joined}</span>
          </li>
        ) : null}
      </ul>

      {proofUrl ? (
        <Link
          href={proofUrl}
          className="builder-card__proof"
          target="_blank"
          rel="noopener noreferrer"
        >
          Proof of work
        </Link>
      ) : null}
    </article>
  );
}

function filterParticipants(
  people: PublicParticipant[],
  query: string,
  category: TeamCategory,
): PublicParticipant[] {
  const q = query.trim().toLowerCase();

  return people.filter((person) => {
    if (category !== "all" && person.teamCategory !== category) return false;
    if (!q) return true;

    const haystack = [
      person.name,
      person.projectIdea,
      person.teamSetup,
      teamCategoryLabel(person.teamCategory, person.teamSetup),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}

export function ParticipantDirectoryClient({ people }: { people: PublicParticipant[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<TeamCategory>("all");

  const counts = useMemo(() => {
    const map = new Map<TeamCategory, number>();
    map.set("all", people.length);
    for (const person of people) {
      map.set(person.teamCategory, (map.get(person.teamCategory) ?? 0) + 1);
    }
    return map;
  }, [people]);

  const visibleTabs = useMemo(
    () =>
      TEAM_FILTER_TABS.filter((tab) => tab.id === "all" || (counts.get(tab.id) ?? 0) > 0),
    [counts],
  );

  const filtered = useMemo(
    () => filterParticipants(people, query, category),
    [people, query, category],
  );

  return (
    <div className="builder-directory">
      <div className="builder-directory__toolbar">
        <label className="builder-directory__search">
          <SearchIcon />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, project, or team"
            aria-label="Search builders"
          />
        </label>

        <div className="builder-directory__tabs" role="tablist" aria-label="Filter by team setup">
          {visibleTabs.map((tab) => {
            const count = counts.get(tab.id) ?? 0;
            const active = category === tab.id;
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
                onClick={() => setCategory(tab.id)}
              >
                {tab.label}
                <span className="builder-directory__tab-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="builder-directory__summary">
        {filtered.length} of {people.length} builders
        {category !== "all" ? ` · ${teamCategoryLabel(category, null)}` : ""}
      </p>

      {filtered.length === 0 ? (
        <p className="builder-directory__empty-results">No builders match this search.</p>
      ) : (
        <ul className="builder-directory__grid">
          {filtered.map((person) => (
            <li key={person.id}>
              <ParticipantCard person={person} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
