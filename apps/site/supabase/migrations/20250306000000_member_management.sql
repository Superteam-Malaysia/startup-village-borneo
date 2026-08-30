-- Member Management System Migration
-- Adds profiles, invites, lookup tables, junction tables, projects, and RLS policies

-- =============================================================================
-- ENUMS
-- =============================================================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'member');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- =============================================================================
-- PROFILES (linked to auth.users)
-- =============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_role user_role NOT NULL DEFAULT 'member',
  nickname TEXT DEFAULT '',
  real_name TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  twitter_url TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  linkedin_url TEXT DEFAULT '',
  website_url TEXT DEFAULT '',
  telegram_url TEXT DEFAULT '',
  achievements TEXT DEFAULT '',
  talk_to_me_about TEXT DEFAULT '',
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- INVITES
-- =============================================================================

CREATE TABLE IF NOT EXISTS invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  email TEXT,
  invited_role user_role NOT NULL DEFAULT 'member',
  is_used BOOLEAN DEFAULT false,
  used_by UUID REFERENCES auth.users(id),
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invites_token ON invites(token);

-- =============================================================================
-- LOOKUP TABLES
-- =============================================================================

CREATE TABLE IF NOT EXISTS roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subskills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- JUNCTION TABLES (profile <-> lookup)
-- =============================================================================

CREATE TABLE IF NOT EXISTS profile_roles (
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (profile_id, role_id)
);

CREATE TABLE IF NOT EXISTS profile_companies (
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  PRIMARY KEY (profile_id, company_id)
);

CREATE TABLE IF NOT EXISTS profile_skills (
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (profile_id, skill_id)
);

CREATE TABLE IF NOT EXISTS profile_subskills (
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subskill_id UUID REFERENCES subskills(id) ON DELETE CASCADE,
  PRIMARY KEY (profile_id, subskill_id)
);

-- =============================================================================
-- PROJECTS (Proof of Work)
-- =============================================================================

CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  link TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project_skills (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, skill_id)
);

CREATE TABLE IF NOT EXISTS project_subskills (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  subskill_id UUID REFERENCES subskills(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, subskill_id)
);

-- =============================================================================
-- HELPER FUNCTION for role checking in RLS
-- =============================================================================

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'user_role'),
    'member'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- =============================================================================
-- RLS: PROFILES
-- =============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select" ON profiles;
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "profiles_insert" ON profiles;
CREATE POLICY "profiles_insert" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update" ON profiles;
CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE USING (
    auth.uid() = id
    OR public.get_user_role() = 'super_admin'
  );

DROP POLICY IF EXISTS "profiles_delete" ON profiles;
CREATE POLICY "profiles_delete" ON profiles
  FOR DELETE USING (public.get_user_role() = 'super_admin');

-- =============================================================================
-- RLS: INVITES
-- =============================================================================

ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "invites_select" ON invites;
CREATE POLICY "invites_select" ON invites
  FOR SELECT USING (public.get_user_role() = 'super_admin');

DROP POLICY IF EXISTS "invites_insert" ON invites;
CREATE POLICY "invites_insert" ON invites
  FOR INSERT WITH CHECK (public.get_user_role() = 'super_admin');

DROP POLICY IF EXISTS "invites_update" ON invites;
CREATE POLICY "invites_update" ON invites
  FOR UPDATE USING (public.get_user_role() = 'super_admin');

DROP POLICY IF EXISTS "invites_delete" ON invites;
CREATE POLICY "invites_delete" ON invites
  FOR DELETE USING (public.get_user_role() = 'super_admin');

-- =============================================================================
-- RLS: LOOKUP TABLES (roles, companies, skills, subskills)
-- =============================================================================

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE subskills ENABLE ROW LEVEL SECURITY;

-- Public read
DROP POLICY IF EXISTS "roles_select" ON roles;
CREATE POLICY "roles_select" ON roles FOR SELECT USING (true);
DROP POLICY IF EXISTS "companies_select" ON companies;
CREATE POLICY "companies_select" ON companies FOR SELECT USING (true);
DROP POLICY IF EXISTS "skills_select" ON skills;
CREATE POLICY "skills_select" ON skills FOR SELECT USING (true);
DROP POLICY IF EXISTS "subskills_select" ON subskills;
CREATE POLICY "subskills_select" ON subskills FOR SELECT USING (true);

