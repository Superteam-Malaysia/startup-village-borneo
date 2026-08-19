import { ScheduleExplorer } from "@/components/schedule";
import { PageHeader } from "@/components/shell";

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
    <main className="site-main">
      <PageHeader title="Program schedule" />
      <ScheduleExplorer initialDay={initialDay} />
    </main>
  );
}
