"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TEAM_CATEGORIES, type PublicTeam } from "@/lib/teams/types";

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function teamInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function cardDescription(team: PublicTeam): string {
  return team.description?.trim() || team.tagline?.trim() || "Project details coming soon.";
}

function filterTeams(teams: PublicTeam[], query: string, category: string): PublicTeam[] {
  const q = query.trim().toLowerCase();
  return teams.filter((team) => {
    if (category !== "All" && (team.category ?? "Other") !== category) return false;
    if (!q) return true;
    const haystack = [team.name, team.tagline, team.description, team.category]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

function TeamCard({ team }: { team: PublicTeam }) {
  const category = team.category ?? "Other";

  return (
    <Link href={`/teams/${team.slug}`} className="team-card">
      <div className="team-card__inner">
        <div className="team-card__head">
          <div className="team-card__logo" aria-hidden="true">
            {teamInitials(team.name)}
          </div>
          <div className="team-card__title-wrap">
            <h2 className="team-card__name">{team.name}</h2>
            <p className="team-card__meta">
              <span className="team-card__badge">{category}</span>
              <span className="team-card__meta-dot" aria-hidden="true">
                ·
              </span>
              <span>
                {team.memberCount} {team.memberCount === 1 ? "member" : "members"}
              </span>
            </p>
          </div>
        </div>
        <p className="team-card__desc">{cardDescription(team)}</p>
      </div>
    </Link>
  );
}

export function TeamEcosystemClient({ teams }: { teams: PublicTeam[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const visibleCategories = useMemo(() => {
    const used = new Set(teams.map((t) => t.category ?? "Other"));
    return TEAM_CATEGORIES.filter((c) => c === "All" || used.has(c));
  }, [teams]);

  const filtered = useMemo(
    () => filterTeams(teams, query, category),
    [teams, query, category],
  );

  const categoryCount = useMemo(() => {
    const set = new Set(teams.map((t) => t.category ?? "Other"));
    return set.size;
  }, [teams]);

  return (
    <div className="team-ecosystem">
      <ul className="team-ecosystem__stats" aria-label="Directory stats">
        <li className="team-ecosystem__stat">
          <span className="team-ecosystem__stat-value">{teams.length}</span>
          <span className="team-ecosystem__stat-label">Teams</span>
        </li>
        <li className="team-ecosystem__stat">
          <span className="team-ecosystem__stat-value">{categoryCount}</span>
          <span className="team-ecosystem__stat-label">Categories</span>
        </li>
      </ul>

      <div className="team-ecosystem__toolbar">
        <label className="team-ecosystem__search">
          <SearchIcon />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teams and projects"
            aria-label="Search teams"
          />
        </label>

        <div className="team-ecosystem__filters" role="tablist" aria-label="Filter by category">
          {visibleCategories.map((cat) => {
            const active = category === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active}
                className={[
                  "team-ecosystem__filter",
                  active ? "team-ecosystem__filter--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <p className="team-ecosystem__summary">
        {filtered.length} of {teams.length} teams
        {category !== "All" ? ` · ${category}` : ""}
      </p>

      {filtered.length === 0 ? (
        <p className="team-ecosystem__empty">No teams match this search.</p>
      ) : (
        <ul className="team-ecosystem__grid">
          {filtered.map((team) => (
            <li key={team.id}>
              <TeamCard team={team} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
