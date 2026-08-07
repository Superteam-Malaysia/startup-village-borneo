import { ScheduleExplorer } from "@/components/schedule";
import { PageHeader } from "@/components/shell";
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
      <PageHeader meta={SITE.dates} title="Program schedule" />
      <ScheduleExplorer initialDay={initialDay} />
    </main>
  );
}
