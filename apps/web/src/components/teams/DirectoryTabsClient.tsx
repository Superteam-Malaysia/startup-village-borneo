"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { MentorDirectoryClient } from "@/components/directory/MentorDirectoryClient";
import { ParticipantDirectoryClient } from "@/components/directory/ParticipantDirectoryClient";
import { TeamEcosystemClient } from "@/components/teams/TeamEcosystemClient";
import { CtaButton, SectionArticle } from "@/components/ui";
import type { PublicMentor } from "@/lib/mentors/types";
import type { PublicParticipant } from "@/lib/participants/types";
import type { PublicTeam } from "@/lib/teams/types";
import { withBasePath } from "@/lib/base-path";

type TabId = "teams" | "builders" | "mentors";

type DirectoryTabsClientProps = {
  initialTab: TabId;
  teams: PublicTeam[];
  people: PublicParticipant[];
  mentors: PublicMentor[];
  isSignedIn: boolean;
};

function syncTabUrl(tab: TabId) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (tab === "teams") url.searchParams.delete("tab");
  else url.searchParams.set("tab", tab);
  const next = `${url.pathname}${url.search}`;
  if (`${window.location.pathname}${window.location.search}` !== next) {
    window.history.replaceState(window.history.state, "", next);
  }
}

export function DirectoryTabsClient({
  initialTab,
  teams,
  people,
  mentors,
  isSignedIn,
}: DirectoryTabsClientProps) {
  const [tab, setTabState] = useState<TabId>(initialTab);

  const setTab = useCallback((next: TabId) => {
    setTabState(next);
    syncTabUrl(next);
  }, []);

  useEffect(() => {
    syncTabUrl(tab);
  }, [tab]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
        <div className="directory-tabs" role="tablist" aria-label="Directory views">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "teams"}
            className={[
              "directory-tabs__tab",
              tab === "teams" ? "directory-tabs__tab--active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setTab("teams")}
          >
            Teams
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "builders"}
            className={[
              "directory-tabs__tab",
              tab === "builders" ? "directory-tabs__tab--active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setTab("builders")}
          >
            Builders
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "mentors"}
            className={[
              "directory-tabs__tab",
              tab === "mentors" ? "directory-tabs__tab--active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setTab("mentors")}
          >
            Mentors
          </button>
        </div>

        {tab === "teams" && isSignedIn ? (
          <CtaButton href="/teams/new" variant="byte" size="sm">
            Create team
          </CtaButton>
        ) : null}
      </div>

      <div
        className="directory-panel"
        role="tabpanel"
        hidden={tab !== "teams"}
        aria-hidden={tab !== "teams"}
      >
        {teams.length === 0 ? (
          <SectionArticle className="team-ecosystem__empty">
            <p className="text-sm text-[var(--color-wisp)]/60 max-w-xl">
              No teams yet.{" "}
              {isSignedIn ? (
                <>Create one to showcase your project.</>
              ) : (
                <>
                  <Link href="/login" className="text-[var(--color-byte)] hover:underline">
                    Sign in
                  </Link>{" "}
                  to create a team.
                </>
              )}
            </p>
          </SectionArticle>
        ) : (
          <SectionArticle>
            <TeamEcosystemClient teams={teams} />
          </SectionArticle>
        )}
      </div>

      <div
        className="directory-panel"
        role="tabpanel"
        hidden={tab !== "builders"}
        aria-hidden={tab !== "builders"}
      >
        {people.length === 0 ? (
          <SectionArticle className="builder-directory__empty">
            <p className="text-sm text-[var(--color-wisp)]/60 max-w-xl">
              Participant directory syncs from Luma registration. Check back once imports are live.
            </p>
          </SectionArticle>
        ) : (
          <SectionArticle>
            <ParticipantDirectoryClient people={people} />
          </SectionArticle>
        )}
      </div>

      <div
        className="directory-panel"
        role="tabpanel"
        hidden={tab !== "mentors"}
        aria-hidden={tab !== "mentors"}
      >
        <SectionArticle>
          <MentorDirectoryClient mentors={mentors} />
        </SectionArticle>
      </div>

      {!isSignedIn && tab === "teams" ? (
        <p className="mt-6 text-sm text-[color:color-mix(in_srgb,var(--color-wisp)_65%,transparent)]">
          <Link href={withBasePath("/login")} className="text-[var(--color-byte)] hover:underline">
            Sign in
          </Link>{" "}
          to create a team and add builders from the directory.
        </p>
      ) : null}
    </>
  );
}

export function parseDirectoryTab(value: string | undefined | null): TabId {
  if (value === "builders" || value === "mentors") return value;
  return "teams";
}
