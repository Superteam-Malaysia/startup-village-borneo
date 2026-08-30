import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { TeamForm } from "@/components/teams";
import { SectionArticle, SectionIntro } from "@/components/ui";
import { getParticipantForSession } from "@/lib/auth/participant";

export const metadata: Metadata = {
  title: "Create team",
  description: "Create a hackathon team for Startup Village Borneo.",
};

export const dynamic = "force-dynamic";

export default async function NewTeamPage() {
  const participant = await getParticipantForSession();
  if (!participant) redirect("/login");

  return (
    <main className="site-main site-main--stack">
      <div className="max-w-[90rem] mx-auto px-4 md:px-8 py-16 md:py-24">
        <SectionArticle>
          <SectionIntro
            title="Create a team"
            lead="Showcase your project in the teams directory. You can add builders from the directory after creating your team."
            accent="byte"
          />
          <div className="mt-10">
            <TeamForm mode="create" />
          </div>
        </SectionArticle>
      </div>
    </main>
  );
}
