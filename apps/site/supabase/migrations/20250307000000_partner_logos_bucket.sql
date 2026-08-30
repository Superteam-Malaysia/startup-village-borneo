-- Storage bucket for partner logo images (public read, authenticated write)
INSERT INTO storage.buckets (id, name, public)
VALUES ('partner-logos', 'partner-logos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read partner logos" ON storage.objects;
CREATE POLICY "Public read partner logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'partner-logos');

DROP POLICY IF EXISTS "Admin upload partner logos" ON storage.objects;
CREATE POLICY "Admin upload partner logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'partner-logos');

DROP POLICY IF EXISTS "Admin update partner logos" ON storage.objects;
CREATE POLICY "Admin update partner logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'partner-logos');

DROP POLICY IF EXISTS "Admin delete partner logos" ON storage.objects;
CREATE POLICY "Admin delete partner logos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'partner-logos');
