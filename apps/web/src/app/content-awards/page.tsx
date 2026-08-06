import { CtaButton, SectionArticle, SectionIntro } from "@/components/ui";
import { CONTENT_AWARD } from "@/data/tracks";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Content Award",
  description: "Content Award at Startup Village Borneo — 10×$100 prizes for Kuching and SVB content on X.",
  path: "/content-awards",
});

export default function ContentAwardsPage() {
  return (
    <main className="max-w-[90rem] mx-auto px-4 md:px-8 py-12 md:py-20 flex flex-col gap-16">
      <header>
        <p className="text-eyebrow mb-6">10×$100 · judged after event</p>
        <h1 className="hero-display max-w-4xl">
          Content
          <br />
          <span className="hero-display-accent">Award</span>
        </h1>
        <p className="mt-8 max-w-2xl text-[var(--color-wisp)]/75 leading-relaxed text-lg">
          {CONTENT_AWARD.summary}
        </p>
      </header>

      <SectionArticle className="bg-[var(--color-azure)] text-[var(--color-null)] p-8 md:p-10">
        <SectionIntro eyebrow="Prizes" title={`${CONTENT_AWARD.prizes.count}×${CONTENT_AWARD.prizes.amount}`} />
        <p className="mt-4 text-[var(--color-null)]/80">{CONTENT_AWARD.judged}</p>
        <p className="mt-4 font-[family-name:var(--font-mono)] text-sm">Tag {CONTENT_AWARD.tags.join(" · ")}</p>
      </SectionArticle>

      <SectionArticle>
        <SectionIntro eyebrow="Tasks" title="Content posts" />
        <ul className="mt-8 flex flex-col gap-6 list-none">
          {CONTENT_AWARD.tasks.map((task) => (
            <li key={task.id} className="border border-[color:var(--color-transparent-wisp-10)] p-6 md:p-8">
              <p className="font-[family-name:var(--font-display)] text-xl">{task.title}</p>
              <p className="mt-2 text-sm text-[var(--color-wisp)]/60">{task.format}</p>
              <div className="mt-4 flex flex-wrap gap-4 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest">
                <span className="text-[var(--color-byte)]">Due {task.deadline}</span>
                <span className="text-[var(--color-wisp)]/50">{task.points}</span>
              </div>
            </li>
          ))}
        </ul>
      </SectionArticle>

      <SectionArticle>
        <SectionIntro eyebrow="Rules" title="Before you post" />
        <ul className="mt-6 flex flex-col gap-3 list-disc list-inside text-[var(--color-wisp)]/75">
          {CONTENT_AWARD.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </SectionArticle>

      <div className="flex flex-wrap gap-4">
        <CtaButton href="/submissions" variant="byte" size="md">Submission rules</CtaButton>
        <CtaButton href="/amazing-race" variant="ghost-wisp" size="md" showArrow={false}>Race tasks</CtaButton>
      </div>
    </main>
  );
}
