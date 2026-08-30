-- Event photo dome on the landing page. Previously a hardcoded loop over
-- /images/events/1..32.jpeg, which meant adding a photo required a code change
-- and a deploy. Move it to storage + a table so admins can manage it.

INSERT INTO storage.buckets (id, name, public)
VALUES ('event-photos', 'event-photos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read event photos" ON storage.objects;
CREATE POLICY "Public read event photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-photos');

DROP POLICY IF EXISTS "Admin upload event photos" ON storage.objects;
CREATE POLICY "Admin upload event photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event-photos');

DROP POLICY IF EXISTS "Admin update event photos" ON storage.objects;
CREATE POLICY "Admin update event photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'event-photos');

DROP POLICY IF EXISTS "Admin delete event photos" ON storage.objects;
CREATE POLICY "Admin delete event photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'event-photos');

CREATE TABLE IF NOT EXISTS event_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE event_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "event_photos_public_read" ON event_photos
  FOR SELECT USING (true);
CREATE POLICY "event_photos_admin_insert" ON event_photos
  FOR INSERT WITH CHECK (public.get_user_role() IN ('super_admin', 'admin'));
CREATE POLICY "event_photos_admin_update" ON event_photos
  FOR UPDATE USING (public.get_user_role() IN ('super_admin', 'admin'));
CREATE POLICY "event_photos_admin_delete" ON event_photos
  FOR DELETE USING (public.get_user_role() IN ('super_admin', 'admin'));

CREATE INDEX IF NOT EXISTS idx_event_photos_display_order
  ON event_photos(display_order);

-- Seed with the 32 files already in the repo so the dome looks identical the
-- moment this ships. They keep working from /public until replaced.
INSERT INTO event_photos (image_url, display_order)
SELECT '/images/events/' || n || '.jpeg', n
FROM generate_series(1, 32) AS n
WHERE NOT EXISTS (SELECT 1 FROM event_photos);
