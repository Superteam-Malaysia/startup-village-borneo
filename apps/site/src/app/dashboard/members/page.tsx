export const dynamic = "force-dynamic";

import { createServerClient } from "@/lib/supabase/server";
import { getAllProfiles } from "@/lib/supabase/queries";
import { AdminMembersClient } from "@/app/admin/members/AdminMembersClient";
import type { UserRole } from "@/lib/types";

export default async function DashboardMembersPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userRole: UserRole = (user?.app_metadata?.user_role as UserRole) || "member";

  const profiles = await getAllProfiles();
  return <AdminMembersClient initialProfiles={profiles} userRole={userRole} />;
}
