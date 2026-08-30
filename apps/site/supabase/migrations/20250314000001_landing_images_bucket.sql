-- Storage bucket for landing page images (mission pillars, etc.)
INSERT INTO storage.buckets (id, name, public)
VALUES ('landing-images', 'landing-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read landing images" ON storage.objects;
CREATE POLICY "Public read landing images"
ON storage.objects FOR SELECT
USING (bucket_id = 'landing-images');

DROP POLICY IF EXISTS "Admin upload landing images" ON storage.objects;
CREATE POLICY "Admin upload landing images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'landing-images');

DROP POLICY IF EXISTS "Admin update landing images" ON storage.objects;
CREATE POLICY "Admin update landing images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'landing-images');

DROP POLICY IF EXISTS "Admin delete landing images" ON storage.objects;
CREATE POLICY "Admin delete landing images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'landing-images');