-- Authenticated users can create new tags
DROP POLICY IF EXISTS "roles_insert" ON roles;
CREATE POLICY "roles_insert" ON roles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "companies_insert" ON companies;
CREATE POLICY "companies_insert" ON companies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "skills_insert" ON skills;
CREATE POLICY "skills_insert" ON skills FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "subskills_insert" ON subskills;
CREATE POLICY "subskills_insert" ON subskills FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Super admin can update/delete tags
DROP POLICY IF EXISTS "roles_update" ON roles;
CREATE POLICY "roles_update" ON roles FOR UPDATE USING (public.get_user_role() = 'super_admin');
DROP POLICY IF EXISTS "companies_update" ON companies;
CREATE POLICY "companies_update" ON companies FOR UPDATE USING (public.get_user_role() = 'super_admin');
DROP POLICY IF EXISTS "skills_update" ON skills;
CREATE POLICY "skills_update" ON skills FOR UPDATE USING (public.get_user_role() = 'super_admin');
DROP POLICY IF EXISTS "subskills_update" ON subskills;
CREATE POLICY "subskills_update" ON subskills FOR UPDATE USING (public.get_user_role() = 'super_admin');

DROP POLICY IF EXISTS "roles_delete" ON roles;
CREATE POLICY "roles_delete" ON roles FOR DELETE USING (public.get_user_role() = 'super_admin');
DROP POLICY IF EXISTS "companies_delete" ON companies;
CREATE POLICY "companies_delete" ON companies FOR DELETE USING (public.get_user_role() = 'super_admin');
DROP POLICY IF EXISTS "skills_delete" ON skills;
CREATE POLICY "skills_delete" ON skills FOR DELETE USING (public.get_user_role() = 'super_admin');
DROP POLICY IF EXISTS "subskills_delete" ON subskills;
CREATE POLICY "subskills_delete" ON subskills FOR DELETE USING (public.get_user_role() = 'super_admin');

-- =============================================================================
-- RLS: JUNCTION TABLES
-- =============================================================================

ALTER TABLE profile_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_subskills ENABLE ROW LEVEL SECURITY;

-- Public read
DROP POLICY IF EXISTS "profile_roles_select" ON profile_roles;
CREATE POLICY "profile_roles_select" ON profile_roles FOR SELECT USING (true);
DROP POLICY IF EXISTS "profile_companies_select" ON profile_companies;
CREATE POLICY "profile_companies_select" ON profile_companies FOR SELECT USING (true);
DROP POLICY IF EXISTS "profile_skills_select" ON profile_skills;
CREATE POLICY "profile_skills_select" ON profile_skills FOR SELECT USING (true);
DROP POLICY IF EXISTS "profile_subskills_select" ON profile_subskills;
CREATE POLICY "profile_subskills_select" ON profile_subskills FOR SELECT USING (true);

-- Owner or super_admin write
DROP POLICY IF EXISTS "profile_roles_insert" ON profile_roles;
CREATE POLICY "profile_roles_insert" ON profile_roles
  FOR INSERT WITH CHECK (auth.uid() = profile_id OR public.get_user_role() = 'super_admin');
DROP POLICY IF EXISTS "profile_roles_delete" ON profile_roles;
CREATE POLICY "profile_roles_delete" ON profile_roles
  FOR DELETE USING (auth.uid() = profile_id OR public.get_user_role() = 'super_admin');

DROP POLICY IF EXISTS "profile_companies_insert" ON profile_companies;
CREATE POLICY "profile_companies_insert" ON profile_companies
  FOR INSERT WITH CHECK (auth.uid() = profile_id OR public.get_user_role() = 'super_admin');
DROP POLICY IF EXISTS "profile_companies_delete" ON profile_companies;
CREATE POLICY "profile_companies_delete" ON profile_companies
  FOR DELETE USING (auth.uid() = profile_id OR public.get_user_role() = 'super_admin');

