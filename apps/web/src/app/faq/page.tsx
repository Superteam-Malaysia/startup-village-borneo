import { Accordion, SectionArticle, SectionIntro } from "@/components/ui";
import { FAQ_ITEMS } from "@/data/faq";

export const metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <main className="max-w-[90rem] mx-auto px-4 md:px-8 py-12 md:py-20">
      <SectionArticle className="max-w-3xl">
        <SectionIntro eyebrow="FAQ" title="Frequently asked questions" />
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
