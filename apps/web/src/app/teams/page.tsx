import type { Metadata } from "next";
import { ParticipantDirectory } from "@/components/directory";
import { CtaButton } from "@/components/ui";
import { PageHeader } from "@/components/shell";

export const metadata: Metadata = {
  title: "Builders",
  description:
    "Registered builders and project ideas for Startup Village Borneo — find teammates before you land in Kuching.",
};

export const dynamic = "force-dynamic";

export default function TeamsPage() {
  return (
    <main className="site-main site-main--stack">
      <PageHeader
        meta="SVB 2026 · registered builders"
        title="Builder directory"
        lead="Everyone approved on Luma — project blurbs and team setup so you can find collaborators before Day 1."
      />

      <ParticipantDirectory />

      <div className="flex flex-wrap gap-4">
        <CtaButton href="/login" variant="byte" size="md">
          Sign in to your profile
        </CtaButton>
        <CtaButton href="/submissions" variant="ghost-wisp" size="md" showArrow={false}>
          Submission guide
        </CtaButton>
      </div>
    </main>
  );
}
