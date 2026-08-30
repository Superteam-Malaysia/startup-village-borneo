import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminSubmissionsTable } from "@/components/race/AdminSubmissionsTable";
import { PageHeader } from "@/components/shell";
import { SectionArticle, SectionIntro } from "@/components/ui";
import { getParticipantForSession } from "@/lib/auth/participant";
import { isOrganizer } from "@/lib/auth/organizer";
import { listAllRaceSubmissionsForAdmin } from "@/lib/race/submissions";

export const metadata: Metadata = {
  title: "Race submissions · Admin",
  description: "Review Amazing Race thread URLs submitted by teams.",
};

export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
  const participant = await getParticipantForSession();
  if (!participant || !isOrganizer(participant)) notFound();

  const submissions = await listAllRaceSubmissionsForAdmin();

  return (
    <main className="site-main site-main--stack">
      <PageHeader
        title="Race submissions"
        lead="Thread URLs submitted by teams for Amazing Race stations. Only organizers can view this page."
      />

      <SectionArticle className="border border-[color:var(--color-transparent-wisp-10)] p-6 md:p-8">
        <SectionIntro title={`${submissions.length} submission${submissions.length === 1 ? "" : "s"}`} />
        <div className="mt-8">
          <AdminSubmissionsTable submissions={submissions} />
        </div>
      </SectionArticle>
    </main>
  );
}
