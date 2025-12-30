"use client";

import { ClaimData, calculateFee } from "./types";

// Re-export הטיפוסים לשימוש ברכיבים אחרים
export type { ClaimData } from "./types";

export interface PDFAttachment {
  name: string;
  url?: string; // base64 data URL or external URL
  type: string;
}

// פונקציה להורדת ה-PDF - קוראת ל-API שמייצר PDF עם Puppeteer
export async function generateClaimPDF(data: ClaimData, attachments?: PDFAttachment[]): Promise<void> {
  const response = await fetch('/api/generate-pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      claimData: data, 
      attachments: attachments || [] 
    }),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to generate PDF';
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch {
      // If response is not JSON, use default error
    }
    throw new Error(errorMessage);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `כתב_תביעה_${data.plaintiff.fullName}_נגד_${data.defendant.name}.pdf`.replace(/\s/g, "_");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// פונקציה לחישוב אגרה
export { calculateFee } from "./types";
