import { DEMO_DAY_JUDGES } from "@/data/judges";
import { WORKSHOP_SESSIONS } from "@/data/speakers";
import { participantInitials } from "@/lib/participants/team-categories";
import type { MentorFilter, PublicMentor, PublicMentorWorkshop } from "@/lib/mentors/types";

export type { MentorFilter, PublicMentor, PublicMentorWorkshop } from "@/lib/mentors/types";

/** Extra contact fields not in the speakers schedule export. */
const MENTOR_CONTACT: Record<string, { email?: string; telegram?: string }> = {
  semi: {
    email: "semi@sendarcade.fun",
    telegram: "semi_infiknight",
  },
};

function mentorSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function twitterHref(handle: string | null): string | null {
  if (!handle?.trim()) return null;
  const clean = handle.replace(/^@/, "").trim();
  return clean ? `https://x.com/${clean}` : null;
}

function linkedinHref(slug: string | null): string | null {
  if (!slug?.trim()) return null;
  return `https://www.linkedin.com/in/${slug.replace(/^\/+|\/+$/g, "")}`;
}

function telegramHref(value: string | null): string | null {
  if (!value?.trim()) return null;
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const handle = trimmed.replace(/^@/, "");
  return handle ? `https://t.me/${handle}` : null;
}

export function mentorConnectHref(mentor: PublicMentor): string | null {
  return (
    twitterHref(mentor.twitter) ??
    telegramHref(mentor.telegram) ??
    linkedinHref(mentor.linkedin) ??
    (mentor.email ? `mailto:${mentor.email}` : null)
  );
}

export function mentorConnectLabel(mentor: PublicMentor): string {
  if (twitterHref(mentor.twitter)) return "Connect";
  if (telegramHref(mentor.telegram)) return "Telegram";
  if (linkedinHref(mentor.linkedin)) return "LinkedIn";
  if (mentor.email) return "Email";
  return "Connect";
}

export function mentorRoleLabel(mentor: PublicMentor): string {
  if (mentor.isWorkshopLeader && mentor.isJudge) return "Workshop · Judge";
  if (mentor.isJudge) return "Demo Day judge";
  return "Workshop leader";
}

export function mentorPrimaryLine(mentor: PublicMentor): string {
  if (mentor.workshops.length > 0) {
    return mentor.workshops[0].title;
  }
  return mentor.judgeRole ?? mentor.organization ?? "SVB 2026 mentor";
}

export function mentorSecondaryLine(mentor: PublicMentor): string {
  if (mentor.workshops.length > 0) {
    const slot = mentor.workshops[0];
    return `${slot.dayLabel} · ${slot.date} · ${slot.start}`;
  }
  return mentor.organization ?? mentor.judgeRole ?? "Demo Day";
}

/** Workshop leaders + Demo Day judges for the mentors directory. */
export function getPublicMentors(): PublicMentor[] {
  const byId = new Map<string, PublicMentor>();

  for (const session of WORKSHOP_SESSIONS) {
    const id = mentorSlug(session.speaker);
    const workshop: PublicMentorWorkshop = {
      title: session.title,
      dayLabel: session.dayLabel,
      date: session.date,
      start: session.start,
    };
    const contact = MENTOR_CONTACT[id];
    const existing = byId.get(id);

    if (existing) {
      existing.workshops.push(workshop);
      if (session.organization && !existing.organization) {
        existing.organization = session.organization;
      }
      if (session.avatar && !existing.avatar) existing.avatar = session.avatar;
      if (session.twitter && !existing.twitter) existing.twitter = session.twitter;
      if (session.linkedin && !existing.linkedin) existing.linkedin = session.linkedin;
      continue;
    }

    byId.set(id, {
      id,
      name: session.speaker,
      organization: session.organization ?? null,
      isWorkshopLeader: true,
      isJudge: false,
      judgeRole: null,
      workshops: [workshop],
      avatar: session.avatar ?? null,
      twitter: session.twitter ?? null,
      linkedin: session.linkedin ?? null,
      telegram: contact?.telegram ?? null,
      email: contact?.email ?? null,
      initials: participantInitials(session.speaker),
    });
  }

  for (const judge of DEMO_DAY_JUDGES) {
    const contact = MENTOR_CONTACT[judge.id];
    const existing = byId.get(judge.id);

    if (existing) {
      existing.isJudge = true;
      existing.judgeRole = judge.role;
      if (judge.photo && !existing.avatar) existing.avatar = judge.photo;
      if (!existing.organization) existing.organization = judge.role;
      continue;
    }

    byId.set(judge.id, {
      id: judge.id,
      name: judge.name,
      organization: judge.role,
      isWorkshopLeader: false,
      isJudge: true,
      judgeRole: judge.role,
      workshops: [],
      avatar: judge.photo ?? null,
      twitter: null,
      linkedin: null,
      telegram: contact?.telegram ?? null,
      email: contact?.email ?? null,
      initials: participantInitials(judge.name),
    });
  }

  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export const MENTOR_FILTER_TABS: { id: MentorFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "workshop", label: "Workshops" },
  { id: "judge", label: "Judges" },
];

export function filterMentors(mentors: PublicMentor[], query: string, filter: MentorFilter): PublicMentor[] {
  const q = query.trim().toLowerCase();

  return mentors.filter((mentor) => {
    if (filter === "workshop" && !mentor.isWorkshopLeader) return false;
    if (filter === "judge" && !mentor.isJudge) return false;
    if (!q) return true;

    const haystack = [
      mentor.name,
      mentor.organization,
      mentor.judgeRole,
      mentorRoleLabel(mentor),
      ...mentor.workshops.map((w) => `${w.title} ${w.dayLabel} ${w.date}`),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}
