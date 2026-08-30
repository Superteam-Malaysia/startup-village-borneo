"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CtaButton } from "@/components/ui";
import { withBasePath } from "@/lib/base-path";

type TeamDetailActionsProps = {
  slug: string;
};

export function TeamDetailActions({ slug }: TeamDetailActionsProps) {
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(withBasePath(`/api/teams/${slug}/edit-access`))
      .then((res) => (res.ok ? res.json() : { canEdit: false }))
      .then((data: { canEdit?: boolean }) => {
        if (!cancelled) setCanEdit(Boolean(data.canEdit));
      })
      .catch(() => {
        if (!cancelled) setCanEdit(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <div className="flex flex-wrap gap-4">
      {canEdit ? (
        <CtaButton href={`/teams/${slug}/edit`} variant="byte" size="md">
          Edit team
        </CtaButton>
      ) : null}
      <CtaButton href="/teams" variant="ghost-wisp" size="md" showArrow={false}>
        All teams
      </CtaButton>
      <Link
        href="/teams#team-not-yet-defined"
        className="font-mono text-sm text-[var(--team-colosseum-accent,#6ee7a8)] hover:underline self-center"
      >
        Browse unassigned builders
      </Link>
    </div>
  );
}
