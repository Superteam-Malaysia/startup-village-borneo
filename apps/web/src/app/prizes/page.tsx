import { ActionCard, CtaButton, SectionArticle, SectionIntro } from "@/components/ui";
import { PageHeader } from "@/components/shell";
import { JUDGES, PRIZE_ROWS, PRIZE_TOTAL } from "@/data/prizes";
import { CONTENT_AWARD, SUSTAINABILITY_TRACK } from "@/data/tracks";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Prizes",
  description: "USD $10,000 prize pool for Startup Village Borneo — hackathon, race, content, and sustainability tracks.",
  path: "/prizes",
});

export default function PrizesPage() {
  return (
    <main className="site-main">
      <PageHeader
        title={`${PRIZE_TOTAL} prize pool`}
        lead="Prizes are settled off-app per event operations. This site is the program bible — not a payment portal."
      />
      <SectionArticle>
        <table className="mt-12 w-full max-w-2xl text-left border-collapse">
          <thead>
            <tr className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-wisp)]/50">
              <th className="pb-4">Award</th>
              <th className="pb-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {PRIZE_ROWS.map((row) => (
              <tr key={row.label} className="border-t border-[color:var(--color-transparent-wisp-10)]">
                <td className="py-4 font-[family-name:var(--font-mono)] text-sm">{row.label}</td>
                <td className="py-4 text-right font-[family-name:var(--font-display)] text-xl">
                  {row.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-16">
          <h3 className="text-label">Program tracks</h3>
          <ul className="mt-8 grid gap-6 md:grid-cols-3 list-none">
            <li>
              <ActionCard
                tone="azure"
                title="Sustainability"
                description={`${SUSTAINABILITY_TRACK.prizes.count}×${SUSTAINABILITY_TRACK.prizes.amount}`}
                cta={{ label: "Track criteria", href: "/sustainability" }}
              />
            </li>
            <li>
              <ActionCard
                tone="mint"
                title="Content Award"
                description={`${CONTENT_AWARD.prizes.count}×${CONTENT_AWARD.prizes.amount}`}
                cta={{ label: "Content tasks", href: "/content-awards" }}
              />
            </li>
            <li>
              <ActionCard
                tone="null"
                accentText
                title="Amazing Race"
                description="2×$500"
                cta={{ label: "Race tasks", href: "/amazing-race" }}
              />
            </li>
          </ul>
        </div>
        <div className="mt-12">
          <h3 className="text-label">Demo Day judges</h3>
          <ul className="mt-4 list-none flex flex-col gap-2 text-[var(--color-wisp)]/75">
            {JUDGES.map((j) => (
              <li key={j}>{j}</li>
            ))}
          </ul>
        </div>
        <div className="mt-10">
          <CtaButton href="/amazing-race" variant="byte" size="md">Amazing Race prizes</CtaButton>
        </div>
      </SectionArticle>
    </main>
  );
}
