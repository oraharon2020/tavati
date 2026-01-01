-- טבלת הגדרות מחירים
CREATE TABLE IF NOT EXISTS settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    claims_price INTEGER NOT NULL DEFAULT 79,
    parking_price INTEGER NOT NULL DEFAULT 39,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- הכנס שורה ראשונית עם ברירות מחדל
INSERT INTO settings (claims_price, parking_price)
VALUES (79, 39)
ON CONFLICT DO NOTHING;

-- אינדקס
CREATE INDEX IF NOT EXISTS idx_settings_updated ON settings(updated_at);
