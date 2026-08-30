-- Add is_active column to profiles for deactivate (soft delete) instead of hard delete
-- Deactivated members (is_active = false) are hidden from public members list but remain in admin
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Backfill existing rows to be active
UPDATE profiles SET is_active = true WHERE is_active IS NULL;
