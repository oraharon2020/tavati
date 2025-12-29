-- =============================================
-- Coupons System
-- =============================================

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL DEFAULT 'percentage', -- 'percentage' or 'fixed'
  discount_value DECIMAL(10,2) NOT NULL DEFAULT 10,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupon usage log
CREATE TABLE IF NOT EXISTS coupon_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_code VARCHAR(50) NOT NULL REFERENCES coupons(code),
  session_id UUID REFERENCES chat_sessions(id),
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to increment coupon usage
CREATE OR REPLACE FUNCTION increment_coupon_usage(coupon_code VARCHAR)
RETURNS VOID AS $$
BEGIN
  UPDATE coupons 
  SET used_count = used_count + 1 
  WHERE code = coupon_code;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies for coupons
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read active coupons" ON coupons
FOR SELECT USING (active = true);

CREATE POLICY "Allow all operations on coupons" ON coupons
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on coupon_usage" ON coupon_usage
FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- Referral System
-- =============================================

-- Referral codes table
CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  referral_count INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referral usage tracking
CREATE TABLE IF NOT EXISTS referral_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_code VARCHAR(20) NOT NULL REFERENCES referral_codes(code),
  referrer_phone VARCHAR(20) NOT NULL,
  referred_phone VARCHAR(20) NOT NULL,
  session_id UUID REFERENCES chat_sessions(id),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'cancelled'
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to increment referral stats
CREATE OR REPLACE FUNCTION increment_referral_stats(referral_code VARCHAR, credit_amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE referral_codes 
  SET 
    referral_count = referral_count + 1,
    total_earnings = total_earnings + credit_amount
  WHERE code = referral_code;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies for referrals
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on referral_codes" ON referral_codes
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on referral_usage" ON referral_usage
FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- SMS Reminders System
-- =============================================

-- Add reminder columns to chat_sessions if not exist
ALTER TABLE chat_sessions 
ADD COLUMN IF NOT EXISTS reminder_sent TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reminder_count INTEGER DEFAULT 0;

-- Reminder logs
CREATE TABLE IF NOT EXISTS reminder_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- 'incomplete_claim', 'payment_reminder', etc.
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for reminder logs
ALTER TABLE reminder_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on reminder_logs" ON reminder_logs
FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- Sample Coupons (Optional)
-- =============================================

-- Insert some sample coupons
INSERT INTO coupons (code, description, discount_type, discount_value, max_uses)
VALUES 
  ('WELCOME10', 'הנחת פתיחה 10%', 'percentage', 10, 100),
  ('FIRST20', 'הנחה ללקוחות חדשים', 'percentage', 20, 50),
  ('SAVE15', '₪15 הנחה', 'fixed', 15, NULL)
ON CONFLICT (code) DO NOTHING;

-- =============================================
-- Indexes for performance
-- =============================================

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(active);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_phone ON referral_codes(phone);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_reminder ON chat_sessions(status, reminder_sent);

-- =============================================
-- SMS Opt-Out (הסרה מרשימת תפוצה)
-- חובה לפי חוק הספאם בישראל
-- =============================================

CREATE TABLE IF NOT EXISTS sms_opt_out (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  reason TEXT,
  opted_out_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for opt-out
ALTER TABLE sms_opt_out ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on sms_opt_out" ON sms_opt_out
FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_sms_opt_out_phone ON sms_opt_out(phone);
