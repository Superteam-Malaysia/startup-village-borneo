-- Add badges column to profiles for admin-assigned member badges
-- Badges: Bounty Hunter, Hackathon Winner, Solana Builder, Core Contributor
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT '{}';
