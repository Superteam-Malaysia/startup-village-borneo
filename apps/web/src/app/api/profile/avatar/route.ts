import { NextResponse } from "next/server";

/** File uploads disabled — use an HTTPS image URL on your profile instead (zero storage cost). */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Image uploads are disabled. Paste an HTTPS profile photo link on your profile page instead.",
    },
    { status: 410 },
  );
}

// Previous implementation used Railway Bucket / local disk — kept for reference.
// import { saveParticipantAvatar } from "@/lib/uploads/save-upload";
