-- Superteam Malaysia Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Members table
CREATE TABLE IF NOT EXISTS members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  bio TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  twitter_url TEXT DEFAULT '',
  skill_tags TEXT[] DEFAULT '{}',
  achievements JSONB DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_core_team BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  luma_event_id TEXT UNIQUE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT DEFAULT '',
  luma_url TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  is_upcoming BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Partners table
CREATE TYPE partner_category AS ENUM ('solana_project', 'malaysian_partner', 'sponsor');

CREATE TABLE IF NOT EXISTS partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT DEFAULT '',
  website_url TEXT DEFAULT '',
  category partner_category DEFAULT 'solana_project',
  display_order INTEGER DEFAULT 0
);

-- Stats table
CREATE TABLE IF NOT EXISTS stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value INTEGER NOT NULL DEFAULT 0,
  suffix TEXT DEFAULT '',
  icon TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_handle TEXT DEFAULT '',
  author_avatar TEXT DEFAULT '',
  content TEXT NOT NULL,
  tweet_url TEXT DEFAULT '',
  is_featured BOOLEAN DEFAULT false
);

-- FAQs table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0
);

-- Site Content table
CREATE TABLE IF NOT EXISTS site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  title TEXT DEFAULT '',
  subtitle TEXT DEFAULT '',
  description TEXT DEFAULT '',
  cta_text TEXT DEFAULT '',
  cta_url TEXT DEFAULT '',
  image_url TEXT DEFAULT ''
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON members FOR SELECT USING (true);
CREATE POLICY "Public read access" ON events FOR SELECT USING (true);
CREATE POLICY "Public read access" ON partners FOR SELECT USING (true);
CREATE POLICY "Public read access" ON stats FOR SELECT USING (true);
CREATE POLICY "Public read access" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read access" ON faqs FOR SELECT USING (true);
CREATE POLICY "Public read access" ON site_content FOR SELECT USING (true);

-- Admin write access (authenticated users)
CREATE POLICY "Admin insert" ON members FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON members FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON members FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert" ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON events FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON events FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert" ON partners FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON partners FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON partners FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert" ON stats FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON stats FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON stats FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert" ON testimonials FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON testimonials FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON testimonials FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert" ON faqs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON faqs FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON faqs FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert" ON site_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON site_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON site_content FOR DELETE USING (auth.role() = 'authenticated');

-- Seed data
INSERT INTO stats (label, value, suffix, icon, display_order) VALUES
  ('Community Members', 500, '+', 'users', 1),
  ('Events Hosted', 20, '+', 'calendar', 2),
  ('Projects Built', 50, '+', 'code', 3),
  ('Bounties Completed', 100, '+', 'trophy', 4);

INSERT INTO faqs (question, answer, display_order) VALUES
  ('What is Superteam Malaysia?', 'Superteam Malaysia is the local chapter of the global Superteam network, dedicated to empowering builders, creators, founders, and talent in the Solana ecosystem.', 1),
  ('How do I join Superteam Malaysia?', 'You can join our community by connecting with us on Telegram, or Twitter/X. We welcome developers, designers, content creators, and anyone passionate about Web3.', 2),
  ('What opportunities are available?', 'We offer bounties, grants, job opportunities, hackathons, workshops, and mentorship programs for builders of all skill levels.', 3),
  ('How can projects collaborate with us?', 'Reach out to us via our social channels. We can help with community building, talent sourcing, event partnerships, and ecosystem integration.', 4),
  ('Do I need to be a developer to join?', 'Absolutely not! We welcome all skill sets — designers, content creators, marketers, business developers, community managers, and more.', 5);
