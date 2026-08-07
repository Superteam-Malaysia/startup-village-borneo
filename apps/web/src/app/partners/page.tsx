import { ActionCard, SectionArticle } from "@/components/ui";
import { PageHeader } from "@/components/shell";
import { PARTNERS } from "@/data/partners";

export const metadata = { title: "Partners" };

export default function PartnersPage() {
  const anchors = PARTNERS.filter((p) => p.role === "anchor");
  const confirmed = PARTNERS.filter((p) => p.role === "confirmed");
  const pending = PARTNERS.filter((p) => p.role === "pending");

  return (
    <main className="site-main">
      <PageHeader
        title="Partners"
        lead="Partners not on stage receive logo placement and office hours access (e.g. BESarawak, TankDAO)."
      />
      <SectionArticle>

        <div className="mt-12 flex flex-col gap-10">
          <div>
            <h3 className="text-label">Anchor</h3>
            <ul className="mt-4 grid gap-4 md:grid-cols-2 list-none">
              {anchors.map((p) => (
                <li key={p.name}>
                  <ActionCard title={p.name} tone="mint" description="Anchor partner" />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-label">Confirmed</h3>
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
              <h3 className="text-label">Pending</h3>
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
