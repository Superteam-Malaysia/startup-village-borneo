-- Community Tweets (Wall of Love) - X/Twitter posts for landing page
CREATE TABLE IF NOT EXISTS community_tweets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tweet_id TEXT NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE community_tweets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "community_tweets_public_read" ON community_tweets
  FOR SELECT USING (true);

CREATE POLICY "community_tweets_insert" ON community_tweets
  FOR INSERT WITH CHECK (public.get_user_role() IN ('super_admin', 'admin'));
CREATE POLICY "community_tweets_update" ON community_tweets
  FOR UPDATE USING (public.get_user_role() IN ('super_admin', 'admin'));
CREATE POLICY "community_tweets_delete" ON community_tweets
  FOR DELETE USING (public.get_user_role() IN ('super_admin', 'admin'));

CREATE INDEX IF NOT EXISTS idx_community_tweets_display_order ON community_tweets(display_order);
