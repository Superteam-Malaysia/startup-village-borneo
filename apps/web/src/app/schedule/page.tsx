import { ScheduleExplorer } from "@/components/schedule";
import { SITE } from "@/data/site";

export const metadata = {
  title: "Schedule",
  description: "Five-day program calendar — Startup Village Borneo 2026",
};

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ day?: string }>;
}) {
  const params = await searchParams;
  const day = Number(params.day) || 1;
  const initialDay = day >= 1 && day <= 5 ? day : 1;

  return (
    <main className="max-w-[90rem] mx-auto px-4 md:px-8 py-12 md:py-20">
      <p className="text-eyebrow mb-6">{SITE.dates}</p>
      <h1
        className="font-[family-name:var(--font-display)] text-[clamp(2rem,5vw,4rem)] tracking-tight text-[var(--color-wisp)] mb-12"
      >
        Program schedule
      </h1>
      <ScheduleExplorer initialDay={initialDay} />
    </main>
  );
}
