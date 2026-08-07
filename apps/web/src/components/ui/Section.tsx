import type { ReactNode } from "react";

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

export function SectionHeading({ children }: { children: ReactNode }) {
  return <h2 className="section-heading">{children}</h2>;
}

export function SectionIntro({
  title,
  lead,
}: {
  title: string;
  lead?: string;
}) {
  return (
    <div className="section-intro">
      <SectionHeading>{title}</SectionHeading>
      {lead ? <p className="section-intro__lead">{lead}</p> : null}
    </div>
  );
}
