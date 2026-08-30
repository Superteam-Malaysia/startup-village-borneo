import { NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";

// Deliberately loose: enough to reject obvious junk without bouncing valid
// addresses that a stricter regex would get wrong.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ALLOWED_SOURCES = ["footer", "footer-mobile"];

/** Public — the landing page footer posts here. */
export async function POST(request: Request) {
  let body: { email?: unknown; source?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const source =
    typeof body.source === "string" && ALLOWED_SOURCES.includes(body.source)
      ? body.source
      : "footer";

  // Service role: the table is closed to anon reads/writes by RLS.
  const admin = createAdminClient();
  const { error } = await admin
    .from("newsletter_subscribers")
    .insert({ email, source });

  if (error) {
    // 23505 = unique violation on email_normalized. Already subscribed is a
    // success from the visitor's point of view, and answering differently
    // would leak whether an address is on the list.
    if (error.code === "23505") {
      return NextResponse.json({ success: true, alreadySubscribed: true });
    }
    console.error("Newsletter signup failed:", error.message);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

/** Admin only — used by the dashboard to remove a subscriber outright. */
export async function DELETE(request: Request) {
  const supabase = await createServerClient();
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("user_role")
    .eq("id", user.id)
    .single();

  if (!profile || !["super_admin", "admin"].includes(profile.user_role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const { error } = await admin
    .from("newsletter_subscribers")
    .delete()
    .eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
