import type { ReactNode } from "react";
import { BreakoutSubhead, type SubheadAccent } from "./BreakoutSubhead";

export type { SubheadAccent };

/** @deprecated Prefer SectionIntro title-only; avoid standalone kickers. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-label">{children}</p>;
}

export function SectionArticle({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <article id={id} className={["bp-article", className].filter(Boolean).join(" ")}>
      {children}
    </article>
  );
}

export function SectionHeading({
  children,
  accent = "lime",
}: {
  children: ReactNode;
  accent?: SubheadAccent;
}) {
  return (
    <h2 className="section-heading">
      <BreakoutSubhead accent={accent}>{children}</BreakoutSubhead>
    </h2>
  );
}

export function SectionIntro({
  title,
  lead,
  accent = "lime",
}: {
  title: string;
  lead?: string;
  accent?: SubheadAccent;
}) {
  return (
    <div className="section-intro">
      <SectionHeading accent={accent}>{title}</SectionHeading>
      {lead ? <p className="section-intro__lead">{lead}</p> : null}
    </div>
  );
}
