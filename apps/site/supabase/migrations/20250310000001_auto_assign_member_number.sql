-- Auto-assign member_number when a profile completes onboarding
-- Uses a sequence for atomic, sequential numbering (#001, #002, ...)

-- Create sequence for member numbers (starts at 1)
CREATE SEQUENCE IF NOT EXISTS member_number_seq START 1;

-- Backfill: assign numbers to existing onboarded members who don't have one
WITH to_update AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) AS rn
  FROM profiles
  WHERE onboarding_completed = true AND member_number IS NULL
),
max_num AS (
  SELECT COALESCE(MAX(member_number), 0)::bigint AS m FROM profiles
)
UPDATE profiles p
SET member_number = (SELECT m FROM max_num) + to_update.rn
FROM to_update
WHERE p.id = to_update.id;

-- Sync sequence: next value = max(member_number) + 1
SELECT setval(
  'member_number_seq',
  COALESCE((SELECT MAX(member_number) FROM profiles), 0)
);

-- Trigger function: assign next member_number when onboarding_completed becomes true
CREATE OR REPLACE FUNCTION assign_member_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Assign when: onboarding just completed AND member_number is not set
  IF NEW.onboarding_completed = true
     AND (OLD IS NULL OR OLD.onboarding_completed = false)
     AND NEW.member_number IS NULL
  THEN
    NEW.member_number := nextval('member_number_seq');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on INSERT (e.g. bootstrap, direct profile creation with onboarding done)
DROP TRIGGER IF EXISTS trigger_assign_member_number_insert ON profiles;
CREATE TRIGGER trigger_assign_member_number_insert
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION assign_member_number();

-- Trigger on UPDATE (e.g. user completes onboarding)
DROP TRIGGER IF EXISTS trigger_assign_member_number_update ON profiles;
CREATE TRIGGER trigger_assign_member_number_update
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION assign_member_number();

-- Unique constraint to prevent duplicate member numbers
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_member_number ON profiles(member_number) WHERE member_number IS NOT NULL;