DROP POLICY IF EXISTS "profile_skills_insert" ON profile_skills;
CREATE POLICY "profile_skills_insert" ON profile_skills
  FOR INSERT WITH CHECK (auth.uid() = profile_id OR public.get_user_role() = 'super_admin');
DROP POLICY IF EXISTS "profile_skills_delete" ON profile_skills;
CREATE POLICY "profile_skills_delete" ON profile_skills
  FOR DELETE USING (auth.uid() = profile_id OR public.get_user_role() = 'super_admin');

DROP POLICY IF EXISTS "profile_subskills_insert" ON profile_subskills;
CREATE POLICY "profile_subskills_insert" ON profile_subskills
  FOR INSERT WITH CHECK (auth.uid() = profile_id OR public.get_user_role() = 'super_admin');
DROP POLICY IF EXISTS "profile_subskills_delete" ON profile_subskills;
CREATE POLICY "profile_subskills_delete" ON profile_subskills
  FOR DELETE USING (auth.uid() = profile_id OR public.get_user_role() = 'super_admin');

-- =============================================================================
-- RLS: PROJECTS
-- =============================================================================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "projects_select" ON projects;
CREATE POLICY "projects_select" ON projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "projects_insert" ON projects;
CREATE POLICY "projects_insert" ON projects
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "projects_update" ON projects;
CREATE POLICY "projects_update" ON projects
  FOR UPDATE USING (
    auth.uid() = profile_id
    OR public.get_user_role() = 'super_admin'
  );

DROP POLICY IF EXISTS "projects_delete" ON projects;
CREATE POLICY "projects_delete" ON projects
  FOR DELETE USING (
    auth.uid() = profile_id
    OR public.get_user_role() = 'super_admin'
  );

-- =============================================================================
-- RLS: PROJECT JUNCTION TABLES
-- =============================================================================

ALTER TABLE project_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_subskills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "project_skills_select" ON project_skills;
CREATE POLICY "project_skills_select" ON project_skills FOR SELECT USING (true);
DROP POLICY IF EXISTS "project_subskills_select" ON project_subskills;
CREATE POLICY "project_subskills_select" ON project_subskills FOR SELECT USING (true);

DROP POLICY IF EXISTS "project_skills_insert" ON project_skills;
CREATE POLICY "project_skills_insert" ON project_skills
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE id = project_id AND profile_id = auth.uid())
    OR public.get_user_role() = 'super_admin'
  );
DROP POLICY IF EXISTS "project_skills_delete" ON project_skills;
CREATE POLICY "project_skills_delete" ON project_skills
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM projects WHERE id = project_id AND profile_id = auth.uid())
    OR public.get_user_role() = 'super_admin'
  );

DROP POLICY IF EXISTS "project_subskills_insert" ON project_subskills;
CREATE POLICY "project_subskills_insert" ON project_subskills
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE id = project_id AND profile_id = auth.uid())
    OR public.get_user_role() = 'super_admin'
  );
DROP POLICY IF EXISTS "project_subskills_delete" ON project_subskills;
CREATE POLICY "project_subskills_delete" ON project_subskills
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM projects WHERE id = project_id AND profile_id = auth.uid())
    OR public.get_user_role() = 'super_admin'
  );

-- =============================================================================
-- UPDATE EXISTING TABLE RLS (events, partners, site_content)
-- Now require admin or super_admin instead of just authenticated
-- =============================================================================

-- Drop old permissive policies on events
DROP POLICY IF EXISTS "Admin insert" ON events;
DROP POLICY IF EXISTS "Admin update" ON events;
DROP POLICY IF EXISTS "Admin delete" ON events;
DROP POLICY IF EXISTS "events_insert" ON events;
DROP POLICY IF EXISTS "events_update" ON events;
DROP POLICY IF EXISTS "events_delete" ON events;

CREATE POLICY "events_insert" ON events
  FOR INSERT WITH CHECK (public.get_user_role() IN ('super_admin', 'admin'));
CREATE POLICY "events_update" ON events
  FOR UPDATE USING (public.get_user_role() IN ('super_admin', 'admin'));
CREATE POLICY "events_delete" ON events
  FOR DELETE USING (public.get_user_role() IN ('super_admin', 'admin'));

