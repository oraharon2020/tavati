// טיפוסים לשירות תביעות קטנות

export interface PlaintiffData {
  fullName: string;
  idNumber: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  email: string;
}

export interface DefendantData {
  name: string;
  type: "individual" | "business" | "company";
  idOrCompanyNumber: string;
  address: string;
  city: string;
  zipCode: string;
  phone?: string;
}

export interface ClaimDetails {
  type: "consumer" | "contract" | "rental" | "damage" | "service" | "other";
  amount: number;
  description: string;
  date: string;
  evidence: string[];
  breakdown: string;
  legalBasis?: string;
}

export interface CourtData {
  name: string;
  city: string;
  address: string;
  phone?: string;
}

export interface ClaimData {
  plaintiff: PlaintiffData;
  defendant: DefendantData;
  claim: ClaimDetails;
  court?: CourtData;
  declarations: {
    under5Claims: boolean;
    truthful: boolean;
  };
  metadata?: {
    createdAt: string;
    caseNumber?: string;
    fee: number;
  };
}

// סכום מקסימלי לתביעה קטנה
export const MAX_CLAIM_AMOUNT = 38900;

// אגרה - 1% מהסכום, מינימום 50 ש"ח
export function calculateFee(amount: number): number {
  return Math.max(Math.round(amount * 0.01), 50);
}

// סוגי תביעות
export const CLAIM_TYPES = {
  consumer: { label: "צרכנות", description: "מוצר פגום, שירות לקוי, ביטול עסקה" },
  contract: { label: "חוזים", description: "הפרת הסכם, אי עמידה בתנאים" },
  rental: { label: "שכירות", description: "דירה, רכב, ציוד" },
  damage: { label: "נזיקין", description: "נזק לרכוש, נזק גוף קל" },
  service: { label: "שירותים", description: "קבלן, בעל מקצוע, נותן שירות" },
  other: { label: "אחר", description: "סוג תביעה אחר" },
};
