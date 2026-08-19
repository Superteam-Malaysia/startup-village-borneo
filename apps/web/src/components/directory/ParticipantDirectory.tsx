import Link from "next/link";
import { SectionArticle } from "@/components/ui";
import {
  firstUrl,
  getPublicParticipants,
  telegramHref,
  type PublicParticipant,
} from "@/lib/participants/public-directory";

function ParticipantCard({ person }: { person: PublicParticipant }) {
  const tg = telegramHref(person.telegram);
  const proofUrl = firstUrl(person.proofOfWork);

  return (
    <article className="participant-card">
      <div className="participant-card__head">
        <h2 className="participant-card__name">{person.name}</h2>
        {person.teamSetup ? (
          <span className="participant-card__team">{person.teamSetup}</span>
        ) : null}
      </div>

      {person.projectIdea ? (
        <p className="participant-card__idea">{person.projectIdea}</p>
      ) : (
        <p className="participant-card__idea participant-card__idea--empty">
          Project details coming soon.
        </p>
      )}

      <div className="participant-card__links">
        {tg ? (
          <Link href={tg} className="participant-card__link" target="_blank" rel="noopener noreferrer">
            Telegram
          </Link>
        ) : null}
        {proofUrl ? (
          <Link
            href={proofUrl}
            className="participant-card__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Proof of work
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export async function ParticipantDirectory() {
  const people = await getPublicParticipants();

  if (people.length === 0) {
    return (
      <SectionArticle className="participant-directory__empty">
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
      <p className="participant-directory__count">
        {people.length} builders registered
      </p>
      <ul className="participant-directory__grid">
        {people.map((person) => (
          <li key={person.id}>
            <ParticipantCard person={person} />
          </li>
        ))}
      </ul>
    </SectionArticle>
  );
}
