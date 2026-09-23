-- Supabase SQL Schema Migration for Crexto AI - Community, Templates, and Demo Tokens
-- Phase 2 & 3 Migration Script

-- 1. Reputation Events Table
CREATE TABLE IF NOT EXISTS reputation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  event_type TEXT NOT NULL,
  points INTEGER NOT NULL,
  reference_id TEXT, -- E.g., Analysis ID, Template ID, to prevent duplicates
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, event_type, reference_id) -- Duplicate protection
);

ALTER TABLE reputation_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own reputation events." ON reputation_events FOR SELECT USING (auth.uid() = user_id);
-- Inserts happen via backend service role

-- 2. CV Templates Table
CREATE TABLE IF NOT EXISTS cv_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  industry TEXT,
  experience_level TEXT,
  file_path TEXT NOT NULL,
  preview_path TEXT,
  file_type TEXT,
  file_size INTEGER,
  tags TEXT[],
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'public', 'unlisted')),
  download_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  is_demo BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cv_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public templates are viewable by everyone." ON cv_templates FOR SELECT USING (visibility = 'public');
CREATE POLICY "Users can view their own templates." ON cv_templates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own templates." ON cv_templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own templates." ON cv_templates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own templates." ON cv_templates FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER set_cv_templates_updated_at
BEFORE UPDATE ON cv_templates
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- 3. Token Accounts (Demo Economy)
CREATE TABLE IF NOT EXISTS token_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) UNIQUE NOT NULL,
  token_balance INTEGER DEFAULT 0,
  lifetime_earned INTEGER DEFAULT 0,
  lifetime_spent INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  is_demo BOOLEAN DEFAULT FALSE
);

ALTER TABLE token_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own token account." ON token_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public can view token accounts for leaderboard." ON token_accounts FOR SELECT USING (true);
-- Inserts/Updates via backend service role

-- Create a token account for new users automatically
CREATE OR REPLACE FUNCTION public.handle_new_token_account()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.token_accounts (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created_token
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_token_account();

-- 4. Token Transactions
CREATE TABLE IF NOT EXISTS token_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  type TEXT NOT NULL, -- e.g., 'analysis_reward', 'template_reward'
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  reference_id TEXT,
  is_demo BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, type, reference_id) -- Duplicate protection
);

ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own transactions." ON token_transactions FOR SELECT USING (auth.uid() = user_id);

-- 5. Token Config
CREATE TABLE IF NOT EXISTS token_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_name TEXT NOT NULL,
  token_symbol TEXT NOT NULL,
  status TEXT NOT NULL,
  total_supply BIGINT NOT NULL,
  circulating_supply BIGINT NOT NULL,
  demo_price NUMERIC(10, 2) NOT NULL,
  is_demo BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE token_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Token config is readable by everyone." ON token_config FOR SELECT USING (true);


-- =========================================================================
-- SEED DATA (Demo Configuration & Leaderboard Users)
-- =========================================================================

-- Seed Demo Token Config
INSERT INTO token_config (token_name, token_symbol, status, total_supply, circulating_supply, demo_price, is_demo)
VALUES ('Crexto', 'CRX', 'Demo', 1000000000, 250000000, 0.10, true)
ON CONFLICT DO NOTHING;

-- Seed Demo Users (Profiles, Reputation, Token Accounts)
-- (In a real Supabase setup, you need to create auth.users first if you want these to be real logins,
-- but for the leaderboard query we just need them in `profiles`, `user_reputation`, and `token_accounts`.
-- We will generate predictable UUIDs for the demo users so they can be referenced.)

DO $$ 
DECLARE
  maya_id UUID := '00000000-0000-0000-0000-000000000001'::uuid;
  daniel_k_id UUID := '00000000-0000-0000-0000-000000000002'::uuid;
  sofia_id UUID := '00000000-0000-0000-0000-000000000003'::uuid;
  ayesha_id UUID := '00000000-0000-0000-0000-000000000004'::uuid;
  daniel_o_id UUID := '00000000-0000-0000-0000-000000000005'::uuid;
