import Link from "next/link";
import { VenueMapSwitcher } from "@/components/venue";
import { CtaButton, SectionArticle, SectionIntro } from "@/components/ui";
import { PageHeader } from "@/components/shell";
import {
  GRAB_TIPS,
  KCH_AIRPORT_DETAILS,
  TRAVEL_HERO,
  TRAVEL_SECTIONS,
  TRAVEL_TIPS,
} from "@/data/travel";
import {
  BREAKFAST_RHYTHM,
  SHERATON_TO_VOCO,
  VENUE_DAY_PLAN,
  VENUES,
  WATERFRONT_RACE_STATIONS,
  WHATSAPP_OPS_NOTE,
  venueLabel,
} from "@/data/venues";

export const metadata = {
  title: "Travel & venue",
  description:
    "Getting to Kuching for Startup Village Borneo — KCH airport, Sheraton & Voco logistics, day-by-day venue plan, and local tips for 5–9 September 2026.",
};

export default function TravelPage() {
  return (
    <main className="site-main site-main--stack">
      <header className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <PageHeader
          title="Travel & venue"
          lead="Land at KCH, check into Sheraton, and the program starts the moment you arrive. Evenings at the hotel; workshops at Voco from Day 2 — this page covers all logistics."
        />
        <div className="travel-hero-card">
          <p className="text-label text-label-accent">{TRAVEL_HERO.airport}</p>
          <p className="mt-2 text-label text-label-muted text-label-sm">
            {TRAVEL_HERO.airportCode}
          </p>
          <p className="mt-3 font-[family-name:var(--font-display)] text-2xl">{TRAVEL_HERO.distance}</p>
          <p className="mt-2 text-sm text-[var(--color-wisp)]/55">{TRAVEL_HERO.terminal}</p>
          <p className="mt-4 text-sm text-[var(--color-wisp)]/55">{TRAVEL_HERO.timezone}</p>
          <p className="mt-6 text-sm text-[var(--color-wisp)]/70">{VENUES.sheraton.address}</p>
        </div>
      </header>

      <div className="companion-banner" role="status">
        <span className="companion-banner__tag">Coming soon</span>
        Travel and venue logistics will be published closer to the event.
      </div>

      <SectionArticle>
        <SectionIntro title="Where SVB happens" />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {Object.values(VENUES).map((venue) => (
            <article
              key={venue.id}
              className="border border-[color:var(--color-transparent-wisp-10)] p-6 md:p-8 h-full"
            >
              <p className="text-label text-label-accent">{venue.role}</p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[var(--color-wisp)]">
                {venue.name}
              </h2>
              <address className="mt-4 not-italic text-sm text-[var(--color-wisp)]/75 leading-relaxed">
                {venue.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              {venue.phone ? (
                <p className="mt-3 text-sm text-[var(--color-wisp)]/60">{venue.phone}</p>
              ) : null}
              <div className="mt-6 space-y-4 text-sm text-[var(--color-wisp)]/75 leading-relaxed">
                <div>
                  <p className="text-label text-label-accent text-label-sm">Check-in</p>
                  <p className="mt-2">{venue.checkInNote}</p>
                </div>
                {venue.breakfastNote ? (
                  <div>
                    <p className="text-label text-label-accent text-label-sm">Breakfast</p>
                    <p className="mt-2">{venue.breakfastNote}</p>
                  </div>
                ) : null}
              </div>
              <a
                href={`https://maps.google.com/?q=${venue.mapsQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block text-label text-label-accent hover:underline"
              >
                Open in Maps →
              </a>
            </article>
          ))}
        </div>
      </SectionArticle>

      <SectionArticle>
        <SectionIntro title="Day by day — which venue" />
        <ul className="mt-8 flex flex-col gap-4 list-none">
          {VENUE_DAY_PLAN.map((row) => (
            <li
              key={row.day}
              className="grid gap-2 border-b border-[color:var(--color-transparent-wisp-10)] pb-4 md:grid-cols-[7rem_8rem_1fr] md:gap-6 md:items-baseline"
            >
              <span className="text-label text-label-accent">{row.day}</span>
              <span className="text-sm text-[var(--color-wisp)]/55">{row.date}</span>
              <div>
                <p className="font-[family-name:var(--font-display)] text-lg text-[var(--color-wisp)]">
                  {row.headline}
                  <span className="ml-2 text-label text-label-accent">
                    · {venueLabel(row.venueId)}
                  </span>
                </p>
                <p className="mt-1 text-sm text-[var(--color-wisp)]/70 leading-relaxed">{row.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </SectionArticle>

      <SectionArticle>
        <SectionIntro title="Kuching International Airport" />
        <div className="mt-6 grid gap-6 md:grid-cols-2 text-sm text-[var(--color-wisp)]/75 leading-relaxed">
          <div>
            <p className="text-label text-label-accent text-label-sm">Codes &amp; location</p>
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
            <p className="text-label text-label-accent text-label-sm">Arrival flow</p>
            <ol className="mt-3 flex flex-col gap-3 list-decimal list-inside">
              {KCH_AIRPORT_DETAILS.arrivalFlow.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </SectionArticle>

      <SectionArticle>
        <SectionIntro title="Sheraton ↔ Voco" />
        <p className="mt-4 text-sm text-[var(--color-wisp)]/60">{SHERATON_TO_VOCO.distance}</p>
        <p className="mt-4 max-w-2xl text-sm text-[var(--color-wisp)]/75 leading-relaxed">
          {SHERATON_TO_VOCO.summary}
        </p>
        <ol className="mt-6 flex flex-col gap-4 list-decimal list-inside text-sm text-[var(--color-wisp)]/75 leading-relaxed">
          {SHERATON_TO_VOCO.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="mt-6 font-[family-name:var(--font-mono)] text-xs text-[var(--color-byte)]">
          {SHERATON_TO_VOCO.grabTip}
        </p>
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
                  <p className="text-label text-label-accent text-label-sm">{item.label}</p>
                  <p className="mt-2 text-sm text-[var(--color-wisp)]/75 leading-relaxed">{item.detail}</p>
                </li>
              ))}
            </ul>
          </SectionArticle>
        ))}
      </div>

      <SectionArticle>
        <SectionIntro title="Breakfast &amp; ops" />
        <div className="mt-8 grid gap-6 md:grid-cols-2 text-sm text-[var(--color-wisp)]/75 leading-relaxed">
          <div className="border border-[color:var(--color-transparent-wisp-10)] p-6">
            <p className="text-label text-label-accent text-label-sm">Breakfast rhythm</p>
            <p className="mt-3">{BREAKFAST_RHYTHM}</p>
          </div>
          <div className="border border-[color:var(--color-transparent-wisp-10)] p-6">
            <p className="text-label text-label-accent text-label-sm">WhatsApp ops</p>
            <p className="mt-3">{WHATSAPP_OPS_NOTE}</p>
          </div>
        </div>
      </SectionArticle>

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

      <SectionArticle>
        <SectionIntro title="Race geography — waterfront" />
        <p className="mt-4 max-w-2xl text-sm text-[var(--color-wisp)]/70 leading-relaxed">
          Sheraton is a five-minute walk from the Kuching Waterfront — the densest cluster of race
          stations. Darul Hana bridge, the KUCHING letter sign, sampan rides, and flagpole tasks all
          sit within a walkable loop. Food and culture tasks spread deeper into the city — plan
          evenings, not workshop hours.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 list-none">
          {WATERFRONT_RACE_STATIONS.map((station) => (
            <li key={station.id}>
              <Link
                href={station.href}
                className="block border border-[color:var(--color-transparent-wisp-10)] px-4 py-3 text-sm transition-colors hover:border-[var(--color-byte)]/40"
              >
                <span className="text-[var(--color-wisp)]">{station.name}</span>
                <span className="ml-2 font-[family-name:var(--font-mono)] text-xs text-[var(--color-byte)]">
                  {station.points}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <CtaButton href="/amazing-race" variant="ghost-wisp" size="md">
            Full race catalog
          </CtaButton>
        </div>
      </SectionArticle>

      <SectionArticle>
        <SectionIntro title="Sheraton floor zones" />
        <VenueMapSwitcher />
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
