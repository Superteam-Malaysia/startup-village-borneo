export const dynamic = "force-dynamic";

import { getPartners } from "@/lib/supabase/queries";
import { AdminPartnersClient } from "@/app/admin/partners/AdminPartnersClient";

export default async function DashboardPartnersPage() {
  const partners = await getPartners();
  return <AdminPartnersClient initialPartners={partners} />;
}
