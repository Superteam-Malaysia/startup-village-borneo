/**
 * Seed dashboard metrics and update events with attendee counts.
 * Run: npx tsx scripts/seed-dashboard.ts
 * Does NOT clear any data - only upserts dashboard_metrics and updates events.
 */
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: [".env.local", ".env"] });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  console.log("\nSeeding dashboard data for charts...\n");

  // Upsert dashboard_metrics
  const dashboardMetrics = [
    { metric_key: "gdp_brought_malaysia", value: 48500, period: "overall" },
    { metric_key: "gdp_brought_malaysia", value: 8200, period: "this_month" },
    { metric_key: "grants_awarded", value: 12, period: "overall" },
    { metric_key: "grants_awarded", value: 2, period: "this_month" },
    { metric_key: "bounties_awarded", value: 136985, period: "overall" },
    { metric_key: "bounties_awarded", value: 0, period: "this_month" },
  ];

  const { error: dmError } = await supabase.from("dashboard_metrics").upsert(dashboardMetrics, {
    onConflict: "metric_key,period",
  });

  if (dmError) {
    console.error("Dashboard metrics error:", dmError.message);
    console.log("Run the migration first: npx supabase db push");
    process.exit(1);
  }
  console.log("✓ dashboard_metrics updated");

  // Update events that don't have attendee_count
  const { data: events } = await supabase.from("events").select("id, attendee_count").or("is_archived.is.null,is_archived.eq.false");
  const demoAttendees = [85, 120, 45, 150, 62, 38, 95, 72];
  let updated = 0;
  for (let i = 0; i < (events?.length ?? 0); i++) {
    const ev = events![i];
    if (ev.attendee_count == null) {
      const count = demoAttendees[i % demoAttendees.length];
      await supabase.from("events").update({ attendee_count: count }).eq("id", ev.id);
      updated++;
    }
  }
  if (updated > 0) {
    console.log(`✓ Updated ${updated} events with attendee_count`);
  } else {
    console.log("✓ Events already have attendee_count");
  }

  console.log("\nDone! Refresh the admin dashboard to see the charts.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
