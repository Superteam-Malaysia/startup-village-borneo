import Link from "next/link";
import { BrandLogosPanel } from "@/components/brand";
import {
  Accordion,
  ActionCard,
  CtaButton,
  SectionArticle,
  SectionIntro,
  StatDisplay,
  StatusChip,
} from "@/components/ui";
import { EventMap } from "@/components/venue";
import { HalftoneShowcase } from "@/components/halftone";

export const metadata = {
  title: "Brand assets",
  description: "Startup Village Borneo logos, marks, and component reference.",
};

export default function DesignSystemPage() {
  return (
    <main className="pb-20">
      <div className="max-w-[90rem] mx-auto px-4 md:px-8 pt-12 flex flex-col gap-16 md:gap-24">
        <section>
          <SectionIntro title="Brand assets" accent="byte" />
          <p className="mt-6 max-w-2xl text-[var(--color-wisp)]/80 leading-relaxed">
            Official SVB marks for partners and press. Component reference for{" "}
            <code className="text-[var(--color-byte)]">apps/web/src/components</code> below.
            Public site: <Link href="/" className="text-[var(--color-byte)] hover:underline">/</Link>.
          </p>
        </section>

        <section id="logos">
          <SectionArticle>
            <BrandLogosPanel />
          </SectionArticle>
        </section>

        <section id="cta">
          <SectionArticle>
            <SectionIntro title="CTA buttons" />
            <div className="mt-8 flex flex-wrap gap-4">
              <CtaButton variant="byte" size="lg">Register</CtaButton>
              <CtaButton variant="azure" size="md">Get updates</CtaButton>
              <CtaButton variant="ghost-wisp" size="md">Become a sponsor</CtaButton>
              <CtaButton variant="ghost-null" size="sm">Apply</CtaButton>
            </div>
          </SectionArticle>
        </section>

        <section>
          <SectionArticle>
            <SectionIntro title="Stat display" />
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatDisplay value="1,240" label="Total pts" />
              <StatDisplay value="84" label="Race rank" />
              <StatDisplay value="6" label="Tasks done" />
              <StatDisplay value="$500" label="Ticket" />
            </div>
          </SectionArticle>
        </section>

        <section id="cards">
          <SectionArticle className="bg-[var(--color-azure)] text-[var(--color-null)]">
            <SectionIntro title="Ticket cards" />
            <ul className="mt-10 grid gap-6 card-sm:grid-cols-2 md:grid-cols-4 list-none">
              <li>
                <ActionCard title="General Admission" tone="null" aspect="square" accentText>
                  <p className="stat-display text-[var(--color-azure)]">$500</p>
                </ActionCard>
              </li>
              <li>
                <ActionCard title="Developers" tone="azure" aspect="square">
                  <p className="stat-display">$250</p>
                </ActionCard>
              </li>
              <li>
                <ActionCard title="Students" tone="azure" aspect="square">
                  <p className="stat-display">$100</p>
                </ActionCard>
              </li>
              <li>
                <ActionCard title="Late bird" tone="azure" aspect="square">
                  <p className="stat-display">$800</p>
                </ActionCard>
              </li>
            </ul>
          </SectionArticle>

          <SectionArticle className="mt-8">
            <SectionIntro title="Action cards" />
            <ul className="mt-10 grid gap-6 md:grid-cols-4 list-none">
              <li>
                <ActionCard title="Speak" tone="null" accentText description="Applications closed." />
              </li>
              <li>
                <ActionCard
                  title="Sponsor"
                  tone="mint"
                  description="Legends plan ahead."
                  cta={{ label: "Get 2026 access", href: "https://solana.com/breakpoint" }}
                />
              </li>
              <li>
                <ActionCard title="Press" tone="mint" cta={{ label: "Apply", href: "#" }} />
              </li>
              <li>
                <ActionCard title="Content" tone="mint" cta={{ label: "Apply", href: "#" }} />
              </li>
            </ul>
          </SectionArticle>
        </section>

        <section>
          <SectionArticle>
            <SectionIntro title="Status chips" />
            <div className="mt-6 flex flex-wrap gap-3">
              <StatusChip variant="approved">Approved</StatusChip>
              <StatusChip variant="pending">Pending review</StatusChip>
              <StatusChip variant="locked">Cutoff passed</StatusChip>
            </div>
          </SectionArticle>
        </section>

        <section>
          <SectionArticle>
            <SectionIntro title="Accordion" />
            <div className="mt-8 max-w-xl">
              <Accordion
                items={[
                  {
                    id: "refund",
                    title: "What is the refund policy?",
                    content: "Tickets are non-refundable but transferable.",
                  },
                  {
                    id: "included",
                    title: "What's included in my ticket?",
                    content: "Main conference programming, networking areas, and on-site experiences.",
                  },
                ]}
              />
            </div>
          </SectionArticle>
        </section>

        <section id="halftone">
          <SectionArticle>
            <SectionIntro title="Print-screen data surfaces" />
            <p className="mt-4 text-[var(--color-wisp)]/70 text-sm max-w-2xl">
              Breakpoint handles layout, CTAs, and venue chrome. Halftone UI (
              <a href="https://halftone-ui.com/docs/" className="text-[var(--color-byte)] hover:underline">
                halftone-kit
              </a>
              ) presses meters, charts, and cards — copy-in at{" "}
              <code className="text-[var(--color-byte)]">src/halftone/</code>.
            </p>
            <div className="mt-10">
              <HalftoneShowcase />
            </div>
          </SectionArticle>
        </section>

        <section id="map">
          <SectionArticle>
            <div id="map" />
            <SectionIntro title="Event map" />
            <p className="mt-4 text-[var(--color-wisp)]/70 text-sm max-w-2xl">
              Pan/zoom floor plans with numbered zones — from Breakpoint 2025 event-day archive. Floor images:
              <code className="text-[var(--color-byte)]"> public/map/*.webp</code>
            </p>
            <EventMap venueName="Etihad Arena (reference)" />
          </SectionArticle>
        </section>
      </div>
    </main>
  );
}
