// שירות תביעות קטנות - קונפיגורציה

import { ServiceConfig, Step } from '../index';
import { PRICES } from '@/lib/prices';

export const CLAIMS_STEPS: Step[] = [
  { id: 1, name: "פרטיך", icon: "1" },
  { id: 2, name: "הסיפור", icon: "2" },
  { id: 3, name: "הנתבע", icon: "3" },
  { id: 4, name: "בית משפט", icon: "4" },
  { id: 5, name: "סכום", icon: "5" },
  { id: 6, name: "ראיות", icon: "6" },
  { id: 7, name: "הצהרות", icon: "7" },
  { id: 8, name: "סיכום", icon: "8" },
];

export const CLAIMS_CONFIG: ServiceConfig = {
  id: 'claims',
  name: 'תביעות קטנות',
  nameEnglish: 'Small Claims',
  description: 'הכן כתב תביעה מוכן להגשה לבית המשפט',
  price: PRICES.claims,
  icon: '⚖️',
  color: 'blue',
  steps: CLAIMS_STEPS,
  maxSteps: 8,
};

// Re-exports
export { CLAIMS_SYSTEM_PROMPT, CLAIMS_INITIAL_MESSAGE } from './prompt';
export * from './types';
