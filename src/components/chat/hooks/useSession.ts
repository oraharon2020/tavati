"use client";

import { useState, useCallback, useEffect } from "react";
import { Message, Attachment, UploadedFile } from "../types";
import { ClaimData } from "@/lib/pdfGenerator";
import { ServiceType, getServiceInitialMessage } from "@/lib/services";

interface UseSessionProps {
  sessionId?: string | null;
  phone?: string | null;
  serviceType?: ServiceType;
}

interface UseSessionReturn {
  currentSessionId: string | null;
  setCurrentSessionId: React.Dispatch<React.SetStateAction<string | null>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  claimData: ClaimData | null;
  setClaimData: React.Dispatch<React.SetStateAction<ClaimData | null>>;
  hasPaid: boolean;
  setHasPaid: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingSession: boolean;
  showNextSteps: boolean;
  setShowNextSteps: React.Dispatch<React.SetStateAction<boolean>>;
  pdfDownloaded: boolean;
  setPdfDownloaded: React.Dispatch<React.SetStateAction<boolean>>;
  showWelcome: boolean;
  setShowWelcome: React.Dispatch<React.SetStateAction<boolean>>;
  uploadedFiles: UploadedFile[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  attachments: Attachment[];
  setAttachments: React.Dispatch<React.SetStateAction<Attachment[]>>;
  signature: string | null;
  setSignature: React.Dispatch<React.SetStateAction<string | null>>;
  saveToSession: (newMessages: Message[], step?: number, claimDataToSave?: ClaimData | null) => Promise<void>;
  resetChat: () => void;
  createNewSession: () => Promise<string | null>;
}

export function useSession({ sessionId, phone, serviceType = 'claims' }: UseSessionProps): UseSessionReturn {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(sessionId || null);
  const [isLoadingSession, setIsLoadingSession] = useState(!!sessionId);
  const [initialMessage, setInitialMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [claimData, setClaimData] = useState<ClaimData | null>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [showNextSteps, setShowNextSteps] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [signature, setSignature] = useState<string | null>(null);

  // טעינת ההודעה הראשונה לפי שירות
  useEffect(() => {
    getServiceInitialMessage(serviceType).then((msg) => {
      setInitialMessage(msg);
      if (messages.length === 0) {
        setMessages([{
          id: "welcome",
          role: "assistant",
          content: msg,
        }]);
      }
    });
  }, [serviceType]);

  // Create new session when starting fresh chat
  const createNewSession = useCallback(async () => {
    if (!phone || currentSessionId) return null;
    
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, serviceType }),
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.session?.id) {
          setCurrentSessionId(data.session.id);
          return data.session.id;
        }
      }
    } catch (error) {
      console.error("Failed to create session:", error);
    }
    return null;
  }, [phone, currentSessionId, serviceType]);

  // Load existing session
  const loadSession = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/session/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages.map((m: { role: string; content: string }, i: number) => ({
            id: `loaded-${i}`,
            role: m.role as "user" | "assistant",
            content: m.content,
          })));
          setShowWelcome(false);
          
          // Load claim_data if exists
          if (data.claim_data && Object.keys(data.claim_data).length > 0) {
            setClaimData(data.claim_data);
          }
          
          // Check if already paid (from DB status or localStorage)
          const localPaid = typeof window !== 'undefined' && localStorage.getItem(`paid_${id}`) === 'true';
          const dbPaid = data.status === 'paid';
          if (dbPaid || localPaid) {
            console.log('Session marked as paid:', { db: dbPaid, local: localPaid });
            setHasPaid(true);
            setShowNextSteps(true);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load session:", error);
    } finally {
      setIsLoadingSession(false);
    }
  }, []);

  // Save to session
  const saveToSession = useCallback(async (
    newMessages: Message[], 
    step?: number, 
    claimDataToSave?: ClaimData | null
  ) => {
    let sessionIdToUse = currentSessionId;
    
    // Create session if doesn't exist
    if (!sessionIdToUse && phone) {
      sessionIdToUse = await createNewSession();
      if (!sessionIdToUse) return;
    }
    
    if (!sessionIdToUse) return;
    
    try {
      const updateData: Record<string, unknown> = {
        messages: newMessages.map(m => ({
          role: m.role,
          content: m.content,
          timestamp: new Date().toISOString(),
        })),
      };
      
      // Add step if provided
      if (step) {
        updateData.current_step = step;
      }
      
      // Add claim_data if provided
      if (claimDataToSave) {
        updateData.claim_data = claimDataToSave;
        updateData.status = "pending_payment";
      }
      
      await fetch(`/api/session/${sessionIdToUse}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
    } catch (error) {
      console.error("Failed to save session:", error);
    }
  }, [currentSessionId, phone, createNewSession]);

  // Reset chat
  const resetChat = useCallback(async () => {
    const msg = await getServiceInitialMessage(serviceType);
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: msg,
      },
    ]);
    setShowWelcome(true);
    setClaimData(null);
    setShowNextSteps(false);
    setPdfDownloaded(false);
    setHasPaid(false);
    setUploadedFiles([]);
    setAttachments([]);
  }, [serviceType]);

  // Load existing session if sessionId provided, or reset for new session
  useEffect(() => {
    if (sessionId) {
      loadSession(sessionId);
    } else {
      // Reset to fresh state for new session
      setCurrentSessionId(null);
      getServiceInitialMessage(serviceType).then((msg) => {
        setMessages([
          {
            id: "welcome",
            role: "assistant",
            content: msg,
          },
        ]);
      });
      setShowWelcome(true);
      setShowNextSteps(false);
      setPdfDownloaded(false);
      setHasPaid(false);
      setIsLoadingSession(false);
      setClaimData(null);
      setUploadedFiles([]);
      setAttachments([]);
    }
  }, [sessionId, loadSession, serviceType]);

  return {
    currentSessionId,
    setCurrentSessionId,
    messages,
    setMessages,
    claimData,
    setClaimData,
    hasPaid,
    setHasPaid,
    isLoadingSession,
    showNextSteps,
    setShowNextSteps,
    pdfDownloaded,
    setPdfDownloaded,
    showWelcome,
    setShowWelcome,
    uploadedFiles,
    setUploadedFiles,
    attachments,
    setAttachments,
    signature,
    setSignature,
    saveToSession,
    resetChat,
    createNewSession,
  };
}
