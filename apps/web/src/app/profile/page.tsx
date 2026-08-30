import type { Metadata } from "next";
import { SectionArticle, SectionIntro } from "@/components/ui";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import { requireParticipant } from "@/lib/auth/participant";
import { participantInitials } from "@/lib/participants/team-categories";
import { participantToProfileForm } from "@/lib/profile/form";
import { uploadPublicUrl } from "@/lib/uploads/public-url";

export const metadata: Metadata = {
  title: "My profile",
  description: "Your Startup Village Borneo participant profile.",
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const participant = await requireParticipant();
  const displayName = participant.name ?? participant.email;
  const initials = participantInitials(displayName);
  const avatarUrl = uploadPublicUrl(participant.avatarUrl);

  return (
    <main className="site-main site-main--stack">
      <div className="max-w-[90rem] mx-auto px-4 md:px-8 py-16 md:py-24">
        <SectionArticle>
          <SectionIntro
            title="My profile"
            lead="Update the details shown on your builder card and team directory entry."
            accent="green"
          />

          <div className="mt-10 max-w-2xl">
            <ProfileEditForm
              initial={participantToProfileForm(participant)}
              meta={{
                email: participant.email,
                approvalStatus: participant.approvalStatus,
                ticketName: participant.ticketName,
              }}
              avatarFallback={initials}
              avatarUrl={avatarUrl}
            />
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <LogoutButton />
          </div>
        </SectionArticle>
      </div>
    </main>
  );
}
