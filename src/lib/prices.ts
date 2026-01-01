// הגדרות מחירים מרכזיות לכל האתר
// לשינוי מחיר - שנה כאן ובטבלת settings בסופאבייס

export const PRICES: { claims: number; parking: number } = {
  claims: 79,  // תביעות קטנות
  parking: 39, // ערעור חניה
};

// פורמט להצגה
export const formatPrice = (price: number): string => `₪${price}`;

// מחיר תביעות קטנות מפורמט
export const CLAIMS_PRICE_FORMATTED = formatPrice(PRICES.claims);

// מחיר ערעור חניה מפורמט
export const PARKING_PRICE_FORMATTED = formatPrice(PRICES.parking);
