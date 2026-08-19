import Link from "next/link";
import { WorkshopRowList } from "@/components/speakers";
import { CtaButton, SectionArticle, SectionIntro } from "@/components/ui";
import { PageHeader } from "@/components/shell";
import { SPEAKER_DAYS, WORKSHOP_SESSIONS } from "@/data/speakers";

export const metadata = { title: "Speakers" };

const KIND_LABEL: Record<string, string> = {
  opening: "Opening",
  keynote: "Keynote",
  workshop: "Workshop",
  program: "Program",
  ministry: "Official",
};

export default function SpeakersPage() {
  return (
    <main className="site-main site-main--stack">
      <PageHeader
        title="Speakers and sessions"
        lead="Talks under ten minutes. Workshops thirty to forty-five minutes max. Day 1 is the race — programming begins Day 2 at Voco."
      />

      <SectionArticle>
        <SectionIntro title="Workshop leaders" accent="green" />
        <WorkshopRowList sessions={WORKSHOP_SESSIONS} />
      </SectionArticle>

      {SPEAKER_DAYS.map((day) => (
        <SectionArticle key={day.dayIndex} className="speaker-day-block">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-[color:var(--color-transparent-wisp-10)] pb-6">
            <div>
              <p className="text-label text-label-accent">
                {day.label} · {day.date}
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl md:text-3xl">
                {day.theme}
              </h2>
            </div>
            <Link
              href={`/schedule?day=${day.dayIndex}`}
              className="text-label text-label-muted hover:text-[var(--color-byte)] transition-colors"
            >
              Calendar →
            </Link>
          </div>

          <ul className="mt-8 flex flex-col gap-4 list-none">
            {day.sessions.map((session) => (
              <li
                key={session.id}
                className="speaker-session-row group grid gap-4 md:grid-cols-[5rem_1fr_auto] md:items-center border border-[color:var(--color-transparent-wisp-10)] p-4 md:p-5 hover:border-[var(--color-byte)] transition-colors"
              >
                <div className="text-label text-label-muted">
                  {session.start ?? "—"}
                </div>
                <div>
                  <p className="font-[family-name:var(--font-display)] text-lg leading-snug">
                    {session.title}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-wisp)]/60">
                    {session.speaker}
                    {session.organization ? ` · ${session.organization}` : ""}
                  </p>
                </div>
                <span className="speaker-kind-badge">{KIND_LABEL[session.kind]}</span>
              </li>
            ))}
          </ul>
        </SectionArticle>
      ))}

      <div className="flex flex-wrap gap-4">
        <CtaButton href="/schedule" variant="byte" size="md">Full schedule</CtaButton>
        <CtaButton href="/prizes" variant="ghost-wisp" size="md" showArrow={false}>Judges & prizes</CtaButton>
      </div>
    </main>
  );
}
