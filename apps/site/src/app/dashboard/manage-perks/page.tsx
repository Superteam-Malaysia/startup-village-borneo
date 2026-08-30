export const dynamic = "force-dynamic";

import { getPerks } from "@/lib/supabase/queries";
import { AdminPerksClient } from "@/app/admin/perks/AdminPerksClient";

export default async function ManagePerksPage() {
  const perks = await getPerks();
  return <AdminPerksClient initialPerks={perks} />;
}
