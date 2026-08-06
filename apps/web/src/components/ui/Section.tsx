import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-eyebrow">{children}</p>;
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
  return (
    <h2
      className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,4rem)] leading-[1.18] tracking-[0.04em] text-[var(--color-wisp)]"
    >
      {children}
    </h2>
  );
}

export function SectionIntro({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex flex-col gap-8 sm:gap-12">
      <Eyebrow>{eyebrow}</Eyebrow>
      <SectionHeading>{title}</SectionHeading>
    </div>
  );
}