-- Drop old permissive policies on partners
DROP POLICY IF EXISTS "Admin insert" ON partners;
DROP POLICY IF EXISTS "Admin update" ON partners;
DROP POLICY IF EXISTS "Admin delete" ON partners;
DROP POLICY IF EXISTS "partners_insert" ON partners;
DROP POLICY IF EXISTS "partners_update" ON partners;
DROP POLICY IF EXISTS "partners_delete" ON partners;

CREATE POLICY "partners_insert" ON partners
  FOR INSERT WITH CHECK (public.get_user_role() IN ('super_admin', 'admin'));
CREATE POLICY "partners_update" ON partners
  FOR UPDATE USING (public.get_user_role() IN ('super_admin', 'admin'));
CREATE POLICY "partners_delete" ON partners
  FOR DELETE USING (public.get_user_role() IN ('super_admin', 'admin'));

-- Drop old permissive policies on site_content
DROP POLICY IF EXISTS "Admin insert" ON site_content;
DROP POLICY IF EXISTS "Admin update" ON site_content;
DROP POLICY IF EXISTS "Admin delete" ON site_content;
DROP POLICY IF EXISTS "site_content_insert" ON site_content;
DROP POLICY IF EXISTS "site_content_update" ON site_content;
DROP POLICY IF EXISTS "site_content_delete" ON site_content;

CREATE POLICY "site_content_insert" ON site_content
  FOR INSERT WITH CHECK (public.get_user_role() IN ('super_admin', 'admin'));
CREATE POLICY "site_content_update" ON site_content
  FOR UPDATE USING (public.get_user_role() IN ('super_admin', 'admin'));
CREATE POLICY "site_content_delete" ON site_content
  FOR DELETE USING (public.get_user_role() IN ('super_admin', 'admin'));

-- Drop old permissive policies on stats
DROP POLICY IF EXISTS "Admin insert" ON stats;
DROP POLICY IF EXISTS "Admin update" ON stats;
DROP POLICY IF EXISTS "Admin delete" ON stats;
DROP POLICY IF EXISTS "stats_insert" ON stats;
DROP POLICY IF EXISTS "stats_update" ON stats;
DROP POLICY IF EXISTS "stats_delete" ON stats;

CREATE POLICY "stats_insert" ON stats
  FOR INSERT WITH CHECK (public.get_user_role() = 'super_admin');
CREATE POLICY "stats_update" ON stats
  FOR UPDATE USING (public.get_user_role() = 'super_admin');
CREATE POLICY "stats_delete" ON stats
  FOR DELETE USING (public.get_user_role() = 'super_admin');

-- Drop old permissive policies on testimonials
DROP POLICY IF EXISTS "Admin insert" ON testimonials;
DROP POLICY IF EXISTS "Admin update" ON testimonials;
DROP POLICY IF EXISTS "Admin delete" ON testimonials;
DROP POLICY IF EXISTS "testimonials_insert" ON testimonials;
DROP POLICY IF EXISTS "testimonials_update" ON testimonials;
DROP POLICY IF EXISTS "testimonials_delete" ON testimonials;

CREATE POLICY "testimonials_insert" ON testimonials
  FOR INSERT WITH CHECK (public.get_user_role() IN ('super_admin', 'admin'));
CREATE POLICY "testimonials_update" ON testimonials
  FOR UPDATE USING (public.get_user_role() IN ('super_admin', 'admin'));
CREATE POLICY "testimonials_delete" ON testimonials
  FOR DELETE USING (public.get_user_role() IN ('super_admin', 'admin'));

-- Drop old permissive policies on faqs
DROP POLICY IF EXISTS "Admin insert" ON faqs;
DROP POLICY IF EXISTS "Admin update" ON faqs;
DROP POLICY IF EXISTS "Admin delete" ON faqs;
DROP POLICY IF EXISTS "faqs_insert" ON faqs;
DROP POLICY IF EXISTS "faqs_update" ON faqs;
DROP POLICY IF EXISTS "faqs_delete" ON faqs;

CREATE POLICY "faqs_insert" ON faqs
  FOR INSERT WITH CHECK (public.get_user_role() IN ('super_admin', 'admin'));
CREATE POLICY "faqs_update" ON faqs
  FOR UPDATE USING (public.get_user_role() IN ('super_admin', 'admin'));
