import { ActionCard, SectionArticle } from "@/components/ui";
import { PageHeader } from "@/components/shell";

export const metadata = { title: "Get involved" };

export default function GetInvolvedPage() {
  return (
    <main className="site-main">
      <PageHeader title="Take part in SVB 2026" />
      <SectionArticle>
        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4 list-none">
          <li>
            <ActionCard
              title="Builders"
              tone="azure"
              description="Join a team at the welcome dinner. Formation closes Day 2 lunch."
            />
          </li>
          <li>
            <ActionCard
              title="Sponsors"
              tone="null"
              accentText
              description="Legends plan ahead. Logo + office hours for ecosystem partners."
            />
          </li>
          <li>
            <ActionCard title="Press" tone="mint" description="Cover Demo Day and the builder village." />
          </li>
          <li>
            <ActionCard
              title="Content"
              tone="mint"
              description="Content Award — post by 10 Sept, judged remotely."
            />
          </li>
        </ul>
      </SectionArticle>
    </main>
  );
}
