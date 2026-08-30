export const dynamic = "force-dynamic";

import { AdminStatsClient } from "@/app/admin/stats/AdminStatsClient";
import { getStats } from "@/lib/supabase/queries";

export default async function StatsPage() {
  const stats = await getStats();
  return <AdminStatsClient initialStats={stats} />;
}
