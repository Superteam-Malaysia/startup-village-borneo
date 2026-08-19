"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useCallback } from "react";
import { CtaButton } from "@/components/ui";

type TabId = "teams" | "builders";

type DirectoryTabsClientProps = {
  teamsPanel: ReactNode;
  buildersPanel: ReactNode;
  isSignedIn: boolean;
};

export function DirectoryTabsClient({
  teamsPanel,
  buildersPanel,
  isSignedIn,
}: DirectoryTabsClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = (searchParams.get("tab") === "builders" ? "builders" : "teams") as TabId;

  const setTab = useCallback(
    (next: TabId) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === "teams") {
        params.delete("tab");
      } else {
        params.set("tab", next);
      }
      const qs = params.toString();
      router.replace(qs ? `/teams?${qs}` : "/teams", { scroll: false });
    },
    [router, searchParams],
  );

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
        {teamsPanel}
      </div>

      <div
        className="directory-panel"
        role="tabpanel"
        hidden={tab !== "builders"}
        aria-hidden={tab !== "builders"}
      >
        {buildersPanel}
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
