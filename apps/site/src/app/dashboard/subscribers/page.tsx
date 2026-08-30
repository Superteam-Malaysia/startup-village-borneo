export const dynamic = "force-dynamic";

import { AdminSubscribersClient } from "@/app/admin/subscribers/AdminSubscribersClient";
import { getNewsletterSubscribers } from "@/lib/supabase/queries";

export default async function SubscribersPage() {
  const subscribers = await getNewsletterSubscribers();
  return <AdminSubscribersClient initialSubscribers={subscribers} />;
}
