import { ClaimData } from "@/lib/pdfGenerator";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: {
    url: string;
    name: string;
  };
  attachment?: {
    type: "file" | "whatsapp";
    name: string;
    url?: string;
  };
}

export interface ChatInterfaceProps {
  sessionId?: string | null;
  phone?: string | null;
}

export interface Step {
  id: number;
  name: string;
  icon: string;
}

export interface Attachment {
  name: string;
  url?: string;
  type: string;
  preview?: string;
}

export interface UploadedFile {
  name: string;
  url?: string;
  type: string;
}

export interface AppliedCoupon {
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
}

export interface ChatState {
  messages: Message[];
  input: string;
  isLoading: boolean;
  showWelcome: boolean;
  showNextSteps: boolean;
  showPaymentModal: boolean;
  showPreview: boolean;
  showAttachmentsScreen: boolean;
  pdfDownloaded: boolean;
  hasPaid: boolean;
  isProcessingPayment: boolean;
  agreedToTerms: boolean;
  claimData: ClaimData | null;
  currentSessionId: string | null;
  isLoadingSession: boolean;
  attachments: Attachment[];
  uploadedFiles: UploadedFile[];
  isUploading: boolean;
  couponCode: string;
  couponLoading: boolean;
  couponError: string;
  appliedCoupon: AppliedCoupon | null;
}
