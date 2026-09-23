-- Supabase SQL Schema Migration for Crexto AI - Phase 3 & 4
-- Run this in your Supabase SQL Editor

-- 4. Reputation & Points Table
CREATE TABLE user_reputation (
  user_id UUID REFERENCES profiles(id) PRIMARY KEY,
  total_points INTEGER DEFAULT 0,
  level_name TEXT DEFAULT 'Explorer',
  analyses_count INTEGER DEFAULT 0,
  proofs_count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_reputation ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Reputation is viewable by everyone." 
ON user_reputation FOR SELECT USING (true);

-- Admin / Backend only for updating reputation
CREATE POLICY "Only service role can update reputation"
ON user_reputation FOR UPDATE USING (false);

CREATE POLICY "Only service role can insert reputation"
ON user_reputation FOR INSERT WITH CHECK (false);

-- Trigger to create user_reputation for new users when their profile is created
CREATE OR REPLACE FUNCTION public.handle_new_user_reputation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_reputation (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_reputation();

-- 5. Activity Log Table
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  action_type TEXT NOT NULL, -- 'ANALYSIS_CREATED', 'PROOF_REGISTERED', 'REPUTATION_GAINED'
  entity_id UUID, -- ID of the analysis or proof
  metadata JSONB, -- Additional details
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own activity."
ON activity_logs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity."
ON activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
