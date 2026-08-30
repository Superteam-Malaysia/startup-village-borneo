-- Add content JSONB for flexible section data (e.g. mission pillars)
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS content JSONB DEFAULT '{}';

-- Seed landing page content (upsert by section_key)
INSERT INTO site_content (section_key, title, subtitle, description, content) VALUES
  ('hero', 'THE HOME OF SOLANA', 'BUILDERS IN MALAYSIA', 'We connect local talent with global opportunities. Build, earn, and grow alongside Malaysia''s most ambitious web3 community.', '{}'),
  ('who_we_are', '', '', 'Superteam Malaysia is a gateway for Malaysian builders to step into the global Web3 ecosystem — learning together, building real products, earning through meaningful opportunities, and growing as a community.', '{}'),
  ('mission', 'Empowering Malaysia''s', 'Solana Builders', '', '{"pillars":[{"title":"LEARN","description":"Learn through hands-on education, workshops, and mentorship from experienced builders across the ecosystem.","image_url":"/images/learn.jpeg"},{"title":"BUILD","description":"Build alongside the community through hackathons, collaborative events, and real projects that turn ideas into production-ready products.","image_url":"/images/build.jpeg"},{"title":"GROW","description":"Grow your career and network through strong ecosystem connections and long-term opportunities, locally and globally.","image_url":"/images/grow.jpeg"},{"title":"EARN","description":"Earn through grants, funding access, jobs, and bounties by contributing to impactful Web3 projects.","image_url":"/images/earn.jpeg"}]}'),
  ('stats', 'Powered by Builders', '', 'From local meetups to global opportunities, our community continues to grow through shipped projects, hosted events, and meaningful contributions across the ecosystem.', '{}'),
  ('events', 'Our Events', '', 'Bringing the community together through meetups, workshops, hackathons, and builder gatherings.', '{}'),
  ('members_spotlight', 'Member Spotlight', '', 'Meet the talented builders driving the Solana ecosystem in Malaysia', '{}'),
  ('partners', 'Ecosystem Partners', '', 'Partners that support the Malaysian builder ecosystem through tools, mentorship, and opportunities.', '{}'),
  ('wall_of_love', 'Wall of Love', '', 'Hear from our builders and leaders in the Malaysian Solana ecosystem!', '{}'),
  ('faq_section', 'HAVE QUESTIONS THAT NEED ANSWER?', '', '', '{}')
ON CONFLICT (section_key) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  content = CASE
    WHEN site_content.content IS NULL OR site_content.content = '{}' THEN EXCLUDED.content
    ELSE site_content.content
  END;
