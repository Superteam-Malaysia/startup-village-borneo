export const dynamic = "force-dynamic";

import { AdminContentClient } from "@/app/admin/content/AdminContentClient";
import { getSiteContent, getFAQs } from "@/lib/supabase/queries";

export default async function DashboardContentPage() {
  const [siteContent, faqs] = await Promise.all([getSiteContent(), getFAQs()]);
  return <AdminContentClient initialSiteContent={siteContent} initialFAQs={faqs} />;
}
