"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MentorDirectoryClient } from "@/components/directory/MentorDirectoryClient";
import { TeamEcosystemClient } from "@/components/teams/TeamEcosystemClient";
import { UnassignedBuildersSection } from "@/components/teams/UnassignedBuildersSection";
import { CtaButton, SectionArticle } from "@/components/ui";
import type { PublicMentor } from "@/lib/mentors/types";
import { getUnassignedBuilders } from "@/lib/participants/unassigned-builders";
import type { PublicParticipant } from "@/lib/participants/types";
import type { PublicTeam } from "@/lib/teams/types";
import { withBasePath } from "@/lib/base-path";
import type { DirectoryTab } from "@/lib/directory/tabs";

type DirectoryTabsClientProps = {
  initialTab: DirectoryTab;
  teams: PublicTeam[];
  people: PublicParticipant[];
  mentors: PublicMentor[];
  isSignedIn: boolean;
};

function syncTabUrl(tab: DirectoryTab) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (tab === "teams") url.searchParams.delete("tab");
  else url.searchParams.set("tab", tab);
  const next = `${url.pathname}${url.search}`;
  if (`${window.location.pathname}${window.location.search}` !== next) {
    window.history.replaceState(window.history.state, "", next);
  }
}

function scrollToBuilderHash() {
  const hash = window.location.hash;
  if (!hash.startsWith("#builder-")) return;
  document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "center" });
}

export function DirectoryTabsClient({
  initialTab,
  teams,
  people,
  mentors,
  isSignedIn,
}: DirectoryTabsClientProps) {
  const [tab, setTabState] = useState<DirectoryTab>(initialTab);
  const unassigned = useMemo(() => getUnassignedBuilders(people), [people]);

  const setTab = useCallback((next: DirectoryTab) => {
    setTabState(next);
    syncTabUrl(next);
  }, []);

  useEffect(() => {
    syncTabUrl(tab);
  }, [tab]);

  useEffect(() => {
    if (!window.location.hash.startsWith("#builder-")) return;
    setTabState("teams");
    window.requestAnimationFrame(scrollToBuilderHash);
  }, []);

  useEffect(() => {
    if (tab === "teams" && window.location.hash.startsWith("#builder-")) {
      window.requestAnimationFrame(scrollToBuilderHash);
    }
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

        {unassigned.length > 0 ? (
          <SectionArticle className="team-ecosystem__unassigned-wrap">
            <UnassignedBuildersSection people={unassigned} />
          </SectionArticle>
        ) : null}
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
          <Link href="/login" className="text-[var(--color-byte)] hover:underline">
            Sign in
          </Link>{" "}
          to create a team and add builders from the directory.
        </p>
      ) : null}
    </>
  );
}
