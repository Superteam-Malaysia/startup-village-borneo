-- The original stats policies granted write access to any authenticated user,
-- so a plain member could rewrite the landing-page numbers. Narrow them to the
-- same admin roles used by every other editable table.
DROP POLICY IF EXISTS "Admin insert" ON stats;
DROP POLICY IF EXISTS "Admin update" ON stats;
DROP POLICY IF EXISTS "Admin delete" ON stats;

CREATE POLICY "stats_admin_insert" ON stats
  FOR INSERT WITH CHECK (public.get_user_role() IN ('super_admin', 'admin'));
CREATE POLICY "stats_admin_update" ON stats
  FOR UPDATE USING (public.get_user_role() IN ('super_admin', 'admin'));
CREATE POLICY "stats_admin_delete" ON stats
  FOR DELETE USING (public.get_user_role() IN ('super_admin', 'admin'));
