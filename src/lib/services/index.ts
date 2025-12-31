// הגדרות שירותים - מערכת מודולרית

export type ServiceType = 'claims' | 'parking';

export interface Step {
  id: number;
  name: string;
  icon: string;
}

export interface ServiceConfig {
  id: ServiceType;
  name: string;
  nameEnglish: string;
  description: string;
  price: number;
  icon: string;
  color: string;
  steps: Step[];
  maxSteps: number;
}

// ייבוא קונפיגורציות מכל שירות
import { CLAIMS_CONFIG } from './claims';
import { PARKING_CONFIG } from './parking';

// מילון השירותים
export const SERVICES: Record<ServiceType, ServiceConfig> = {
  claims: CLAIMS_CONFIG,
  parking: PARKING_CONFIG,
};

// פונקציה לקבלת שירות לפי סוג
export function getService(serviceType: ServiceType): ServiceConfig {
  return SERVICES[serviceType] || SERVICES.claims;
}

// פונקציה לקבלת פרומפט לפי שירות
export async function getServicePrompt(serviceType: ServiceType): Promise<string> {
  switch (serviceType) {
    case 'claims':
      const { CLAIMS_SYSTEM_PROMPT } = await import('./claims/prompt');
      return CLAIMS_SYSTEM_PROMPT;
    case 'parking':
      const { PARKING_SYSTEM_PROMPT } = await import('./parking/prompt');
      return PARKING_SYSTEM_PROMPT;
    default:
      const { CLAIMS_SYSTEM_PROMPT: defaultPrompt } = await import('./claims/prompt');
      return defaultPrompt;
  }
}

// פונקציה לקבלת הודעה ראשונה לפי שירות
export async function getServiceInitialMessage(serviceType: ServiceType): Promise<string> {
  switch (serviceType) {
    case 'claims':
      const { CLAIMS_INITIAL_MESSAGE } = await import('./claims/prompt');
      return CLAIMS_INITIAL_MESSAGE;
    case 'parking':
      const { PARKING_INITIAL_MESSAGE } = await import('./parking/prompt');
      return PARKING_INITIAL_MESSAGE;
    default:
      const { CLAIMS_INITIAL_MESSAGE: defaultMsg } = await import('./claims/prompt');
      return defaultMsg;
  }
}

// Re-export לתאימות לאחור
export { CLAIMS_CONFIG } from './claims';
export { PARKING_CONFIG } from './parking';
