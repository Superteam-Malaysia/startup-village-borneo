import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { syncLumaEventsToSupabase } from "@/lib/luma-sync";

export async function POST() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { added, errors } = await syncLumaEventsToSupabase();
    return NextResponse.json({ added, errors });
  } catch (err) {
    console.error("Sync failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sync failed" },
      { status: 500 }
    );
  }
}
