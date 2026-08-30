import { getTweet } from "react-tweet/api";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing tweet ID" }, { status: 400 });
  }

  try {
    const tweet = await getTweet(id);
    if (!tweet) {
      return NextResponse.json({ error: "Tweet not found" }, { status: 404 });
    }

    return NextResponse.json({
      author_name: tweet.user.name,
      author_handle: tweet.user.screen_name ? `@${tweet.user.screen_name}` : undefined,
      text_excerpt: tweet.text.slice(0, 80) + (tweet.text.length > 80 ? "…" : ""),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch tweet" }, { status: 500 });
  }
}
