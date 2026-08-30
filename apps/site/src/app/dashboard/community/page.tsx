export const dynamic = "force-dynamic";

import { getTweet } from "react-tweet/api";
import { AdminCommunityClient } from "@/app/admin/community/AdminCommunityClient";
import { getCommunityTweets } from "@/lib/supabase/queries";
import type { CommunityTweet } from "@/lib/types";

function truncateText(text: string, maxLength: number): string {
  return text.length <= maxLength ? text : `${text.slice(0, maxLength)}…`;
}

export default async function CommunityPage() {
  const tweets = await getCommunityTweets();

  const enriched = await Promise.all(
    tweets.map(async (t): Promise<CommunityTweet> => {
      try {
        const data = await getTweet(t.tweet_id);
        if (!data) return t;
        return {
          ...t,
          author_name: data.user.name,
          author_handle: data.user.screen_name ? `@${data.user.screen_name}` : undefined,
          text_excerpt: truncateText(data.text, 80),
        };
      } catch {
        return t;
      }
    })
  );

  return <AdminCommunityClient initialTweets={enriched} />;
}
