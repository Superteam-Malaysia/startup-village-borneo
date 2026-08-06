import { CtaButton, SectionArticle, SectionIntro } from "@/components/ui";
import { SUSTAINABILITY_TRACK } from "@/data/tracks";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Sustainability track",
  description:
    "SOCOE-aligned sustainability track — 2×$500 prizes. Criteria announced Day 2 at Startup Village Borneo.",
  path: "/sustainability",
});

export default function SustainabilityPage() {
  return (
    <main className="max-w-[90rem] mx-auto px-4 md:px-8 py-12 md:py-20 flex flex-col gap-16">
      <header>
        <p className="text-eyebrow mb-6">SOCOE · opt in on Day 2</p>
        <h1 className="hero-display max-w-4xl">
          <span className="hero-display-accent">Sustainability</span>
          <br />
          track
        </h1>
        <p className="mt-8 max-w-2xl text-[var(--color-wisp)]/75 leading-relaxed text-lg">
          {SUSTAINABILITY_TRACK.summary}
        </p>
      </header>

      <SectionArticle className="bg-[var(--color-azure)] text-[var(--color-null)] p-8 md:p-10">
        <SectionIntro eyebrow="Prize" title={`${SUSTAINABILITY_TRACK.prizes.count}×${SUSTAINABILITY_TRACK.prizes.amount}`} />
        <p className="mt-4 text-[var(--color-null)]/80">{SUSTAINABILITY_TRACK.total} total · judged on Demo Day</p>
      </SectionArticle>

      <SectionArticle>
        <SectionIntro eyebrow="Criteria" title="What judges look for" />
        <ul className="mt-8 flex flex-col gap-4 list-none">
          {SUSTAINABILITY_TRACK.criteria.map((item) => (
            <li key={item} className="border-l-2 border-[var(--color-byte)] pl-4 text-[var(--color-wisp)]/75 leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      </SectionArticle>

      <SectionArticle>
        <SectionIntro eyebrow="Timeline" title="How to participate" />
        <ul className="mt-8 flex flex-col gap-4 list-none">
          {SUSTAINABILITY_TRACK.timeline.map((step) => (
            <li key={step.when} className="grid gap-2 md:grid-cols-[8rem_1fr] border-b border-[color:var(--color-transparent-wisp-10)] pb-4">
              <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-byte)]">{step.when}</span>
              <span className="text-[var(--color-wisp)]/75">{step.what}</span>
            </li>
          ))}
        </ul>
      </SectionArticle>

      <CtaButton href="/prizes" variant="byte" size="md">All prizes</CtaButton>
    </main>
  );
}
