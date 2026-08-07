import { SectionArticle } from "@/components/ui";
import { PageHeader } from "@/components/shell";

export const metadata = { title: "Code of conduct" };

export default function CodeOfConductPage() {
  return (
    <main className="site-main">
      <PageHeader title="Code of conduct" />
      <SectionArticle className="max-w-3xl">
        <div className="mt-10 flex flex-col gap-6 text-[var(--color-wisp)]/75 leading-relaxed">
          <p>
            Startup Village Borneo is a builder community event anchored by the Solana Foundation
            and SOCOE. We expect respect, inclusion, and professionalism from every participant,
            partner, and guest.
          </p>
          <p>
            <strong className="text-[var(--color-wisp)]">Wallet task briefing:</strong> teach, never
            pressure. Do not approach anyone about money or investment. If someone is not interested,
            thank them and move on.
          </p>
          <p>
            Harassment, discrimination, or disruptive behaviour may result in removal from the event
            without refund. Report issues to organizers immediately.
          </p>
          <p className="text-sm text-[var(--color-wisp)]/50">
            Aligned with Solana Foundation community standards. Full policy to be linked when
            published by organizers.
          </p>
        </div>
      </SectionArticle>
    </main>
  );
}
