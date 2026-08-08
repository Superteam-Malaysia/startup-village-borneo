import Link from "next/link";
import Image from "next/image";
import type { WorkshopPreview } from "@/data/speakers";

const THUMB_ACCENTS = ["workshop-row__thumb--azure", "workshop-row__thumb--byte", "workshop-row__thumb--lime"] as const;

function speakerInitials(speaker: string) {
  const parts = speaker.split(/[\s/]+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }
  return (speaker.slice(0, 2) || "?").toUpperCase();
}

function SpeakerThumb({
  session,
  index,
  size = "md",
}: {
  session: WorkshopPreview;
  index: number;
  size?: "md" | "sm";
}) {
  const accent = THUMB_ACCENTS[index % THUMB_ACCENTS.length];
  const className = [
    "workshop-row__thumb",
    size === "sm" ? "workshop-row__thumb--sm" : "",
    session.avatar ? "workshop-row__thumb--photo" : accent,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className} aria-hidden={session.avatar ? undefined : true}>
      {session.avatar ? (
        <Image
          src={session.avatar}
          alt=""
          width={400}
          height={400}
          className="workshop-row__thumb-image"
          sizes={size === "sm" ? "5rem" : "9rem"}
        />
      ) : (
        <span>{speakerInitials(session.speaker)}</span>
      )}
    </div>
  );
}

function WorkshopRow({ session, index }: { session: WorkshopPreview; index: number }) {
  const scheduleHref = `/schedule?day=${session.dayIndex}`;
  const when = `${session.date} · ${session.start}`;
  const org = session.organization ?? session.speaker;

  return (
    <article className="workshop-row group">
      {/* Desktop — Colosseum Breakout livestream row */}
      <div className="workshop-row__desktop hidden md:flex">
        <SpeakerThumb session={session} index={index} />

        <div className="workshop-row__body">
          <h3 className="workshop-row__title">{session.title}</h3>
          <p className="workshop-row__speaker workshop-row__speaker--inline">
            {session.speaker} - {org}
          </p>
          <p className="workshop-row__speaker workshop-row__speaker--stack">
            <span>{session.speaker}</span>
            <span>{org}</span>
          </p>
        </div>

        <div className="workshop-row__aside">
          <div className="workshop-row__when">
            <time dateTime={`2026-09-0${session.dayIndex}T${session.start}`}>{when}</time>
          </div>
          <Link href={scheduleHref} className="workshop-row__link" aria-label={`${session.title} on schedule`}>
            <IconArrowDiagonal />
          </Link>
        </div>
      </div>

      {/* Mobile — compact single row: thumb · body · link */}
      <div className="workshop-row__mobile flex md:hidden">
        <SpeakerThumb session={session} index={index} size="sm" />

        <div className="workshop-row__body workshop-row__body--mobile">
          <h3 className="workshop-row__title">{session.title}</h3>
          <p className="workshop-row__speaker workshop-row__speaker--stack">
            <span>{session.speaker}</span>
            <span>{org}</span>
          </p>
          <p className="workshop-row__when-inline">
            <time dateTime={`2026-09-0${session.dayIndex}T${session.start}`}>{when}</time>
          </p>
        </div>

        <Link href={scheduleHref} className="workshop-row__link" aria-label={`${session.title} on schedule`}>
          <IconArrowDiagonal />
        </Link>
      </div>
    </article>
  );
}

function IconArrowDiagonal() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <path
        d="M31.2507 10V26.25C31.2507 26.5815 31.119 26.8995 30.8846 27.1339C30.6502 27.3683 30.3322 27.5 30.0007 27.5C29.6692 27.5 29.3512 27.3683 29.1168 27.1339C28.8824 26.8995 28.7507 26.5815 28.7507 26.25V13.0172L10.8851 30.8844C10.6505 31.1189 10.3324 31.2507 10.0007 31.2507C9.66899 31.2507 9.35087 31.1189 9.11632 30.8844C8.88177 30.6498 8.75 30.3317 8.75 30C8.75 29.6683 8.88177 29.3502 9.11632 29.1156L26.9835 11.25H13.7507C13.4192 11.25 13.1012 11.1183 12.8668 10.8839C12.6324 10.6495 12.5007 10.3315 12.5007 10C12.5007 9.66848 12.6324 9.35054 12.8668 9.11612C13.1012 8.8817 13.4192 8.75 13.7507 8.75H30.0007C30.3322 8.75 30.6502 8.8817 30.8846 9.11612C31.119 9.35054 31.2507 9.66848 31.2507 10Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Breakout-style stacked workshop rows — title, speaker, slot, schedule link. */
export function WorkshopRowList({
  sessions,
  limit,
}: {
  sessions: WorkshopPreview[];
  limit?: number;
}) {
  const items = limit ? sessions.slice(0, limit) : sessions;

  return (
    <div className="workshop-rows">
      {items.map((session, index) => (
        <WorkshopRow key={session.id} session={session} index={index} />
      ))}
    </div>
  );
}
