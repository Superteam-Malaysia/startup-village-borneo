import Link from "next/link";
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

export default function DesignSystemPage() {
  return (
    <main className="pb-20">
      <header className="sticky top-0 z-[var(--z-nav)] border-b border-[color:var(--color-transparent-wisp-10)] bg-[var(--color-null)]/95 backdrop-blur-sm px-4 md:px-8 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="font-[family-name:var(--font-mono)] text-sm tracking-widest uppercase">
          ≡ SVB UI
        </Link>
        <nav className="flex gap-4 text-sm font-[family-name:var(--font-mono)] uppercase tracking-wide">
          <a href="#cta" className="hover:text-[var(--color-byte)] transition-colors">CTA</a>
          <a href="#cards" className="hover:text-[var(--color-byte)] transition-colors">Cards</a>
          <a href="#map" className="hover:text-[var(--color-byte)] transition-colors">Map</a>
        </nav>
      </header>

      <div className="max-w-[90rem] mx-auto px-4 md:px-8 pt-12 flex flex-col gap-16 md:gap-24">
        <section>
          <SectionIntro eyebrow="Element library" title="Breakpoint-derived components in code" />
          <p className="mt-6 max-w-2xl text-[var(--color-wisp)]/80 leading-relaxed">
            These React components live in <code className="text-[var(--color-byte)]">apps/web/src/components</code>
            — reverse-engineered from Solana Breakpoint CSS/HTML, not just markdown specs.
          </p>
        </section>

        <section id="cta">
          <SectionArticle>
            <SectionIntro eyebrow="EL-28" title="CTA buttons" />
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
            <SectionIntro eyebrow="EL-32 / EL-33" title="Stat display" />
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
            <SectionIntro eyebrow="EL-35" title="Ticket cards" />
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
            <SectionIntro eyebrow="EL-36" title="Action cards" />
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
            <SectionIntro eyebrow="EL-11" title="Status chips" />
            <div className="mt-6 flex flex-wrap gap-3">
              <StatusChip variant="approved">Approved</StatusChip>
              <StatusChip variant="pending">Pending review</StatusChip>
              <StatusChip variant="locked">Cutoff passed</StatusChip>
            </div>
          </SectionArticle>
        </section>

        <section>
          <SectionArticle>
            <SectionIntro eyebrow="EL-44" title="Accordion" />
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

        <section id="map">
          <SectionArticle>
            <div id="map" />
            <SectionIntro eyebrow="EL-51–62" title="Event map" />
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
