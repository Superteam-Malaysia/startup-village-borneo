import { ActionCard, CtaButton, SectionArticle, SectionIntro } from "@/components/ui";
import { PageHeader } from "@/components/shell";
import {
  DEMO_DAY,
  DEMO_DAY_JUDGES,
  DEMO_DAY_SCHEDULE,
  PITCH_REQUIREMENTS,
} from "@/data/demo-day";
import { RACE_CUTOFF } from "@/data/race-tasks";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Demo Day",
  description:
    "Day 5 at Startup Village Borneo — tech check, live pitches, judging, and prizes at Voco Kuching.",
  path: "/demo-day",
});

export default function DemoDayPage() {
  return (
    <main className="site-main site-main--stack">
      <PageHeader
        title="Demo Day"
        lead={DEMO_DAY.summary}
      />
      <p className="-mt-8 font-[family-name:var(--font-mono)] text-sm text-[var(--color-wisp)]/60">
        {DEMO_DAY.venue} · {DEMO_DAY.morningNote}
      </p>

      <div className="companion-banner" role="status">
        <span className="companion-banner__tag">Coming soon</span>
        Pitch schedule and judging details will be published closer to the event.
      </div>

      <div className="cutoff-banner">
        Deck upload cutoff: {RACE_CUTOFF.label} · {RACE_CUTOFF.time} — same hard stop as Amazing Race
        threads.
      </div>

      <SectionArticle>
        <SectionIntro title="Morning at Voco" />
        <ul className="mt-8 flex flex-col gap-4 list-none">
          {DEMO_DAY_SCHEDULE.map((item) => (
            <li
              key={item.time}
              className="grid gap-2 md:grid-cols-[6rem_1fr] border-b border-[color:var(--color-transparent-wisp-10)] pb-4"
            >
              <span className="font-[family-name:var(--font-mono)] text-sm text-[var(--color-byte)]">
                {item.time}
              </span>
              <div>
                <p className="font-[family-name:var(--font-display)] text-lg">{item.title}</p>
                <p className="mt-1 text-sm text-[var(--color-wisp)]/70">{item.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </SectionArticle>

      <SectionArticle>
        <SectionIntro title="What to bring" />
        <ul className="mt-8 flex flex-col gap-4 list-none">
          {PITCH_REQUIREMENTS.map((req) => (
            <li
              key={req}
              className="border-l-2 border-[var(--color-byte)] pl-4 text-[var(--color-wisp)]/75 leading-relaxed"
            >
              {req}
            </li>
          ))}
        </ul>
      </SectionArticle>

      <SectionArticle>
        <SectionIntro title="Demo Day panel" />
        <ul className="mt-8 list-none flex flex-col gap-2 text-[var(--color-wisp)]/75">
          {DEMO_DAY_JUDGES.map((j) => (
            <li key={j.id}>
              {j.role} — {j.name}
            </li>
          ))}
        </ul>
      </SectionArticle>

      <div className="grid gap-6 md:grid-cols-3">
        <ActionCard
          tone="azure"
          title="Prizes"
          description="USD $10,000 across placements, tracks, and race."
          cta={{ label: "Prize breakdown", href: "/prizes" }}
        />
        <ActionCard
          tone="mint"
          title="Submissions"
          description="Deck upload rules and cutoff times."
          cta={{ label: "Submission guide", href: "/submissions" }}
        />
        <ActionCard
          tone="null"
          accentText
          title="Day 5 schedule"
          description="Full calendar with venue notes."
          cta={{ label: "View schedule", href: "/schedule?day=5" }}
        />
      </div>

      <CtaButton href="/schedule?day=5" variant="byte" size="md">
        Day 5 on the calendar
      </CtaButton>
    </main>
  );
}
