import { Accordion, SectionArticle } from "@/components/ui";
import { PageHeader } from "@/components/shell";
import { FAQ_ITEMS } from "@/data/faq";

export const metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <main className="site-main">
      <PageHeader title="Frequently asked questions" />
      <SectionArticle className="max-w-3xl">
        <div className="mt-10">
          <Accordion
            items={FAQ_ITEMS.map((f) => ({
              id: f.id,
              title: f.question,
              content: f.answer,
            }))}
          />
        </div>
      </SectionArticle>
    </main>
  );
}
