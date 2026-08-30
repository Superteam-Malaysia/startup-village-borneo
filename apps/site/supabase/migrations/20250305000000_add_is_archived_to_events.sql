-- Add is_archived to events (archived events hidden from landing, skipped during Luma sync)
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
