import { RACE_CUTOFF, RACE_TASKS, type RaceTask } from "@/data/race-tasks";

const THREAD_HOSTS = new Set(["twitter.com", "x.com", "www.twitter.com", "mobile.twitter.com"]);

const raceTaskIds = new Set(RACE_TASKS.map((task) => task.id));

export function getRaceTask(taskId: string): RaceTask | undefined {
  return RACE_TASKS.find((task) => task.id === taskId);
}

export function isValidRaceTaskId(taskId: string): boolean {
  return raceTaskIds.has(taskId);
}

export function isRaceCutoffPassed(now = new Date()): boolean {
  return now.getTime() > new Date(RACE_CUTOFF.iso).getTime();
}

/** Accept x.com / twitter.com status URLs. Returns canonical https URL or null. */
export function normalizeThreadUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }

  if (!THREAD_HOSTS.has(url.hostname.toLowerCase())) return null;
  if (!url.pathname.includes("/status/")) return null;

  url.protocol = "https:";
  url.hash = "";
  return url.toString();
}

export function validateRaceSubmissionInput(taskId: string, threadUrl: string) {
  if (!isValidRaceTaskId(taskId)) {
    return { ok: false as const, error: "Unknown race task." };
  }

  const normalized = normalizeThreadUrl(threadUrl);
  if (!normalized) {
    return { ok: false as const, error: "Enter a valid X/Twitter thread URL (x.com/.../status/...)." };
  }

  if (isRaceCutoffPassed()) {
    return { ok: false as const, error: `Submissions closed — cutoff was ${RACE_CUTOFF.time} on ${RACE_CUTOFF.label}.` };
  }

  return { ok: true as const, taskId, threadUrl: normalized };
}
