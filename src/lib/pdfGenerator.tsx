"use client";

import { ClaimData, calculateFee } from "./types";
import { ServiceType } from "./services";

// Re-export הטיפוסים לשימוש ברכיבים אחרים
export type { ClaimData } from "./types";

export interface PDFAttachment {
  name: string;
  url?: string; // base64 data URL or external URL
  type: string;
}

// Helper to detect data type and extract info
function getDataInfo(data: unknown): { serviceType: ServiceType; filename: string } {
  const d = data as Record<string, unknown>;
  
  // Check if it's parking data (has appellant instead of plaintiff)
  if (d.appellant && d.ticket) {
    const ticket = d.ticket as Record<string, unknown>;
    const appellant = d.appellant as Record<string, unknown>;
    return {
      serviceType: 'parking',
      filename: `ערעור_חניה_${ticket.ticketNumber || 'document'}_${(appellant.fullName as string || '').replace(/\s/g, '_')}.pdf`
    };
  }
  
  // Default to claims
  const plaintiff = d.plaintiff as Record<string, unknown> | undefined;
  const defendant = d.defendant as Record<string, unknown> | undefined;
  return {
    serviceType: 'claims',
    filename: `כתב_תביעה_${plaintiff?.fullName || ''}_נגד_${defendant?.name || ''}.pdf`.replace(/\s/g, "_")
  };
}

// פונקציה להורדת ה-PDF - קוראת ל-API שמייצר PDF עם Puppeteer
export async function generateClaimPDF(
  data: ClaimData | unknown, 
  attachments?: PDFAttachment[],
  signature?: string | null
): Promise<void> {
  const { serviceType, filename } = getDataInfo(data);
  
  // Add signature to data if provided
  const dataWithSignature = signature 
    ? { ...(data as Record<string, unknown>), signature }
    : data;
  
  const response = await fetch('/api/generate-pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      claimData: dataWithSignature,
      serviceType,
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
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// פונקציה לחישוב אגרה
export { calculateFee } from "./types";
