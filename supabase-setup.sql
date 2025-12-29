-- Run this SQL in your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/alwymwuyusmievosmlfs/sql/new

-- Create the chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  claim_data JSONB DEFAULT '{}'::jsonb,
  current_step INTEGER DEFAULT 1,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'paid')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create OTP codes table for phone verification
CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_chat_sessions_phone ON chat_sessions(phone);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_otp_codes_phone ON otp_codes(phone);

-- Enable Row Level Security
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- Create policies for access
CREATE POLICY "Allow insert for all" ON chat_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select for all" ON chat_sessions FOR SELECT USING (true);
CREATE POLICY "Allow update for all" ON chat_sessions FOR UPDATE USING (true);

CREATE POLICY "Allow insert otp" ON otp_codes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select otp" ON otp_codes FOR SELECT USING (true);
CREATE POLICY "Allow delete otp" ON otp_codes FOR DELETE USING (true);
