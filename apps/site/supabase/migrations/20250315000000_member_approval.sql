-- Member approval flow
-- Anyone can register; a super admin approves before the account becomes a real member.
-- Invite redemptions bypass the queue (the invite itself is the approval).

-- =============================================================================
-- 1. approval_status on profiles
-- =============================================================================

DO $$ BEGIN
  CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS approval_status approval_status NOT NULL DEFAULT 'pending';
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Everyone who already had an account is grandfathered in, so nobody currently
-- signed in gets bounced to the pending screen after this ships.
UPDATE profiles
SET approval_status = 'approved',
    approved_at = COALESCE(approved_at, created_at, now())
WHERE approval_status = 'pending';

CREATE INDEX IF NOT EXISTS idx_profiles_approval_status
  ON profiles(approval_status);

-- =============================================================================
-- 2. Stop members escalating their own privileges
-- =============================================================================
-- profiles_update allows `auth.uid() = id`, so before this trigger a member could
-- UPDATE their own row and set user_role = 'super_admin'. RLS itself reads the role
-- from the JWT (get_user_role()), so that alone granted no database access -- but the
-- dashboard sidebar and admin client components read profiles.user_role, so the admin
-- UI would unlock for them. With approval_status the same hole would let a pending
-- user self-approve, which is a real bypass. Lock the privileged columns to
-- super admins and the service role.

CREATE OR REPLACE FUNCTION public.protect_profile_privileged_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Server-side admin routes use the service role key and are already role-checked.
  IF auth.role() = 'service_role' OR public.get_user_role() = 'super_admin' THEN
    RETURN NEW;
  END IF;

  NEW.user_role       := OLD.user_role;
  NEW.approval_status := OLD.approval_status;
  NEW.approved_at     := OLD.approved_at;
  NEW.approved_by     := OLD.approved_by;
  NEW.is_active       := OLD.is_active;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS protect_profile_privileged_fields ON profiles;
CREATE TRIGGER protect_profile_privileged_fields
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_privileged_fields();

-- Self-registration inserts its own profile row (profiles_insert = auth.uid() = id),
-- so pin the privileged columns on INSERT too.
CREATE OR REPLACE FUNCTION public.force_profile_insert_defaults()
RETURNS TRIGGER AS $$
BEGIN
  IF auth.role() = 'service_role' OR public.get_user_role() = 'super_admin' THEN
    RETURN NEW;
  END IF;

  NEW.user_role       := 'member';
  NEW.approval_status := 'pending';
  NEW.approved_at     := NULL;
  NEW.approved_by     := NULL;
  NEW.is_active       := true;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS force_profile_insert_defaults ON profiles;
CREATE TRIGGER force_profile_insert_defaults
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.force_profile_insert_defaults();

-- =============================================================================
-- 3. Fix perks RLS
-- =============================================================================
-- These were `auth.role() = 'authenticated'`, which let any signed-in member
-- insert/update/delete perks straight from the browser with the anon key.

DROP POLICY IF EXISTS "Admin insert perks" ON perks;
DROP POLICY IF EXISTS "Admin update perks" ON perks;
DROP POLICY IF EXISTS "Admin delete perks" ON perks;

CREATE POLICY "perks_insert" ON perks
  FOR INSERT WITH CHECK (public.get_user_role() = ANY (ARRAY['super_admin', 'admin']));
CREATE POLICY "perks_update" ON perks
  FOR UPDATE USING (public.get_user_role() = ANY (ARRAY['super_admin', 'admin']));
CREATE POLICY "perks_delete" ON perks
  FOR DELETE USING (public.get_user_role() = ANY (ARRAY['super_admin', 'admin']));
