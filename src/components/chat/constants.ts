import { Step } from "./types";
import { SERVICES, ServiceType } from "@/lib/services";

// ברירת מחדל - תביעות קטנות (לתאימות לאחור)
export const STEPS: Step[] = SERVICES.claims.steps;
export const BASE_PRICE = SERVICES.claims.price;

// פונקציה לקבלת שלבים לפי שירות
export function getStepsForService(serviceType: ServiceType): Step[] {
  return SERVICES[serviceType]?.steps || STEPS;
}

// Cache למחירים מה-DB
let pricesCache: { claims: number; parking: number } | null = null;
let pricesCacheTime = 0;
const CACHE_TTL = 60000; // 1 minute

// פונקציה לקבלת מחירים מה-API
export async function fetchPrices(): Promise<{ claims: number; parking: number }> {
  // Return from cache if fresh
  if (pricesCache && Date.now() - pricesCacheTime < CACHE_TTL) {
    return pricesCache;
  }
  
  try {
    const res = await fetch("/api/prices");
    if (res.ok) {
      const data = await res.json();
      pricesCache = data.prices;
      pricesCacheTime = Date.now();
      return data.prices;
    }
  } catch (error) {
    console.error("Error fetching prices:", error);
  }
  
  // Fallback to defaults
  return {
    claims: SERVICES.claims.price,
    parking: SERVICES.parking.price,
  };
}

// פונקציה סינכרונית לקבלת מחיר (מ-cache או default)
export function getPriceForService(serviceType: ServiceType): number {
  if (pricesCache) {
    return pricesCache[serviceType] || SERVICES[serviceType]?.price || BASE_PRICE;
  }
  return SERVICES[serviceType]?.price || BASE_PRICE;
}

// פונקציה אסינכרונית לקבלת מחיר עדכני
export async function getPriceForServiceAsync(serviceType: ServiceType): Promise<number> {
  const prices = await fetchPrices();
  return prices[serviceType] || SERVICES[serviceType]?.price || BASE_PRICE;
}
