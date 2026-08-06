import { EventMap } from "@/components/venue";
import { SectionArticle, SectionIntro } from "@/components/ui";
import { SITE } from "@/data/site";

export const metadata = { title: "Venue" };

export default function VenuePage() {
  return (
    <main className="max-w-[90rem] mx-auto px-4 md:px-8 py-12 md:py-20 flex flex-col gap-16">
      <SectionArticle>
        <SectionIntro eyebrow="Venue" title="Sheraton Kuching" />
        <div className="mt-8 grid gap-8 md:grid-cols-2 text-[var(--color-wisp)]/75 leading-relaxed">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-byte)] mb-3">
              Primary venue
            </p>
            <p>{SITE.venue}</p>
            <p className="mt-4">Evening building happens at the hotel. Day 1 welcome dinner on site.</p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-byte)] mb-3">
              Workshops
            </p>
            <p>{SITE.workshopVenue}</p>
            <p className="mt-4">Breakfast at Sheraton, then travel to Voco for Day 2–5 morning sessions.</p>
          </div>
        </div>
      </SectionArticle>

      <SectionArticle>
        <SectionIntro eyebrow="Reference map" title="Floor plan pattern (Breakpoint-derived UI)" />
        <p className="mt-4 text-sm text-[var(--color-wisp)]/50 max-w-2xl">
          Interactive map component from Breakpoint event-day archive — replace with Sheraton/Voco
          plans when assets are ready.
        </p>
        <div className="mt-8">
          <EventMap venueName="Sheraton Kuching (map UI reference)" />
        </div>
      </SectionArticle>
    </main>
  );
}
