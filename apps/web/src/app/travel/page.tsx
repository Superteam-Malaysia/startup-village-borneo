import { CtaButton, SectionArticle, SectionIntro } from "@/components/ui";
import { TRAVEL_HERO, TRAVEL_SECTIONS, TRAVEL_TIPS } from "@/data/travel";
import { SITE } from "@/data/site";

export const metadata = { title: "Travel" };

export default function TravelPage() {
  return (
    <main className="max-w-[90rem] mx-auto px-4 md:px-8 py-12 md:py-20 flex flex-col gap-16 md:gap-20">
      <header className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <div>
          <p className="text-eyebrow mb-6">Kuching · Sarawak</p>
          <h1 className="hero-display max-w-3xl">
            Travel
            <br />
            <span className="hero-display-accent">to SVB</span>
          </h1>
          <p className="mt-8 max-w-xl text-[var(--color-wisp)]/75 leading-relaxed">
            Land at KCH, check into Sheraton, and the program starts the moment you arrive. This
            page covers logistics — the Amazing Race covers the city.
          </p>
        </div>
        <div className="travel-hero-card">
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-byte)]">
            {TRAVEL_HERO.airport}
          </p>
          <p className="mt-3 font-[family-name:var(--font-display)] text-2xl">{TRAVEL_HERO.distance}</p>
          <p className="mt-4 text-sm text-[var(--color-wisp)]/55">{TRAVEL_HERO.timezone}</p>
          <p className="mt-6 text-sm text-[var(--color-wisp)]/70">{SITE.venue}</p>
        </div>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        {TRAVEL_SECTIONS.map((section) => (
          <SectionArticle
            key={section.id}
            className="border border-[color:var(--color-transparent-wisp-10)] p-6 md:p-8 h-full"
          >
            <SectionIntro eyebrow={section.id} title={section.title} />
            <ul className="mt-6 flex flex-col gap-5 list-none">
              {section.items.map((item) => (
                <li key={item.label} className="travel-detail-row">
                  <p className="font-[family-name:var(--font-mono)] text-[0.65rem] uppercase tracking-widest text-[var(--color-byte)]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-wisp)]/75 leading-relaxed">{item.detail}</p>
                </li>
              ))}
            </ul>
          </SectionArticle>
        ))}
      </div>

      <SectionArticle className="bg-[var(--color-azure)] text-[var(--color-null)] p-8 md:p-10">
        <SectionIntro eyebrow="Tips" title="Before you land" />
        <ul className="mt-8 grid gap-4 md:grid-cols-2 list-none">
          {TRAVEL_TIPS.map((tip) => (
            <li
              key={tip}
              className="font-[family-name:var(--font-mono)] text-sm leading-relaxed border-l-2 border-[var(--color-null)]/25 pl-4"
            >
              {tip}
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-4">
          <CtaButton href="/venue" variant="ghost-null" size="md">Venue & map</CtaButton>
          <CtaButton href="/amazing-race" variant="ghost-null" size="md" showArrow={false}>
            Amazing Race
          </CtaButton>
        </div>
      </SectionArticle>
    </main>
  );
}
