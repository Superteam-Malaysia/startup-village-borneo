-- Newsletter subscribers — emails captured by the footer signup form.
-- Deliberately isolated from `profiles`/`members`: these are anonymous visitors,
-- not community members, and nothing here should ever join against member data.
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  -- Dedupe key: lowercased/trimmed email. Generated so the app can never
  -- insert a duplicate by forgetting to normalise first.
  email_normalized TEXT GENERATED ALWAYS AS (lower(btrim(email))) STORED UNIQUE,
  -- Where the signup came from, e.g. "footer" / "footer-mobile".
  source TEXT DEFAULT 'footer',
  is_active BOOLEAN DEFAULT true,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- No public read and no public insert on purpose. The landing page posts to
-- /api/subscribe, which writes with the service-role key. That keeps the list
-- unreadable and unenumerable from the browser even though anyone may sign up.
CREATE POLICY "newsletter_subscribers_admin_read" ON newsletter_subscribers
  FOR SELECT USING (public.get_user_role() IN ('super_admin', 'admin'));
CREATE POLICY "newsletter_subscribers_admin_update" ON newsletter_subscribers
  FOR UPDATE USING (public.get_user_role() IN ('super_admin', 'admin'));
CREATE POLICY "newsletter_subscribers_admin_delete" ON newsletter_subscribers
  FOR DELETE USING (public.get_user_role() IN ('super_admin', 'admin'));

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created_at
  ON newsletter_subscribers(created_at DESC);
