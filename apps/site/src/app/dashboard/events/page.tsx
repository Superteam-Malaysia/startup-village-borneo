export const dynamic = "force-dynamic";

import { getEvents } from "@/lib/supabase/queries";
import { AdminEventsClient } from "@/app/admin/events/AdminEventsClient";

export default async function DashboardEventsPage() {
  const events = await getEvents({ includeArchived: true });
  return <AdminEventsClient initialEvents={events} />;
}
