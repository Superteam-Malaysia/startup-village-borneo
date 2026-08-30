-- Members can now pick their own badges from the profile page. profiles_update
-- allows `auth.uid() = id`, so without a guard a member could POST directly to
-- PostgREST and hand themselves "Core Contributor". Pin that one badge to
-- admins the same way protect_profile_privileged_fields pins user_role.
CREATE OR REPLACE FUNCTION public.protect_admin_only_badges()
RETURNS TRIGGER AS $$
DECLARE
  admin_only TEXT := 'Core Contributor';
  had_badge  BOOLEAN;
BEGIN
  -- Admin routes use the service role key and are already role-checked.
  IF auth.role() = 'service_role'
     OR public.get_user_role() IN ('super_admin', 'admin') THEN
    RETURN NEW;
  END IF;

  had_badge := COALESCE(OLD.badges, '{}') @> ARRAY[admin_only];

  IF had_badge THEN
    -- Keep it even if the client dropped it, so members can't self-remove
    -- and re-add to work around the guard.
    IF NOT (COALESCE(NEW.badges, '{}') @> ARRAY[admin_only]) THEN
      NEW.badges := COALESCE(NEW.badges, '{}') || admin_only;
    END IF;
  ELSE
    -- Never let a non-admin grant it to themselves.
    NEW.badges := array_remove(COALESCE(NEW.badges, '{}'), admin_only);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS protect_admin_only_badges ON profiles;
CREATE TRIGGER protect_admin_only_badges
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_admin_only_badges();

-- Same on INSERT: self-registration writes its own row.
CREATE OR REPLACE FUNCTION public.force_badge_insert_defaults()
RETURNS TRIGGER AS $$
BEGIN
  IF auth.role() = 'service_role'
     OR public.get_user_role() IN ('super_admin', 'admin') THEN
    RETURN NEW;
  END IF;

  NEW.badges := array_remove(COALESCE(NEW.badges, '{}'), 'Core Contributor');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS force_badge_insert_defaults ON profiles;
CREATE TRIGGER force_badge_insert_defaults
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.force_badge_insert_defaults();
