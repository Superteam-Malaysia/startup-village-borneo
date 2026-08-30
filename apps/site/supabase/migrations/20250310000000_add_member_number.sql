-- Add member_number to profiles for member card display (#001, #002, etc.)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS member_number INTEGER DEFAULT NULL;

-- Optional: Add unique constraint to prevent duplicate member numbers
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_member_number ON profiles(member_number) WHERE member_number IS NOT NULL;
