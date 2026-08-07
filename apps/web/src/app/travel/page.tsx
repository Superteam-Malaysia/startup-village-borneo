import { CtaButton, SectionArticle, SectionIntro } from "@/components/ui";
import { PageHeader } from "@/components/shell";
import {
  GRAB_TIPS,
  KCH_AIRPORT_DETAILS,
  RACE_GEOGRAPHY_NOTE,
  TRAVEL_HERO,
  TRAVEL_SECTIONS,
  TRAVEL_TIPS,
} from "@/data/travel";
import { VENUES } from "@/data/venues";

export const metadata = {
  title: "Travel",
  description:
    "Getting to Kuching for Startup Village Borneo — KCH airport, Grab tips, Sheraton & Voco logistics, and Amazing Race geography for 5–9 September 2026.",
};

export default function TravelPage() {
  return (
    <main className="site-main site-main--stack">
      <header className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <PageHeader
          meta="Kuching · Sarawak"
          title="Travel to SVB"
          lead="Land at KCH, check into Sheraton, and the program starts the moment you arrive. This page covers logistics — the Amazing Race covers the city."
        />
        <div className="travel-hero-card">
          <p className="text-label text-label-accent">
            {TRAVEL_HERO.airport}
          </p>
          <p className="mt-2 text-label text-label-muted text-label-sm">
            {TRAVEL_HERO.airportCode}
          </p>
          <p className="mt-3 font-[family-name:var(--font-display)] text-2xl">{TRAVEL_HERO.distance}</p>
          <p className="mt-2 text-sm text-[var(--color-wisp)]/55">{TRAVEL_HERO.terminal}</p>
          <p className="mt-4 text-sm text-[var(--color-wisp)]/55">{TRAVEL_HERO.timezone}</p>
          <p className="mt-6 text-sm text-[var(--color-wisp)]/70">{VENUES.sheraton.address}</p>
        </div>
      </header>

      <SectionArticle>
        <SectionIntro title="Kuching International Airport" />
        <div className="mt-6 grid gap-6 md:grid-cols-2 text-sm text-[var(--color-wisp)]/75 leading-relaxed">
          <div>
            <p className="text-label text-label-accent text-label-sm">
              Codes &amp; location
            </p>
            <p className="mt-3">
              {KCH_AIRPORT_DETAILS.name} — {KCH_AIRPORT_DETAILS.iata} / {KCH_AIRPORT_DETAILS.icao}
            </p>
            <p className="mt-2 text-[var(--color-wisp)]/60">{KCH_AIRPORT_DETAILS.address}</p>
            <ul className="mt-4 flex flex-col gap-2 list-none">
              <li>{KCH_AIRPORT_DETAILS.driveToSheraton}</li>
              <li>{KCH_AIRPORT_DETAILS.driveToVoco}</li>
            </ul>
          </div>
          <div>
            <p className="text-label text-label-accent text-label-sm">
              Arrival flow
            </p>
            <ol className="mt-3 flex flex-col gap-3 list-decimal list-inside">
              {KCH_AIRPORT_DETAILS.arrivalFlow.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </SectionArticle>

      <div className="grid gap-8 md:grid-cols-2">
        {TRAVEL_SECTIONS.map((section) => (
          <SectionArticle
            key={section.id}
            className="border border-[color:var(--color-transparent-wisp-10)] p-6 md:p-8 h-full"
          >
            <SectionIntro title={section.title} />
            <ul className="mt-6 flex flex-col gap-5 list-none">
              {section.items.map((item) => (
                <li key={item.label} className="travel-detail-row">
                  <p className="text-label text-label-accent text-label-sm">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-wisp)]/75 leading-relaxed">{item.detail}</p>
                </li>
              ))}
            </ul>
          </SectionArticle>
        ))}
      </div>

      <SectionArticle>
        <SectionIntro title="Getting around Kuching" />
        <ul className="mt-6 grid gap-3 md:grid-cols-2 list-none">
          {GRAB_TIPS.map((tip) => (
            <li
              key={tip}
              className="font-[family-name:var(--font-mono)] text-sm leading-relaxed border-l-2 border-[var(--color-null)]/25 pl-4 text-[var(--color-wisp)]/75"
            >
              {tip}
            </li>
          ))}
        </ul>
      </SectionArticle>

      <SectionArticle className="bg-[var(--color-azure)] text-[var(--color-null)] p-8 md:p-10">
        <SectionIntro title="Race geography" />
        <p className="mt-6 max-w-3xl text-sm leading-relaxed opacity-90">{RACE_GEOGRAPHY_NOTE}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <CtaButton href="/amazing-race" variant="ghost-null" size="md">
            Race tasks
          </CtaButton>
          <CtaButton href="/venue" variant="ghost-null" size="md" showArrow={false}>
            Venue &amp; waterfront map
          </CtaButton>
        </div>
      </SectionArticle>

      <SectionArticle className="bg-[var(--color-azure)] text-[var(--color-null)] p-8 md:p-10">
        <SectionIntro title="Before you land" />
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
      </SectionArticle>
    </main>
  );
}
