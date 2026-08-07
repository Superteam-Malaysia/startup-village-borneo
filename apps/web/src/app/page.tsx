import Link from "next/link";
import {
  HomeHalftoneHeroStats,
  HomeHalftoneOverview,
  HomeRaceTeaserStats,
  HalftoneTitle,
} from "@/components/halftone";
import {
  Accordion,
  ActionCard,
  CtaButton,
  SectionArticle,
  SectionIntro,
} from "@/components/ui";
import { FAQ_ITEMS } from "@/data/faq";
import { PARTNERS } from "@/data/partners";
import { PRIZE_ROWS, PRIZE_TOTAL } from "@/data/prizes";
import { SCHEDULE_DAYS } from "@/data/schedule";
import { FEATURED_SPEAKERS } from "@/data/speakers";
import { SITE } from "@/data/site";

export default function HomePage() {
  const previewFaq = FAQ_ITEMS.slice(0, 4);

  return (
    <main>
      {/* Hero — Breakpoint-style information density + one-shot glitch accent */}
      <section className="relative border-b border-[color:var(--color-transparent-wisp-10)]">
        <div className="max-w-[90rem] mx-auto px-4 md:px-8 pt-16 md:pt-24 pb-16 md:pb-24">
          <HalftoneTitle text="Startup Village Borneo" />
          <p className="home-hero__meta">
            {SITE.dates} · Solana Foundation · SOCOE · Kuching
          </p>

          <HomeHalftoneHeroStats />

          <div className="mt-10 md:mt-12 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end max-w-5xl">
            <p className="hero-lead">{SITE.rhythm}</p>
            <div className="hero-cta-group">
              <CtaButton href="/schedule" variant="byte" size="lg">
                View schedule
              </CtaButton>
              <CtaButton href="/amazing-race" variant="ghost-wisp" size="lg" showArrow={false}>
                Amazing Race
              </CtaButton>
              <span className="hero-cta-note hidden sm:inline">Demo Day · Wed 9 Sep</span>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section id="overview" className="border-b border-[color:var(--color-transparent-wisp-10)]">
        <div className="max-w-[90rem] mx-auto px-4 md:px-8 py-16 md:py-24">
          <SectionArticle>
            <SectionIntro title="Five days of build, race, and demo" />
            <p className="mt-8 max-w-2xl text-[var(--color-wisp)]/80 leading-relaxed">
              Workshops by day at Voco, building at Sheraton by night. A points-weighted Amazing Race
              across Kuching runs in the gaps — your product comes first. Demo Day on Wednesday
              morning, prizes at noon, then depart.
            </p>
            <div className="mt-12">
              <HomeHalftoneOverview />
            </div>
          </SectionArticle>
        </div>
      </section>

      {/* Schedule preview */}
      <section id="schedule" className="border-b border-[color:var(--color-transparent-wisp-10)]">
        <div className="max-w-[90rem] mx-auto px-4 md:px-8 py-16 md:py-24">
          <SectionArticle>
            <SectionIntro title="Daily rhythm" />
            <ul className="mt-12 grid gap-4 md:grid-cols-5 list-none">
              {SCHEDULE_DAYS.map((day) => (
                <li key={day.index}>
                  <Link
                    href={`/schedule?day=${day.index}`}
                    className="block border border-[color:var(--color-transparent-wisp-10)] p-4 md:p-5 hover:border-[var(--color-byte)] transition-colors h-full"
                  >
                    <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-byte)]">
                      {day.label}
                    </p>
                    <p className="mt-2 font-[family-name:var(--font-display)] text-lg leading-snug">
                      {day.title}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-wisp)]/50">{day.subtitle}</p>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <CtaButton href="/schedule" variant="azure" size="md">Full calendar</CtaButton>
            </div>
          </SectionArticle>
        </div>
      </section>

      {/* Speakers preview */}
      <section className="border-b border-[color:var(--color-transparent-wisp-10)]">
        <div className="max-w-[90rem] mx-auto px-4 md:px-8 py-16 md:py-24">
          <SectionArticle>
            <SectionIntro title="Workshop leaders on stage" />
            <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 list-none">
              {FEATURED_SPEAKERS.slice(0, 5).map((s) => (
                <li key={s.name} className="speaker-tile">
                  <p className="font-[family-name:var(--font-display)] text-lg leading-tight">{s.name}</p>
                  <p className="mt-2 font-[family-name:var(--font-mono)] text-[0.65rem] uppercase tracking-widest text-[var(--color-byte)]">
                    {s.org}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <CtaButton href="/speakers" variant="ghost-wisp" size="md">All sessions</CtaButton>
            </div>
          </SectionArticle>
        </div>
      </section>

      {/* Amazing Race teaser */}
      <section className="border-b border-[color:var(--color-transparent-wisp-10)] bg-[var(--color-byte)]/5">
        <div className="max-w-[90rem] mx-auto px-4 md:px-8 py-16 md:py-24">
          <SectionArticle>
            <SectionIntro title="Kuching is the playground" />
            <p className="mt-8 max-w-2xl text-[var(--color-wisp)]/75 leading-relaxed">
              Points-weighted stations from laksa pilgrimages to waterfront sampan rides — plus a
              wallet onboarding mission that teaches, never sells. Submit via team Twitter threads.
              You may not finish everything; choose well.
            </p>
            <HomeRaceTeaserStats />
            <div className="mt-10 flex flex-wrap gap-4">
              <CtaButton href="/amazing-race" variant="byte" size="lg">Explore all tasks</CtaButton>
              <CtaButton href="/leaderboard" variant="ghost-wisp" size="md" showArrow={false}>
                Leaderboard
              </CtaButton>
              <CtaButton href="/submissions" variant="ghost-wisp" size="md" showArrow={false}>
                Submissions
              </CtaButton>
            </div>
          </SectionArticle>
        </div>
      </section>

      {/* Companion dApp teasers */}
      <section className="border-b border-[color:var(--color-transparent-wisp-10)]">
        <div className="max-w-[90rem] mx-auto px-4 md:px-8 py-10 md:py-12">
          <div className="grid gap-4 md:grid-cols-2 list-none">
            <ActionCard
              title="Leaderboard"
              tone="azure"
              aspect="5-4"
              description="Sample standings & halftone trends — live data at the event."
              cta={{ label: "View board", href: "/leaderboard" }}
            />
            <ActionCard
              title="Submissions"
              tone="mint"
              aspect="5-4"
              description="Race threads, decks & content rules — uploads in companion dApp."
              cta={{ label: "How to submit", href: "/submissions" }}
            />
          </div>
        </div>
      </section>

      {/* Prizes preview */}
      <section id="prizes" className="border-b border-[color:var(--color-transparent-wisp-10)]">
        <div className="max-w-[90rem] mx-auto px-4 md:px-8 py-16 md:py-24">
          <SectionArticle className="bg-[var(--color-azure)] text-[var(--color-null)]">
            <SectionIntro title={`${PRIZE_TOTAL} USD prize pool`} />
            <ul className="mt-10 grid gap-3 md:grid-cols-2 list-none">
              {PRIZE_ROWS.map((row) => (
                <li
                  key={row.label}
                  className="flex justify-between gap-4 border-b border-[var(--color-null)]/15 pb-3 font-[family-name:var(--font-mono)] text-sm uppercase tracking-wide"
                >
                  <span>{row.label}</span>
                  <span className="font-[family-name:var(--font-display)] text-lg normal-case tracking-normal">
                    {row.amount}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <CtaButton href="/prizes" variant="ghost-null" size="md">Prize breakdown</CtaButton>
            </div>
          </SectionArticle>
        </div>
      </section>

      {/* Get involved */}
      <section id="get-involved" className="border-b border-[color:var(--color-transparent-wisp-10)]">
        <div className="max-w-[90rem] mx-auto px-4 md:px-8 py-16 md:py-24">
          <SectionArticle>
            <SectionIntro title="Ways to take part" />
            <ul className="mt-10 grid gap-6 md:grid-cols-4 list-none">
              <li>
                <ActionCard title="Build" tone="mint" description="Five-day hackathon track · Demo Day pitches" />
              </li>
              <li>
                <ActionCard title="Race" tone="azure" cta={{ label: "Tasks", href: "/amazing-race" }} />
              </li>
              <li>
                <ActionCard
                  title="Sponsor"
                  tone="null"
                  accentText
                  cta={{ label: "Get involved", href: "/get-involved" }}
                />
              </li>
              <li>
                <ActionCard title="Partners" tone="mint" cta={{ label: "View all", href: "/partners" }} />
              </li>
            </ul>
          </SectionArticle>
        </div>
      </section>

      {/* Partners */}
      <section id="partners" className="border-b border-[color:var(--color-transparent-wisp-10)]">
        <div className="max-w-[90rem] mx-auto px-4 md:px-8 py-16 md:py-24">
          <SectionArticle>
            <SectionIntro title="Partners and workshops" />
            <div className="mt-10 flex flex-wrap gap-2">
              {PARTNERS.map((p) => (
                <span
                  key={p.name}
                  className={[
                    "partner-pill",
                    p.role === "anchor" ? "partner-pill--anchor" : "",
                    p.role === "pending" ? "partner-pill--pending" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {p.name}
                  {!p.workshops && p.role === "confirmed" ? " · no workshop" : ""}
                </span>
              ))}
            </div>
          </SectionArticle>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-b border-[color:var(--color-transparent-wisp-10)]">
        <div className="max-w-[90rem] mx-auto px-4 md:px-8 py-16 md:py-24">
          <SectionArticle>
            <SectionIntro title="Before you land" />
            <div className="mt-10 max-w-2xl">
              <Accordion
                items={previewFaq.map((f) => ({
                  id: f.id,
                  title: f.question,
                  content: f.answer,
                }))}
              />
            </div>
            <div className="mt-8">
              <CtaButton href="/faq" variant="ghost-wisp" size="sm" showArrow={false}>
                All questions
              </CtaButton>
            </div>
          </SectionArticle>
        </div>
      </section>
    </main>
  );
}
