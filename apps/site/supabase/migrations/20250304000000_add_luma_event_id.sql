-- Add luma_event_id for matching ICS events during sync (unique, nullable for manual events)
ALTER TABLE events ADD COLUMN IF NOT EXISTS luma_event_id TEXT UNIQUE;

-- Create index for faster upsert lookups
CREATE INDEX IF NOT EXISTS idx_events_luma_event_id ON events(luma_event_id) WHERE luma_event_id IS NOT NULL;

-- Storage bucket for event cover images (public read, authenticated write)
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-covers', 'event-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read for event covers
DROP POLICY IF EXISTS "Public read event covers" ON storage.objects;
CREATE POLICY "Public read event covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-covers');

-- Allow authenticated users (admins) to upload
DROP POLICY IF EXISTS "Admin upload event covers" ON storage.objects;
CREATE POLICY "Admin upload event covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event-covers');

-- Allow authenticated users to update/delete their uploads
DROP POLICY IF EXISTS "Admin update event covers" ON storage.objects;
CREATE POLICY "Admin update event covers"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'event-covers');

DROP POLICY IF EXISTS "Admin delete event covers" ON storage.objects;
CREATE POLICY "Admin delete event covers"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'event-covers');