BEGIN
  -- Insert into Profiles (bypassing auth.users FK by dropping it temporarily if needed, or assuming service role allows it. 
  -- Actually, Supabase requires profiles.id to match auth.users.id due to the FK.
  -- For this seed script to work without creating auth users, we need to alter the constraint temporarily or just create fake auth users.
  -- Since we cannot easily create auth users in SQL without passwords/crypt, we will rely on the UI checking `is_demo` 
  -- and joining properly, OR we just disable the FK for the demo users, OR we don't strictly enforce it.)
  
  -- For a robust demo, we will just create a dedicated `leaderboard_stats` table OR add `is_demo` to `user_reputation` 
  -- and use fake UUIDs. But `profiles` has an FK to `auth.users`.
  -- To prevent breaking migrations, we will just insert into `profiles` and assume we have disabled the FK for demo, 
  -- OR we can insert directly into auth.users.
  
  -- Let's insert into auth.users first so FK works.
  INSERT INTO auth.users (id, email) VALUES
    (maya_id, 'maya@demo.crexto.com'),
    (daniel_k_id, 'daniel.k@demo.crexto.com'),
    (sofia_id, 'sofia@demo.crexto.com'),
    (ayesha_id, 'ayesha@demo.crexto.com'),
    (daniel_o_id, 'daniel.o@demo.crexto.com')
  ON CONFLICT DO NOTHING;

  -- Update Profiles
  UPDATE profiles SET full_name = 'Maya Chen', username = 'mayabuilds' WHERE id = maya_id;
  UPDATE profiles SET full_name = 'Daniel Kim', username = 'danielkim' WHERE id = daniel_k_id;
  UPDATE profiles SET full_name = 'Sofia Rossi', username = 'sofiarossi' WHERE id = sofia_id;
  UPDATE profiles SET full_name = 'Ayesha Raza', username = 'ayeshafixes' WHERE id = ayesha_id;
  UPDATE profiles SET full_name = 'Daniel Osei', username = 'danielcodes' WHERE id = daniel_o_id;

  -- Update Reputation
  UPDATE user_reputation SET total_points = 12450, level_name = 'Expert', analyses_count = 42, proofs_count = 18 WHERE user_id = maya_id;
  UPDATE user_reputation SET total_points = 11020, level_name = 'Expert', analyses_count = 38, proofs_count = 15 WHERE user_id = daniel_k_id;
  UPDATE user_reputation SET total_points = 9820, level_name = 'Expert', analyses_count = 35, proofs_count = 12 WHERE user_id = sofia_id;
  UPDATE user_reputation SET total_points = 9210, level_name = 'Expert', analyses_count = 31, proofs_count = 10 WHERE user_id = ayesha_id;
  UPDATE user_reputation SET total_points = 8640, level_name = 'Expert', analyses_count = 29, proofs_count = 8 WHERE user_id = daniel_o_id;

  -- Update Token Accounts
  UPDATE token_accounts SET token_balance = 12450, lifetime_earned = 18450, lifetime_spent = 6000, is_demo = true WHERE user_id = maya_id;
  UPDATE token_accounts SET token_balance = 11020, lifetime_earned = 15980, lifetime_spent = 4960, is_demo = true WHERE user_id = daniel_k_id;
  UPDATE token_accounts SET token_balance = 9820, lifetime_earned = 14250, lifetime_spent = 4430, is_demo = true WHERE user_id = sofia_id;
  UPDATE token_accounts SET token_balance = 9210, lifetime_earned = 13100, lifetime_spent = 3890, is_demo = true WHERE user_id = ayesha_id;
  UPDATE token_accounts SET token_balance = 8640, lifetime_earned = 12420, lifetime_spent = 3780, is_demo = true WHERE user_id = daniel_o_id;

  -- Seed Demo CV Templates
  INSERT INTO cv_templates (user_id, title, description, category, industry, experience_level, file_path, file_type, file_size, visibility, view_count, download_count, is_demo)
  VALUES 
    (maya_id, 'Minimal ATS Resume', 'Clean, machine-readable resume format optimized for Applicant Tracking Systems.', 'ATS Friendly', 'Technology', 'Mid Level', 'demo/minimal-ats.pdf', 'application/pdf', 102400, 'public', 1240, 412, true),
    (daniel_k_id, 'Modern Software Engineer CV', 'Two-column layout highlighting technical skills and open source contributions.', 'Modern', 'Engineering', 'Senior', 'demo/modern-swe.pdf', 'application/pdf', 153600, 'public', 850, 230, true),
    (sofia_id, 'Executive Professional CV', 'Authoritative design for leadership roles emphasizing business impact.', 'Executive', 'Finance', 'Executive', 'demo/exec-pro.pdf', 'application/pdf', 81920, 'public', 540, 110, true),
    (ayesha_id, 'Creative Portfolio CV', 'Visually distinct layout for designers and creative professionals.', 'Creative', 'Design', 'Entry Level', 'demo/creative-portfolio.pdf', 'application/pdf', 3145728, 'public', 2100, 890, true),
    (daniel_o_id, 'Data Analyst Resume', 'Data-driven layout showcasing metrics, tools, and technical proficiency.', 'Modern', 'Technology', 'Entry Level', 'demo/data-analyst.pdf', 'application/pdf', 98304, 'public', 760, 315, true)
  ON CONFLICT DO NOTHING;

END $$;
