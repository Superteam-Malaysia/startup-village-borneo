-- Every content table created in schema.sql shipped with
-- `auth.role() = 'authenticated'` write policies. That is not an admin check --
-- it is true for any signed-in member, who can therefore INSERT/UPDATE/DELETE
-- these rows straight from the browser with the anon key, bypassing the admin
-- UI entirely.
--
-- perks was fixed in 20250315000000_member_approval.sql and stats in
-- 20250317000000_stats_admin_rls.sql. This migration closes the same hole on the
-- six tables that were left behind, plus the lookup tables and the avatars
-- bucket, so the whole schema uses one pattern:
--
--     public.get_user_role() IN ('super_admin', 'admin')
--
-- Public SELECT policies are deliberately untouched -- the landing page reads
-- these tables anonymously.

-- =============================================================================
-- 1. Content tables
-- =============================================================================

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'members', 'events', 'partners', 'testimonials', 'faqs', 'site_content'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Admin insert" ON %I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Admin update" ON %I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Admin delete" ON %I', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', t || '_admin_insert', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', t || '_admin_update', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', t || '_admin_delete', t);

    EXECUTE format(
      'CREATE POLICY %I ON %I FOR INSERT WITH CHECK '
      '(public.get_user_role() IN (''super_admin'', ''admin''))',
      t || '_admin_insert', t
    );
    EXECUTE format(
      'CREATE POLICY %I ON %I FOR UPDATE USING '
      '(public.get_user_role() IN (''super_admin'', ''admin''))',
      t || '_admin_update', t
    );
    EXECUTE format(
      'CREATE POLICY %I ON %I FOR DELETE USING '
      '(public.get_user_role() IN (''super_admin'', ''admin''))',
      t || '_admin_delete', t
    );
  END LOOP;
END $$;

-- =============================================================================
-- 2. Lookup tables
-- =============================================================================
-- Only ever SELECTed from the client (profile + onboarding read them to populate
-- the tag pickers); nothing in the app inserts a tag as a member. Restricting
-- INSERT stops a member polluting the shared tag lists.

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['roles', 'companies', 'skills', 'subskills'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', t || '_insert', t);
    EXECUTE format(
      'CREATE POLICY %I ON %I FOR INSERT WITH CHECK '
      '(public.get_user_role() IN (''super_admin'', ''admin''))',
      t || '_insert', t
    );
  END LOOP;
END $$;

-- =============================================================================
-- 3. avatars bucket
-- =============================================================================
-- The write policies checked only `auth.role() = 'authenticated'`, so any member
-- could overwrite or delete any other member's avatar. Uploads already go to
-- `{user_id}/{timestamp}.{ext}` (see dashboard/profile and onboarding), so scope
-- writes to the uploader's own folder and let admins manage everything.

DROP POLICY IF EXISTS "avatars_auth_insert" ON storage.objects;
DROP POLICY IF EXISTS "avatars_owner_insert" ON storage.objects;
DROP POLICY IF EXISTS "avatars_auth_update" ON storage.objects;
DROP POLICY IF EXISTS "avatars_owner_update" ON storage.objects;
DROP POLICY IF EXISTS "avatars_auth_delete" ON storage.objects;
DROP POLICY IF EXISTS "avatars_owner_delete" ON storage.objects;

CREATE POLICY "avatars_owner_insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.get_user_role() IN ('super_admin', 'admin')
  )
);

CREATE POLICY "avatars_owner_update"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'avatars'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.get_user_role() IN ('super_admin', 'admin')
  )
);

CREATE POLICY "avatars_owner_delete"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'avatars'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.get_user_role() IN ('super_admin', 'admin')
  )
);
