export const dynamic = "force-dynamic";

import { getPerks } from "@/lib/supabase/queries";
import { PerksPageClient } from "./PerksPageClient";

export default async function PerksPage() {
  const perks = await getPerks();
  return <PerksPageClient perks={perks} />;
}
