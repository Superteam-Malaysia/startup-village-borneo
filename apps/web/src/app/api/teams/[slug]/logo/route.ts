import { NextResponse } from "next/server";

/** File uploads disabled — set logo URL on the team edit form instead (zero storage cost). */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Logo uploads are disabled. Paste an HTTPS logo link on your team page instead.",
    },
    { status: 410 },
  );
}

// Previous implementation used Railway Bucket / local disk — kept for reference.
// import { saveTeamLogo } from "@/lib/uploads/save-upload";
