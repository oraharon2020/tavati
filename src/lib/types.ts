// טיפוסים מרכזיים למערכת תביעות קטנות

export interface PlaintiffData {
  fullName: string;       // שם מלא
  idNumber: string;       // ת.ז. - 9 ספרות
  address: string;        // כתובת מגורים
  city: string;           // עיר
  zipCode: string;        // מיקוד
  phone: string;          // טלפון
  email: string;          // דוא"ל
}

export interface DefendantData {
  name: string;           // שם / שם חברה
  type: "individual" | "business" | "company";  // סוג: אדם / עוסק מורשה / חברה
  idOrCompanyNumber: string;  // ת.ז. / ע.מ. / ח.פ.
  address: string;        // כתובת
  city: string;           // עיר
  zipCode: string;        // מיקוד
  phone?: string;         // טלפון (אופציונלי)
}

export interface ClaimDetails {
  type: "consumer" | "contract" | "rental" | "damage" | "service" | "other";
  amount: number;         // סכום התביעה - עד 38,900 ש"ח
  description: string;    // תיאור העובדות
  date: string;           // תאריך האירוע
  evidence: string[];     // רשימת ראיות
  breakdown: string;      // פירוט הסכום
  legalBasis?: string;    // עילה משפטית (אופציונלי - AI ייצר)
}

export interface CourtData {
  name: string;           // שם בית המשפט
  city: string;           // עיר
  address: string;        // כתובת
  phone?: string;         // טלפון
}

export interface ClaimData {
  plaintiff: PlaintiffData;
  defendant: DefendantData;
  claim: ClaimDetails;
  court?: CourtData;      // בית המשפט שנבחר
  declarations: {
    under5Claims: boolean;  // הצהרה: לא הגשתי יותר מ-5 תביעות השנה
    truthful: boolean;      // הצהרה: הפרטים נכונים
  };
  metadata?: {
    createdAt: string;    // תאריך יצירה
    caseNumber?: string;  // מספר תיק (ימולא ע"י בית משפט)
    fee: number;          // אגרה לתשלום
  };
}

// סכום מקסימלי לתביעה קטנה (נכון ל-2025)
export const MAX_CLAIM_AMOUNT = 38900;

// אגרה - 1% מהסכום, מינימום 50 ש"ח
export function calculateFee(amount: number): number {
  return Math.max(Math.round(amount * 0.01), 50);
}

// וולידציה לת.ז. ישראלית
export function validateIsraeliID(id: string): boolean {
  // בדיקת אורך
  const cleanId = id.replace(/\D/g, '');
  if (cleanId.length !== 9) return false;
  
  // אלגוריתם ספרת ביקורת (Luhn variant)
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let digit = parseInt(cleanId[i]);
    if (i % 2 === 0) {
      // מיקום אי-זוגי (0, 2, 4, 6, 8) - כפול 1
      sum += digit;
    } else {
      // מיקום זוגי (1, 3, 5, 7) - כפול 2
      digit *= 2;
      if (digit > 9) digit -= 9;
      sum += digit;
    }
  }
  
  return sum % 10 === 0;
}

// וולידציה למספר חברה (ח.פ.)
export function validateCompanyNumber(num: string): boolean {
  const clean = num.replace(/\D/g, '');
  return clean.length === 9 && clean.startsWith('51');
}

// וולידציה למספר עוסק מורשה
export function validateBusinessNumber(num: string): boolean {
  const clean = num.replace(/\D/g, '');
  return clean.length === 9;
}

// סוגי תביעות עם תיאורים
export const CLAIM_TYPES = {
  consumer: { label: "צרכנות", description: "מוצר פגום, שירות לקוי, ביטול עסקה" },
  contract: { label: "חוזים", description: "הפרת הסכם, אי עמידה בתנאים" },
  rental: { label: "שכירות", description: "דירה, רכב, ציוד" },
  damage: { label: "נזיקין", description: "נזק לרכוש, נזק גוף קל" },
  service: { label: "שירותים", description: "קבלן, בעל מקצוע, נותן שירות" },
  other: { label: "אחר", description: "סוג תביעה אחר" },
};

// רשימת בתי משפט לתביעות קטנות
export const COURTS: CourtData[] = [
  { name: "בית משפט השלום תל אביב", city: "תל אביב", address: "שד' ויצמן 1", phone: "03-6935777" },
  { name: "בית משפט השלום ירושלים", city: "ירושלים", address: "רח' סלאח א-דין 34", phone: "02-6295555" },
  { name: "בית משפט השלום חיפה", city: "חיפה", address: "רח' פלים 12", phone: "04-8698100" },
  { name: "בית משפט השלום באר שבע", city: "באר שבע", address: "שד' הנשיאים 9", phone: "08-6470444" },
  { name: "בית משפט השלום ראשון לציון", city: "ראשון לציון", address: "רח' התקווה 10", phone: "03-9446666" },
  { name: "בית משפט השלום פתח תקווה", city: "פתח תקווה", address: "רח' הנשיא 8", phone: "03-9117200" },
  { name: "בית משפט השלום נתניה", city: "נתניה", address: "כיכר העצמאות 1", phone: "09-8607300" },
  { name: "בית משפט השלום אשדוד", city: "אשדוד", address: "שד' הנשיא 1", phone: "08-8686100" },
  { name: "בית משפט השלום הרצליה", city: "הרצליה", address: "רח' השרון 63", phone: "09-9591300" },
  { name: "בית משפט השלום כפר סבא", city: "כפר סבא", address: "רח' התחנה 1", phone: "09-7479500" },
  { name: "בית משפט השלום חדרה", city: "חדרה", address: "רח' הגיבורים 2", phone: "04-6327600" },
  { name: "בית משפט השלום עכו", city: "עכו", address: "רח' בן עמי 20", phone: "04-9959100" },
  { name: "בית משפט השלום נצרת", city: "נצרת", address: "רח' פאולוס השישי 17", phone: "04-6554600" },
  { name: "בית משפט השלום טבריה", city: "טבריה", address: "רח' הבנים 3", phone: "04-6738100" },
  { name: "בית משפט השלום קריות", city: "קריית ביאליק", address: "דרך עכו 186", phone: "04-8467200" },
  { name: "בית משפט השלום רמלה", city: "רמלה", address: "רח' דני מס 8", phone: "08-9777900" },
  { name: "בית משפט השלום אשקלון", city: "אשקלון", address: "שד' בן גוריון 6", phone: "08-6745700" },
  { name: "בית משפט השלום רחובות", city: "רחובות", address: "רח' הרצל 251", phone: "08-9345300" },
  { name: "בית משפט השלום בת ים", city: "בת ים", address: "רח' יוספטל 1", phone: "03-5127700" },
  { name: "בית משפט השלום אילת", city: "אילת", address: "שד' התמרים 7", phone: "08-6300400" },
];

// מציאת בית משפט לפי עיר הנתבע
export function findCourtByCity(city: string): CourtData | undefined {
  // חיפוש מדויק
  const exactMatch = COURTS.find(c => c.city === city);
  if (exactMatch) return exactMatch;
  
  // חיפוש חלקי
  const partialMatch = COURTS.find(c => 
    city.includes(c.city) || c.city.includes(city)
  );
  if (partialMatch) return partialMatch;
  
  // ברירת מחדל - בית משפט הקרוב ביותר לפי אזור
  // TODO: להוסיף לוגיקה גיאוגרפית
  return COURTS[0]; // תל אביב כברירת מחדל
}
