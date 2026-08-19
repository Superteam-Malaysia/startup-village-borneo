import Link from "next/link";
import { SectionArticle } from "@/components/ui";
import { getPublicParticipants } from "@/lib/participants/public-directory";
import { ParticipantDirectoryClient } from "./ParticipantDirectoryClient";

export async function ParticipantDirectory() {
  const people = await getPublicParticipants();

  if (people.length === 0) {
    return (
      <SectionArticle className="builder-directory__empty">
        <p className="text-sm text-[var(--color-wisp)]/60 max-w-xl">
          Participant directory syncs from Luma registration. Check back once imports are live, or{" "}
          <Link href="/login" className="text-[var(--color-byte)] hover:underline">
            sign in
          </Link>{" "}
          if you are registered.
        </p>
      </SectionArticle>
    );
  }

  return (
    <SectionArticle>
      <ParticipantDirectoryClient people={people} />
    </SectionArticle>
  );
}
