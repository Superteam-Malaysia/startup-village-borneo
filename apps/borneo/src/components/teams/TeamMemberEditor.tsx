"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { withBasePath } from "@/lib/base-path";
import type { PublicTeamMember } from "@/lib/teams/types";

type SearchResult = {
  id: string;
  name: string;
  projectIdea: string | null;
};

type TeamMemberEditorProps = {
  slug: string;
  initialMembers: PublicTeamMember[];
};

export function TeamMemberEditor({ slug, initialMembers }: TeamMemberEditorProps) {
  const [members, setMembers] = useState(initialMembers);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const memberIdSet = useMemo(() => new Set(members.map((m) => m.id)), [members]);

  const searchBuilders = useCallback(
    async (q: string) => {
      if (!q.trim()) {
        setResults([]);
        return;
      }
      setSearching(true);
      const res = await fetch(withBasePath(`/api/participants/search?q=${encodeURIComponent(q)}`));
      const data = (await res.json()) as { results?: SearchResult[]; error?: string };
      setSearching(false);
      if (!res.ok) {
        setError(data.error ?? "Search failed.");
        return;
      }
      setResults((data.results ?? []).filter((r) => !memberIdSet.has(r.id)));
    },
    [memberIdSet],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      void searchBuilders(query);
    }, 250);
    return () => clearTimeout(timer);
  }, [query, searchBuilders]);

  async function addMember(participantId: string) {
    setError(null);
    const res = await fetch(withBasePath(`/api/teams/${slug}/members`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantId, role: "member" }),
    });
    const data = (await res.json()) as { team?: { members: PublicTeamMember[] }; error?: string };
    if (!res.ok) {
      setError(data.error ?? "Could not add member.");
      return;
    }
    if (data.team) setMembers(data.team.members);
    setQuery("");
    setResults([]);
  }

  async function removeMember(participantId: string) {
    setError(null);
    const res = await fetch(
      withBasePath(`/api/teams/${slug}/members?participantId=${participantId}`),
      { method: "DELETE" },
    );
    const data = (await res.json()) as { team?: { members: PublicTeamMember[] }; error?: string };
    if (!res.ok) {
      setError(data.error ?? "Could not remove member.");
      return;
    }
    if (data.team) setMembers(data.team.members);
  }

  return (
    <div className="team-member-editor">
      <h3 className="font-mono text-sm uppercase tracking-wider text-[color:color-mix(in_srgb,var(--color-wisp)_72%,transparent)]">
        Team members
      </h3>

      {error ? <p className="team-form__error">{error}</p> : null}

      <div className="team-member-editor__current">
        {members.map((member) => (
          <div key={member.id} className="team-member-editor__row">
            <div className="flex items-center gap-2">
              <span className="team-member-chip__avatar" aria-hidden="true">
                {member.initials}
              </span>
              <span className="team-member-chip__name">{member.name}</span>
              <span className="team-member-chip__role">{member.role}</span>
            </div>
            <button
              type="button"
              className="team-member-editor__remove"
              onClick={() => void removeMember(member.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <label className="team-form__field">
        <span className="team-form__label">Add from builder directory</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="team-form__input"
          placeholder="Search by name or project"
        />
      </label>

      {searching ? (
        <p className="text-xs font-mono text-[color:color-mix(in_srgb,var(--color-wisp)_50%,transparent)]">
          Searching…
        </p>
      ) : null}

      {results.length > 0 ? (
        <ul className="team-member-editor__results">
          {results.map((person) => (
            <li key={person.id} className="team-member-editor__result">
              <div className="team-member-editor__result-info">
                <span className="team-member-editor__result-name">{person.name}</span>
                {person.projectIdea ? (
                  <span className="team-member-editor__result-project">{person.projectIdea}</span>
                ) : null}
              </div>
              <button
                type="button"
                className="team-member-editor__add-btn"
                onClick={() => void addMember(person.id)}
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
