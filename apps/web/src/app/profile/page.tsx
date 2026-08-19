import type { Metadata } from "next";
import { SectionArticle, SectionIntro } from "@/components/ui";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { requireParticipant } from "@/lib/auth/participant";

export const metadata: Metadata = {
  title: "My profile",
  description: "Your Startup Village Borneo participant profile.",
};

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value?.trim()) return null;
  return (
    <div className="border-t border-[color:var(--color-transparent-wisp-10)] py-4">
      <dt className="font-mono text-xs uppercase tracking-wider text-[color:color-mix(in_srgb,var(--color-wisp)_60%,transparent)]">
        {label}
      </dt>
      <dd className="mt-2 text-sm whitespace-pre-wrap break-words">{value}</dd>
    </div>
  );
}

export default async function ProfilePage() {
  const participant = await requireParticipant();

  return (
    <main className="site-main site-main--stack">
      <div className="max-w-[90rem] mx-auto px-4 md:px-8 py-16 md:py-24">
        <SectionArticle>
          <SectionIntro
            title={participant.name ?? participant.email}
            lead={`Registered as ${participant.approvalStatus ?? "guest"} · ${participant.ticketName ?? "Standard"}`}
            accent="green"
          />

          <dl className="mt-10 max-w-2xl">
            <Field label="Email" value={participant.email} />
            <Field label="Phone" value={participant.phoneNumber} />
            <Field label="Telegram" value={participant.telegram} />
            <Field
              label="Passport / IC name"
              value={
                participant.passportFirstName || participant.passportLastName
                  ? `${participant.passportFirstName ?? ""} ${participant.passportLastName ?? ""}`.trim()
                  : null
              }
            />
            <Field label="Project idea" value={participant.projectIdea} />
            <Field label="Proof of work" value={participant.proofOfWork} />
            <Field label="Team setup" value={participant.teamSetup} />
            <Field label="Jersey size" value={participant.jerseySize} />
            <Field label="Own accommodation" value={participant.ownAccommodation} />
          </dl>

          <div className="mt-10 flex flex-wrap gap-4">
            <LogoutButton />
          </div>
        </SectionArticle>
      </div>
    </main>
  );
}
