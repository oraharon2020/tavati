// שירות ערעור על דוח חניה - קונפיגורציה

import { ServiceConfig, Step } from '../index';
import { PRICES } from '@/lib/prices';

export const PARKING_STEPS: Step[] = [
  { id: 1, name: "פרטיך", icon: "1" },
  { id: 2, name: "פרטי הדוח", icon: "2" },
  { id: 3, name: "סיבה וראיות", icon: "3" },
  { id: 4, name: "סיכום", icon: "4" },
];

export const PARKING_CONFIG: ServiceConfig = {
  id: 'parking',
  name: 'ערעור דוח חניה',
  nameEnglish: 'Parking Ticket Appeal',
  description: 'ערער על דוח חניה בקלות ובמהירות',
  price: PRICES.parking,
  icon: '🚗',
  color: 'emerald',
  steps: PARKING_STEPS,
  maxSteps: 4,
};

// Re-exports
export { PARKING_SYSTEM_PROMPT, PARKING_INITIAL_MESSAGE } from './prompt';
export * from './types';
export { generateParkingAppealHTML } from './pdf-template';
