import { SectionArticle, SectionIntro } from "@/components/ui";
import { PageHeader } from "@/components/shell";
import { CONTENT_AWARD } from "@/data/tracks";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Content Award",
  description: "Content Award at Startup Village Borneo — 10×$100 prizes for Kuching and SVB content on X.",
  path: "/content-awards",
});

export default function ContentAwardsPage() {
  return (
    <main className="site-main site-main--stack">
      <PageHeader
        title="Content Award"
        lead={CONTENT_AWARD.summary}
      />

      <SectionArticle className="bg-[var(--color-azure)] text-[var(--color-wisp)] p-8 md:p-10">
        <SectionIntro title={`${CONTENT_AWARD.prizes.count}×${CONTENT_AWARD.prizes.amount}`} />
        <p className="mt-4 text-[var(--color-wisp)]/80">{CONTENT_AWARD.judged}</p>
        <p className="mt-4 font-[family-name:var(--font-mono)] text-sm">Tag {CONTENT_AWARD.tags.join(" · ")}</p>
      </SectionArticle>

      <SectionArticle>
        <SectionIntro title="Content posts" />
        <ul className="mt-8 flex flex-col gap-6 list-none">
          {CONTENT_AWARD.tasks.map((task) => (
            <li key={task.id} className="border border-[color:var(--color-transparent-wisp-10)] p-6 md:p-8">
              <p className="font-[family-name:var(--font-display)] text-xl">{task.title}</p>
              <p className="mt-2 text-sm text-[var(--color-wisp)]/60">{task.format}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-label text-label-accent">
                <span className="text-[var(--color-byte)]">Due {task.deadline}</span>
                <span className="text-[var(--color-wisp)]/50">{task.points}</span>
              </div>
            </li>
          ))}
        </ul>
      </SectionArticle>

      <SectionArticle>
        <SectionIntro title="Before you post" />
        <ul className="mt-6 flex flex-col gap-3 list-disc list-inside text-[var(--color-wisp)]/75">
          {CONTENT_AWARD.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </SectionArticle>
    </main>
  );
}
