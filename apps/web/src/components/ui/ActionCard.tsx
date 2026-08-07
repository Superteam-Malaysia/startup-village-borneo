import type { ReactNode } from "react";
import { CtaButton } from "./CtaButton";

type CardTone = "null" | "mint" | "azure";

export type ActionCardProps = {
  title: string;
  description?: string;
  tone?: CardTone;
  aspect?: "square" | "5-4";
  accentText?: boolean;
  cta?: { label: string; href?: string; variant?: "byte" | "azure" | "ghost-null" };
  children?: ReactNode;
};

const toneClass: Record<CardTone, string> = {
  null: "bp-card--null",
  mint: "bp-card--mint",
  azure: "bp-card--azure",
};

/** EL-35 / EL-36 — ticket & action cards from Breakpoint archive. */
export function ActionCard({
  title,
  description,
  tone = "null",
  aspect = "5-4",
  accentText,
  cta,
  children,
}: ActionCardProps) {
  return (
    <div
      className={[
        "bp-card",
        aspect === "square" ? "bp-card--square" : "bp-card--5-4",
        toneClass[tone],
        accentText ? "bp-card--null-accent" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <h3 className="text-label text-label-accent">{title}</h3>
      <div className="mt-auto flex flex-col gap-8">
        {description && (
          <p className="font-[family-name:var(--font-mono)] text-sm tracking-[0.075rem]">{description}</p>
        )}
        {children}
        {cta && (
          <CtaButton
            href={cta.href}
            variant={cta.variant ?? (tone === "mint" ? "ghost-null" : "azure")}
            size="sm"
            fullWidth
            external={cta.href?.startsWith("http")}
          >
            {cta.label}
          </CtaButton>
        )}
      </div>
    </div>
  );
}
