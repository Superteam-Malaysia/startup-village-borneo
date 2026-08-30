"use client";

import { Award, Lock } from "lucide-react";
import {
  SELF_SERVICE_BADGES,
  ADMIN_ONLY_BADGES,
  BADGE_PILL_CLASS,
  BADGE_PILL_FALLBACK,
} from "@/lib/badges";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface BadgePickerProps {
  value: string[];
  onChange: (badges: string[]) => void;
}

export function BadgePicker({ value, onChange }: BadgePickerProps) {
  // Admin-assigned badges the member already holds. Shown read-only so they can
  // see them; a DB trigger keeps them from being added or dropped here anyway.
  const heldAdminBadges = ADMIN_ONLY_BADGES.filter((b) => value.includes(b));

  function toggle(badge: string) {
    onChange(
      value.includes(badge)
        ? value.filter((b) => b !== badge)
        : [...value, badge]
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>Badges</Label>
        <p className="text-xs text-muted-foreground">
          Pick the ones that describe you. They appear on your member card.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SELF_SERVICE_BADGES.map((badge) => {
          const selected = value.includes(badge);
          return (
            <button
              key={badge}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(badge)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border",
                selected
                  ? BADGE_PILL_CLASS[badge] ?? BADGE_PILL_FALLBACK
                  : "bg-[#171717] text-muted-foreground border-border/50 hover:text-white hover:border-white/20"
              )}
            >
              <Award className="w-4 h-4" />
              {badge}
            </button>
          );
        })}
      </div>

      {heldAdminBadges.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            Awarded by the team — these can&apos;t be changed here.
          </p>
          <div className="flex flex-wrap gap-2">
            {heldAdminBadges.map((badge) => (
              <span
                key={badge}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border opacity-80",
                  BADGE_PILL_CLASS[badge] ?? BADGE_PILL_FALLBACK
                )}
              >
                <Award className="w-4 h-4" />
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
