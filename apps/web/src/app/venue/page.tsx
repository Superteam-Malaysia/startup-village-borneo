import Link from "next/link";
import { VenueMapSwitcher } from "@/components/venue";
import { CtaButton, SectionArticle, SectionIntro } from "@/components/ui";
import { PageHeader } from "@/components/shell";
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
  title: "Venue",
  description:
    "Sheraton Kuching for evenings and breakfast; Voco Kuching for workshops Day 2–5. Directions, day-by-day venue plan, and waterfront race geography.",
};

export default function VenuePage() {
  return (
    <main className="site-main site-main--stack">
      <PageHeader
        title="Sheraton and Voco"
        lead="Evening building at Sheraton. Day workshops at Voco from Day 2 — breakfast at the hotel, then travel across town."
      />

      <SectionArticle>
        <SectionIntro title="Where SVB happens" />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {Object.values(VENUES).map((venue) => (
            <article
              key={venue.id}
              className="border border-[color:var(--color-transparent-wisp-10)] p-6 md:p-8 h-full"
            >
              <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-byte)]">
                {venue.role}
              </p>
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
                  <p className="font-[family-name:var(--font-mono)] text-[0.65rem] uppercase tracking-widest text-[var(--color-byte)]">
                    Check-in
                  </p>
                  <p className="mt-2">{venue.checkInNote}</p>
                </div>
                {venue.breakfastNote ? (
                  <div>
                    <p className="font-[family-name:var(--font-mono)] text-[0.65rem] uppercase tracking-widest text-[var(--color-byte)]">
                      Breakfast
                    </p>
                    <p className="mt-2">{venue.breakfastNote}</p>
                  </div>
                ) : null}
              </div>
              <a
                href={`https://maps.google.com/?q=${venue.mapsQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-byte)] hover:underline"
              >
                Open in Maps →
              </a>
            </article>
          ))}
        </div>
      </SectionArticle>

      <SectionArticle>
        <SectionIntro title="Breakfast &amp; ops" />
        <div className="mt-8 grid gap-6 md:grid-cols-2 text-sm text-[var(--color-wisp)]/75 leading-relaxed">
          <div className="border border-[color:var(--color-transparent-wisp-10)] p-6">
            <p className="font-[family-name:var(--font-mono)] text-[0.65rem] uppercase tracking-widest text-[var(--color-byte)]">
              Breakfast rhythm
            </p>
            <p className="mt-3">{BREAKFAST_RHYTHM}</p>
          </div>
          <div className="border border-[color:var(--color-transparent-wisp-10)] p-6">
            <p className="font-[family-name:var(--font-mono)] text-[0.65rem] uppercase tracking-widest text-[var(--color-byte)]">
              WhatsApp ops
            </p>
            <p className="mt-3">{WHATSAPP_OPS_NOTE}</p>
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

      <SectionArticle>
        <SectionIntro title="Day by day — which venue" />
        <ul className="mt-8 flex flex-col gap-4 list-none">
          {VENUE_DAY_PLAN.map((row) => (
            <li
              key={row.day}
              className="grid gap-2 border-b border-[color:var(--color-transparent-wisp-10)] pb-4 md:grid-cols-[7rem_8rem_1fr] md:gap-6 md:items-baseline"
            >
              <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-byte)]">
                {row.day}
              </span>
              <span className="text-sm text-[var(--color-wisp)]/55">{row.date}</span>
              <div>
                <p className="font-[family-name:var(--font-display)] text-lg text-[var(--color-wisp)]">
                  {row.headline}
                  <span className="ml-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-byte)]">
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
    </main>
  );
}
