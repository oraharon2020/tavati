import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function calculateFee(amount: number): number {
  // אגרת בית משפט - 1% מסכום התביעה, מינימום 50 ש"ח
  const fee = Math.max(amount * 0.01, 50);
  return Math.round(fee);
}

export const MAX_CLAIM_AMOUNT = 38900; // סכום מקסימלי לתביעה קטנה 2025

export const CLAIM_TYPES = [
  { id: "consumer", label: "צרכנות", icon: "🛒", description: "מוצר פגום, שירות לקוי, אי עמידה בהתחייבות" },
  { id: "rental", label: "שכירות", icon: "🏠", description: "בעיות עם משכיר, פיקדון, ליקויים בדירה" },
  { id: "contract", label: "חוזים", icon: "📝", description: "הפרת הסכם, אי עמידה בתנאים" },
  { id: "damage", label: "נזיקין", icon: "💥", description: "נזק לרכוש, נזק גוף קל" },
  { id: "service", label: "שירותים", icon: "🔧", description: "קבלן, בעל מקצוע, נותן שירות" },
  { id: "defamation", label: "לשון הרע", icon: "🗣️", description: "פרסום משמיץ, ביקורת פוגענית, השמצה" },
  { id: "privacy", label: "פרטיות", icon: "🔒", description: "צילום ללא רשות, חשיפת מידע אישי" },
  { id: "employment", label: "עבודה", icon: "💼", description: "שכר, פיצויי פיטורין, זכויות עובדים" },
  { id: "insurance", label: "ביטוח", icon: "🛡️", description: "תביעה שנדחתה, פיצוי חסר" },
  { id: "copyright", label: "זכויות יוצרים", icon: "©️", description: "גניבת תוכן, שימוש ללא רשות" },
  { id: "tourism", label: "תיירות", icon: "✈️", description: "ביטול טיסה, חבילת נופש, מלון" },
  { id: "vehicle", label: "רכב", icon: "🚗", description: "מוסך, תאונה, קניית רכב" },
  { id: "spam", label: "ספאם", icon: "📱", description: "הודעות פרסומת ללא הסכמה" },
  { id: "other", label: "אחר", icon: "📋", description: "סוג תביעה אחר" },
] as const;

export const COURTS = [
  { id: "tel-aviv", name: "בית משפט לתביעות קטנות תל אביב", address: "ויצמן 1, תל אביב" },
  { id: "jerusalem", name: "בית משפט לתביעות קטנות ירושלים", address: "כנפי נשרים 22, ירושלים" },
  { id: "haifa", name: "בית משפט לתביעות קטנות חיפה", address: "פל-ים 12, חיפה" },
  { id: "beer-sheva", name: "בית משפט לתביעות קטנות באר שבע", address: "התקווה 5, באר שבע" },
  { id: "nazareth", name: "בית משפט לתביעות קטנות נצרת", address: "המלאכה 17, נצרת" },
  { id: "petah-tikva", name: "בית משפט לתביעות קטנות פתח תקווה", address: "השרון 3, פתח תקווה" },
  { id: "rishon", name: "בית משפט לתביעות קטנות ראשון לציון", address: "הכרמל 20, ראשון לציון" },
  { id: "ashdod", name: "בית משפט לתביעות קטנות אשדוד", address: "הגדוד העברי 1, אשדוד" },
  { id: "netanya", name: "בית משפט לתביעות קטנות נתניה", address: "רזיאל 3, נתניה" },
  { id: "herzliya", name: "בית משפט לתביעות קטנות הרצליה", address: "סוקולוב 46, הרצליה" },
] as const;

export interface ClaimData {
  // פרטי התובע
  plaintiff: {
    firstName: string;
    lastName: string;
    idNumber: string;
    address: string;
    city: string;
    phone: string;
    email: string;
  };
  // פרטי הנתבע
  defendant: {
    name: string;
    type: "person" | "company";
    idOrCompanyNumber: string;
    address: string;
    city: string;
    phone?: string;
  };
  // פרטי התביעה
  claim: {
    type: string;
    amount: number;
    description: string;
    date: string; // תאריך האירוע
    evidence: string[];
    requestedRelief: string;
  };
  // מטא דאטה
  meta: {
    court: string;
    fee: number;
    createdAt: string;
  };
}
