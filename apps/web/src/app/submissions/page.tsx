import type { Metadata } from "next";
import {
  Accordion,
  ActionCard,
  CtaButton,
  SectionArticle,
  SectionIntro,
} from "@/components/ui";
import { PageHeader } from "@/components/shell";
import {
  CONTENT_TASKS,
  RACE_CUTOFF,
  RACE_SUBMISSION_RULES,
  RACE_TASKS,
} from "@/data/race-tasks";
import { FAQ_ITEMS } from "@/data/faq";

const SUBMISSION_FAQ = FAQ_ITEMS.filter((f) =>
  ["cutoff", "race-submit", "wallet-task", "content-award"].includes(f.id),
);

const walletTask = RACE_TASKS.find((t) => t.category === "wallet");

export const metadata: Metadata = {
  title: "Submissions",
  description:
    "How to submit Amazing Race Twitter threads, pitch decks, content posts, and wallet onboarding tasks. Companion dApp uploads coming at the event.",
};

export default function SubmissionsPage() {
  return (
    <main className="max-w-[90rem] mx-auto px-4 md:px-8 py-12 md:py-20">
      <div className="flex flex-col gap-16 md:gap-24">
        <PageHeader
          meta="Race · decks · content"
          title="Submissions"
          lead="Everything you need to log Amazing Race threads, pitch decks, and content tasks — before the companion dApp goes live on-site."
        />

        <div className="companion-banner" role="status">
          <span className="companion-banner__tag">Coming soon</span>
          Upload forms and live validation ship with the companion dApp — this page is your rulebook
          for now.
        </div>

        <div className="cutoff-banner">
          {RACE_CUTOFF.label} · {RACE_CUTOFF.time} — Amazing Race threads & pitch deck cutoff. Nothing
          accepted after.
        </div>

        <SectionArticle>
          <SectionIntro title="Three ways to submit" />
          <ul className="mt-10 grid gap-6 md:grid-cols-3 list-none">
            <li>
              <ActionCard
                title="Amazing Race"
                tone="azure"
                description="One Twitter thread per task — tag every teammate."
                cta={{ label: "Task list", href: "/amazing-race", variant: "azure" }}
              />
            </li>
            <li>
              <ActionCard
                title="Pitch deck"
                tone="mint"
                description="Upload before Day 4 at 18:00 MYT for Demo Day judging."
              />
            </li>
            <li>
              <ActionCard
                title="Content posts"
                tone="null"
                accentText
                description="Individual X posts — Content Award, not race points."
              />
            </li>
          </ul>
        </SectionArticle>

        <SectionArticle>
          <SectionIntro title="Twitter thread submission" />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div className="flex flex-col gap-6 text-[var(--color-wisp)]/75 leading-relaxed">
              <p>
                Each race station is one team Twitter thread. Tag every team member in the opening
                post so judges can verify participation.
              </p>
              <p>
                Film laksa rankings, waterfront sampan rides, cat statues — keep it in one thread per
                task. Multiple photos in the same thread are fine; duplicate tasks across teams are
                not.
              </p>
              <p className="font-[family-name:var(--font-mono)] text-sm text-[var(--color-byte)]">
                Companion dApp: paste your thread URL per task for live scoring.
              </p>
            </div>
            <Accordion
              items={RACE_SUBMISSION_RULES.map((rule, i) => ({
                id: `rule-${i}`,
                title: rule,
                content:
                  i === 0
                    ? "Open a thread, tag all teammates, attach photos or video per station requirements. One thread = one task."
                    : i === 1
                      ? `Hard stop ${RACE_CUTOFF.time} on ${RACE_CUTOFF.label}. Late threads and decks are rejected automatically.`
                      : i === 2
                        ? "The wallet task is about teaching real users — document confusion, not conversions."
                        : i === 3
                          ? "Required tags: @superteamMY, @solana, SOCOE on every content post."
                          : "Build during session hours; race in evenings and gaps between workshops.",
              }))}
            />
          </div>
        </SectionArticle>

        <SectionArticle>
          <SectionIntro title="Individual X posts" />
          <p className="mt-4 text-sm text-[var(--color-wisp)]/60">
            Tag @superteamMY, @solana, and SOCOE on every qualifying post.
          </p>
          <ul className="mt-8 grid gap-4 md:grid-cols-2 list-none">
            {CONTENT_TASKS.map((task) => (
              <li
                key={task.id}
                className="border border-[color:var(--color-transparent-wisp-10)] p-5 flex flex-col gap-3"
              >
                <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-byte)]">
                  Task {task.number} · {task.deadline}
                </p>
                <h3 className="font-[family-name:var(--font-display)] text-lg">{task.title}</h3>
                <p className="text-sm text-[var(--color-wisp)]/70">{task.shortDescription}</p>
                <p className="mt-auto font-[family-name:var(--font-mono)] text-xs text-[var(--color-wisp)]/50">
                  {task.pointsNote}
                </p>
              </li>
            ))}
          </ul>
        </SectionArticle>

        {walletTask && (
          <SectionArticle className="border border-[color:var(--color-transparent-wisp-10)] p-6 md:p-8">
            <SectionIntro title="Teach — don't sell" />
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <div className="flex flex-col gap-4 text-[var(--color-wisp)]/75 leading-relaxed">
                <p>{walletTask.shortDescription}</p>
                <ul className="list-disc list-inside flex flex-col gap-2 text-sm">
                  {walletTask.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <p className="font-[family-name:var(--font-mono)] text-sm text-[var(--color-byte)]">
                  {walletTask.pointsBase} pts · highest-value single station
                </p>
              </div>
              <ActionCard
                title="Onboarding ethos"
                tone="azure"
                description="Help someone use Jupiter, a wallet, or RedotPay. Note what confused them — that's product research, not a sales pitch."
              >
                <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-wisp)]/50 leading-relaxed">
                  Never ask for money, investments, or token purchases. Document the learning moment
                  in your race thread.
                </p>
              </ActionCard>
            </div>
          </SectionArticle>
        )}

        <SectionArticle>
          <SectionIntro title="Submission quick answers" />
          <div className="mt-8 max-w-2xl">
            <Accordion
              items={SUBMISSION_FAQ.map((f) => ({
                id: f.id,
                title: f.question,
                content: f.answer,
              }))}
            />
          </div>
        </SectionArticle>

        <SectionArticle className="bg-[var(--color-byte)]/5 border border-[color:var(--color-transparent-wisp-10)] p-6 md:p-10">
          <SectionIntro title="Uploads open at the event" />
          <p className="mt-6 max-w-xl text-[var(--color-wisp)]/75 leading-relaxed">
            Thread URLs, deck files, and live validation land in the SVB companion dApp — same spirit
            as Breakpoint registration and on-site check-in. Bookmark this page for rules; watch for
            the dApp link from your team lead.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <CtaButton variant="byte" size="lg" disabled showArrow={false}>
              Open companion dApp
            </CtaButton>
            <CtaButton href="/leaderboard" variant="ghost-wisp" size="lg" showArrow={false}>
              Preview leaderboard
            </CtaButton>
          </div>
        </SectionArticle>
      </div>
    </main>
  );
}
