-- Supabase SQL Schema for Crexto AI 2.0
-- Run this in your Supabase SQL Editor

-- 1. Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  wallet_address TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for Profiles
CREATE POLICY "Public profiles are viewable by everyone." 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." 
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically create a profile for new users (e.g. Google OAuth)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, username)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'preferred_username', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Analyses Table
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  agent_type TEXT NOT NULL,
  title TEXT NOT NULL,
  input_hash TEXT NOT NULL, -- SHA-256 of the input document/text
  analysis_hash TEXT, -- SHA-256 of the structured AI result (calculated before proof)
  structured_result JSONB NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Policies for Analyses
CREATE POLICY "Users can view their own analyses."
ON analyses FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public analyses are viewable by everyone."
ON analyses FOR SELECT USING (is_public = TRUE);

CREATE POLICY "Users can insert their own analyses."
ON analyses FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyses."
ON analyses FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses."
ON analyses FOR DELETE USING (auth.uid() = user_id);

-- 3. Proofs Table (Off-chain index of on-chain registrations)
CREATE TABLE proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  analysis_id UUID REFERENCES analyses(id), -- Nullable if proof is just a document, not an analysis
  proof_id_onchain TEXT NOT NULL UNIQUE, -- ID emitted by smart contract
  blockchain_network TEXT DEFAULT 'Base Sepolia',
  transaction_hash TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE proofs ENABLE ROW LEVEL SECURITY;

-- Policies for Proofs
CREATE POLICY "Proofs are viewable by everyone (public ledger index)."
ON proofs FOR SELECT USING (true);

CREATE POLICY "Users can insert their own proofs."
ON proofs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON analyses
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
