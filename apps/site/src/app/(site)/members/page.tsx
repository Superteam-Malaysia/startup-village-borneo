export const dynamic = "force-dynamic";

import { getProfiles, getSubskills } from "@/lib/supabase/queries";
import { MembersPageClient } from "./MembersPageClient";

export default async function MembersPage() {
  const [profiles, subskills] = await Promise.all([
    getProfiles(),
    getSubskills(),
  ]);
  return <MembersPageClient profiles={profiles} availableSubskills={subskills} />;
}
