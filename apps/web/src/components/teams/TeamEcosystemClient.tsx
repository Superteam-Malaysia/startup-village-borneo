"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TEAM_CATEGORIES, type PublicTeam } from "@/lib/teams/types";

function teamInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function cardDescription(team: PublicTeam): string {
  return team.description?.trim() || team.tagline?.trim() || "Project details coming soon.";
}

function filterTeams(teams: PublicTeam[], category: string): PublicTeam[] {
  return teams.filter((team) => category === "All" || (team.category ?? "Other") === category);
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
  const [category, setCategory] = useState<string>("All");

  const visibleCategories = useMemo(() => {
    const used = new Set(teams.map((t) => t.category ?? "Other"));
    return TEAM_CATEGORIES.filter((c) => c === "All" || used.has(c));
  }, [teams]);

  const filtered = useMemo(() => filterTeams(teams, category), [teams, category]);

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

      <p className="team-ecosystem__summary">
        {filtered.length} of {teams.length} teams
        {category !== "All" ? ` · ${category}` : ""}
      </p>

      {filtered.length === 0 ? (
        <p className="team-ecosystem__empty">No teams in this category.</p>
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