CREATE POLICY "faqs_delete" ON faqs
  FOR DELETE USING (public.get_user_role() IN ('super_admin', 'admin'));

-- Drop old permissive policies on members (keep table but tighten)
DROP POLICY IF EXISTS "Admin insert" ON members;
DROP POLICY IF EXISTS "Admin update" ON members;
DROP POLICY IF EXISTS "Admin delete" ON members;
DROP POLICY IF EXISTS "members_insert" ON members;
DROP POLICY IF EXISTS "members_update" ON members;
DROP POLICY IF EXISTS "members_delete" ON members;

CREATE POLICY "members_insert" ON members
  FOR INSERT WITH CHECK (public.get_user_role() = 'super_admin');
CREATE POLICY "members_update" ON members
  FOR UPDATE USING (public.get_user_role() = 'super_admin');
CREATE POLICY "members_delete" ON members
  FOR DELETE USING (public.get_user_role() = 'super_admin');

-- =============================================================================
-- STORAGE: Avatars bucket
-- =============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "avatars_public_read" ON storage.objects;
CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatars_auth_insert" ON storage.objects;
CREATE POLICY "avatars_auth_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "avatars_auth_update" ON storage.objects;
CREATE POLICY "avatars_auth_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "avatars_auth_delete" ON storage.objects;
CREATE POLICY "avatars_auth_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- =============================================================================
-- SEED DATA: Skills
-- =============================================================================

INSERT INTO skills (name) VALUES
  ('Frontend'),
  ('Backend'),
  ('Blockchain'),
  ('Mobile'),
  ('Design'),
  ('Community'),
  ('Growth'),
  ('Content'),
  ('Others')
ON CONFLICT (name) DO NOTHING;

-- Subskills with parent skill references
INSERT INTO subskills (name, skill_id) VALUES
  ('React', (SELECT id FROM skills WHERE name = 'Frontend')),
  ('Next.js', (SELECT id FROM skills WHERE name = 'Frontend')),
  ('Vue.js', (SELECT id FROM skills WHERE name = 'Frontend')),
  ('TypeScript', (SELECT id FROM skills WHERE name = 'Frontend')),
  ('Node.js', (SELECT id FROM skills WHERE name = 'Backend')),
  ('Python', (SELECT id FROM skills WHERE name = 'Backend')),
  ('Rust', (SELECT id FROM skills WHERE name = 'Backend')),
  ('Go', (SELECT id FROM skills WHERE name = 'Backend')),
  ('Solidity', (SELECT id FROM skills WHERE name = 'Blockchain')),
  ('Anchor', (SELECT id FROM skills WHERE name = 'Blockchain')),
  ('Solana', (SELECT id FROM skills WHERE name = 'Blockchain')),
  ('Smart Contracts', (SELECT id FROM skills WHERE name = 'Blockchain')),
  ('DeFi', (SELECT id FROM skills WHERE name = 'Blockchain')),
  ('React Native', (SELECT id FROM skills WHERE name = 'Mobile')),
  ('Flutter', (SELECT id FROM skills WHERE name = 'Mobile')),
  ('Swift', (SELECT id FROM skills WHERE name = 'Mobile')),
  ('UI/UX Design', (SELECT id FROM skills WHERE name = 'Design')),
  ('Graphic Design', (SELECT id FROM skills WHERE name = 'Design')),
  ('Illustration', (SELECT id FROM skills WHERE name = 'Design')),
  ('Game Design', (SELECT id FROM skills WHERE name = 'Design')),
  ('Presentation Design', (SELECT id FROM skills WHERE name = 'Design')),
  ('Community Manager', (SELECT id FROM skills WHERE name = 'Community')),
  ('Business Development', (SELECT id FROM skills WHERE name = 'Growth')),
  ('Digital Marketing', (SELECT id FROM skills WHERE name = 'Growth')),
  ('Photography', (SELECT id FROM skills WHERE name = 'Content')),
  ('Videography', (SELECT id FROM skills WHERE name = 'Content')),
  ('Technical Writing', (SELECT id FROM skills WHERE name = 'Content'))
ON CONFLICT (name) DO NOTHING;
