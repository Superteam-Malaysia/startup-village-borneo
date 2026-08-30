ALTER TABLE participants ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS logo_url text;
