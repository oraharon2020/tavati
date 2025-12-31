-- הוספת עמודת service_type לטבלת chat_sessions
-- רץ את זה בסופאבייס SQL Editor

-- הוסף עמודה חדשה עם ברירת מחדל 'claims'
ALTER TABLE chat_sessions 
ADD COLUMN IF NOT EXISTS service_type TEXT DEFAULT 'claims';

-- עדכן את כל הרשומות הקיימות להיות 'claims'
UPDATE chat_sessions 
SET service_type = 'claims' 
WHERE service_type IS NULL;

-- אופציונלי: הוסף אינדקס לחיפוש מהיר לפי שירות
CREATE INDEX IF NOT EXISTS idx_chat_sessions_service_type 
ON chat_sessions(service_type);

-- אופציונלי: הוסף constraint לוודא ערכים תקינים
ALTER TABLE chat_sessions 
ADD CONSTRAINT check_service_type 
CHECK (service_type IN ('claims', 'parking')) 
NOT VALID;
