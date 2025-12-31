// טיפוסים לשירות ערעור על דוח חניה

export interface AppellantData {
  fullName: string;
  idNumber: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  email: string;
  isOwner: boolean; // האם בעל הרכב
}

export interface TicketData {
  ticketNumber: string;
  date: string;
  time?: string;
  location: string;
  vehicleNumber: string;
  amount: number;
  authority: string; // הרשות שהוציאה את הדוח
}

export type AppealReasonType = 
  | 'no_sign'      // לא היה שלט
  | 'paid'         // שילמתי
  | 'disabled'     // תו נכה
  | 'emergency'    // מצב חירום
  | 'incorrect'    // פרטים שגויים
  | 'loading'      // פריקה/טעינה
  | 'other';       // אחר

export interface AppealData {
  reason: AppealReasonType;
  reasonLabel: string;
  description: string;
  evidence: string[];
}

export interface ParkingAppealData {
  appellant: AppellantData;
  ticket: TicketData;
  appeal: AppealData;
}

// סיבות ערעור נפוצות
export const APPEAL_REASONS: Record<AppealReasonType, { label: string; description: string }> = {
  no_sign: { label: 'לא היה שלט', description: 'השילוט היה חסר או לא ברור' },
  paid: { label: 'שילמתי', description: 'שילמתי באפליקציה/פנגו/חניון' },
  disabled: { label: 'תו נכה', description: 'יש לי תו נכה בתוקף' },
  emergency: { label: 'מצב חירום', description: 'נאלצתי לעצור בגלל מצב חירום' },
  incorrect: { label: 'פרטים שגויים', description: 'פרטי הדוח שגויים' },
  loading: { label: 'פריקה/טעינה', description: 'הייתי בפריקה/טעינה מורשית' },
  other: { label: 'אחר', description: 'סיבה אחרת' },
};

// רשויות מקומיות נפוצות
export const COMMON_AUTHORITIES = [
  'עיריית תל אביב-יפו',
  'עיריית ירושלים',
  'עיריית חיפה',
  'עיריית באר שבע',
  'עיריית ראשון לציון',
  'עיריית פתח תקווה',
  'עיריית נתניה',
  'עיריית אשדוד',
  'אחזקות איירפורט סיטי',
  'חברת החשמל',
];
