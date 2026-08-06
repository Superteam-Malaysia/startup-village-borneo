import { ActionCard, SectionArticle, SectionIntro } from "@/components/ui";
import { PARTNERS } from "@/data/partners";

export const metadata = { title: "Partners" };

export default function PartnersPage() {
  const anchors = PARTNERS.filter((p) => p.role === "anchor");
  const confirmed = PARTNERS.filter((p) => p.role === "confirmed");
  const pending = PARTNERS.filter((p) => p.role === "pending");

  return (
    <main className="max-w-[90rem] mx-auto px-4 md:px-8 py-12 md:py-20">
      <SectionArticle>
        <SectionIntro eyebrow="Ecosystem" title="Partners" />
        <p className="mt-6 max-w-2xl text-[var(--color-wisp)]/70">
          Partners not on stage receive logo placement and office hours access (e.g. BESarawak,
          TankDAO).
        </p>

        <div className="mt-12 flex flex-col gap-10">
          <div>
            <p className="text-eyebrow !ms-0">Anchor</p>
            <ul className="mt-4 grid gap-4 md:grid-cols-2 list-none">
              {anchors.map((p) => (
                <li key={p.name}>
                  <ActionCard title={p.name} tone="mint" description="Anchor partner" />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-eyebrow !ms-0">Confirmed</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {confirmed.map((p) => (
                <span key={p.name} className="partner-pill">
                  {p.name}
                  {!p.workshops ? " · no workshop" : ""}
                </span>
              ))}
            </div>
          </div>
          {pending.length > 0 && (
            <div>
              <p className="text-eyebrow !ms-0">Pending</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {pending.map((p) => (
                  <span key={p.name} className="partner-pill partner-pill--pending">{p.name}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </SectionArticle>
    </main>
  );
}
