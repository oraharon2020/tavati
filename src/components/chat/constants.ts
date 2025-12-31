import { Step } from "./types";
import { SERVICES, ServiceType } from "@/lib/services";

// ברירת מחדל - תביעות קטנות (לתאימות לאחור)
export const STEPS: Step[] = SERVICES.claims.steps;
export const BASE_PRICE = SERVICES.claims.price;

// פונקציה לקבלת שלבים לפי שירות
export function getStepsForService(serviceType: ServiceType): Step[] {
  return SERVICES[serviceType]?.steps || STEPS;
}

// פונקציה לקבלת מחיר לפי שירות
export function getPriceForService(serviceType: ServiceType): number {
  return SERVICES[serviceType]?.price || BASE_PRICE;
}
