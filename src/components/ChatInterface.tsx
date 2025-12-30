"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Send, Loader2, Scale, RotateCcw, FileText, Download, CheckCircle2, MapPin, CreditCard, FileCheck, ArrowLeft, Paperclip, Upload, X, MessageSquare, Plus, Image, File, Trash2, Eye, Shield, Tag, Home, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { INITIAL_MESSAGE } from "@/lib/prompts";
import { motion, AnimatePresence } from "framer-motion";
import { generateClaimPDF, type ClaimData } from "@/lib/pdfGenerator";
import { findCourtByCity, calculateFee, COURTS } from "@/lib/types";
import { PaymentModal, PreviewModal, ChatHeader, STEPS, BASE_PRICE } from "./chat";
import type { Message, Attachment, UploadedFile, AppliedCoupon } from "./chat";

interface ChatInterfaceProps {
  sessionId?: string | null;
  phone?: string | null;
}

export default function ChatInterface({ sessionId, phone }: ChatInterfaceProps = {}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(sessionId || null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showNextSteps, setShowNextSteps] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount_type: "percentage" | "fixed";
    discount_value: number;
  } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isLoadingSession, setIsLoadingSession] = useState(!!sessionId);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: INITIAL_MESSAGE,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [claimData, setClaimData] = useState<ClaimData | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showAttachmentsScreen, setShowAttachmentsScreen] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showMobileSteps, setShowMobileSteps] = useState(false);

  // Create new session when starting fresh chat
  const createNewSession = async () => {
    if (!phone || currentSessionId) return;
    
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
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
  };

  // Check for payment success when returning from payment page
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get("payment");
    const returnedSessionId = urlParams.get("session");
    
    if (paymentStatus === "success") {
      // Payment was successful
      setHasPaid(true);
      setShowPaymentModal(false);
      setShowNextSteps(true);
      
      // Clean up URL (remove query params)
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, "", cleanUrl);
      
      // If we have claim data, generate PDF
      if (claimData) {
        generateClaimPDF(claimData).then(() => {
          setPdfDownloaded(true);
        }).catch(console.error);
      }
    } else if (paymentStatus === "cancelled") {
      // Payment was cancelled - just clean up URL
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, "", cleanUrl);
    }
  }, [claimData]);

  // Load existing session if sessionId provided, or reset for new session
  useEffect(() => {
    if (sessionId) {
      loadSession(sessionId);
    } else {
      // Reset to fresh state for new session
      setCurrentSessionId(null);
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: INITIAL_MESSAGE,
        },
      ]);
      setShowWelcome(true);
      setShowNextSteps(false);
      setPdfDownloaded(false);
      setHasPaid(false);
      setShowPaymentModal(false);
      setIsLoadingSession(false);
      setClaimData(null);
      setUploadedFiles([]);
      setAttachments([]);
      setInput("");
    }
  }, [sessionId]);

  const loadSession = async (id: string) => {
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
          
          // Check if already paid
          if (data.has_paid) {
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
  };

  const saveToSession = async (newMessages: Message[], step?: number, claimDataToSave?: ClaimData | null) => {
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
  };

  // העלאת נספחים
  const handleAttachmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("sessionId", currentSessionId || "");

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.success) {
          // Create preview for images
          let preview: string | undefined;
          if (data.type === "image" || data.url?.startsWith("data:image")) {
            preview = data.url;
          }
          
          setAttachments(prev => [...prev, {
            name: data.fileName || file.name,
            url: data.url,
            type: data.fileType || file.type,
            preview,
          }]);
        }
      } catch (error) {
        console.error("Attachment upload failed:", error);
      }
    }

    setIsUploading(false);
    if (attachmentInputRef.current) {
      attachmentInputRef.current.value = "";
    }
  };

  // העלאת קובץ
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("sessionId", currentSessionId || "");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        if (data.type === "text" && data.parsed) {
          // WhatsApp export - שלח לבוט לניתוח
          const whatsappMessage = `העליתי שיחת WhatsApp:
${data.summary || `נמצאו ${data.parsed.messages.length} הודעות`}

תוכן השיחה:
${data.content.slice(0, 8000)}${data.content.length > 8000 ? "\n...(קוצר)" : ""}

אנא נתח את השיחה וזהה הודעות שיכולות לשמש כראיות לתביעה.`;

          setInput(whatsappMessage);
          // Auto-submit
          setTimeout(() => {
            const submitBtn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
            submitBtn?.click();
          }, 100);
        } else if (data.type === "image" && data.url) {
          // תמונה - שמור לשליחה ל-Claude
          setUploadedFiles(prev => [...prev, {
            name: data.fileName,
            url: data.url,
            type: data.fileType,
          }]);
          // הוסף הודעה שיש תמונה
          setInput(prev => prev + (prev ? "\n" : "") + `[העליתי צילום מסך: ${data.fileName}]`);
        } else {
          // קובץ רגיל - הוסף לרשימה
          setUploadedFiles(prev => [...prev, {
            name: data.fileName,
            url: data.url,
            type: data.fileType,
          }]);
          setInput(prev => prev + (prev ? "\n" : "") + `צירפתי קובץ: ${data.fileName}`);
        }
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("שגיאה בהעלאת הקובץ");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // זיהוי השלב הנוכחי מההודעות
  const currentStep = useMemo(() => {
    const lastAssistantMessage = [...messages].reverse().find(m => m.role === "assistant");
    if (!lastAssistantMessage) return 1;
    
    const match = lastAssistantMessage.content.match(/שלב\s*(\d)/);
    return match ? parseInt(match[1]) : 1;
  }, [messages]);

  // זיהוי אם התביעה מוכנה (יש JSON בהודעה)
  const extractClaimData = useCallback((content: string): ClaimData | null => {
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.status === "complete" && parsed.claimData) {
          return parsed.claimData;
        }
      } catch (e) {
        console.error("Failed to parse claim data:", e);
      }
    }
    return null;
  }, []);

  // בדיקה אם יש תביעה מוכנה
  useEffect(() => {
    const lastAssistantMessage = [...messages].reverse().find(m => m.role === "assistant");
    if (lastAssistantMessage) {
      const data = extractClaimData(lastAssistantMessage.content);
      if (data) {
        setClaimData(data);
      }
    }
  }, [messages, extractClaimData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    // בדוק אם יש תמונות לשלוח
    const imagesToSend = uploadedFiles.filter(f => 
      f.type?.startsWith("image/") && f.url?.startsWith("data:")
    );

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setUploadedFiles([]); // נקה קבצים אחרי שליחה
    setIsLoading(true);
    setShowWelcome(false);

    try {
      // הכן הודעות לשליחה - כולל תמונות אם יש
      const messagesToSend = [...messages, userMessage].map((m) => {
        // אם זו ההודעה האחרונה ויש תמונות, שלח אותן
        if (m.id === userMessage.id && imagesToSend.length > 0) {
          return {
            role: m.role,
            content: m.content,
            images: imagesToSend.map(img => img.url),
          };
        }
        return {
          role: m.role,
          content: m.content,
        };
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messagesToSend }),
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      };
      
      setMessages((prev) => [...prev, assistantMessage]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const text = decoder.decode(value);
        assistantMessage.content += text;
        setMessages((prev) => 
          prev.map((m) => 
            m.id === assistantMessage.id ? { ...m, content: assistantMessage.content } : m
          )
        );
      }

      // Save to session after message complete
      const updatedMessages = [...messages, userMessage, assistantMessage];
      saveToSession(updatedMessages, currentStep, claimData);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "מצטער, משהו השתבש. אנא נסה שוב.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, saveToSession, currentStep, claimData]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: INITIAL_MESSAGE,
      },
    ]);
    setShowWelcome(true);
    setClaimData(null);
    setShowNextSteps(false);
    setPdfDownloaded(false);
    setHasPaid(false);
    setShowPaymentModal(false);
  };

  const handleQuickAction = (text: string) => {
    setInput(text);
    setTimeout(() => handleSubmit(), 100);
  };

  // בדיקת קופון
  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setCouponLoading(true);
    setCouponError("");
    
    try {
      const res = await fetch("/api/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim().toUpperCase() }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.valid) {
        setAppliedCoupon({
          code: data.coupon.code,
          discount_type: data.coupon.discount_type,
          discount_value: data.coupon.discount_value,
        });
        setCouponError("");
      } else {
        setCouponError(data.error || "קופון לא תקף");
        setAppliedCoupon(null);
      }
    } catch {
      setCouponError("שגיאה בבדיקת הקופון");
    } finally {
      setCouponLoading(false);
    }
  };

  // חישוב מחיר סופי
  const calculateFinalPrice = () => {
    if (!appliedCoupon) return BASE_PRICE;
    
    if (appliedCoupon.discount_type === "percentage") {
      return Math.round(BASE_PRICE * (1 - appliedCoupon.discount_value / 100));
    } else {
      return Math.max(0, BASE_PRICE - appliedCoupon.discount_value);
    }
  };

  // תשלום והורדה
  const handlePaymentAndDownload = () => {
    if (!claimData) return;
    setShowPaymentModal(true);
  };

  // תשלום דרך Grow/משולם
  const processPayment = async () => {
    if (!claimData || !currentSessionId) {
      alert("שגיאה: חסרים נתונים. אנא נסה שוב.");
      return;
    }
    
    setIsProcessingPayment(true);
    
    try {
      // יצירת דף תשלום ב-Grow/משולם
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: currentSessionId,
          amount: calculateFinalPrice(),
          description: "כתב תביעה - תבעתי",
          customerName: claimData.plaintiff.fullName,
          customerPhone: claimData.plaintiff.phone,
          customerEmail: claimData.plaintiff.email || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.details || "שגיאה ביצירת דף תשלום");
      }

      // העברה לדף התשלום של משולם
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error("לא התקבל קישור לדף תשלום");
      }
      
    } catch (error) {
      console.error("Payment failed:", error);
      alert(error instanceof Error ? error.message : "שגיאה בתשלום. אנא נסה שוב.");
      setIsProcessingPayment(false);
    }
    // לא מכבים את isProcessingPayment כי הדף עובר redirect
  };

  const handleGeneratePDF = async () => {
    if (!claimData) return;
    
    // אם כבר שילם, אפשר להוריד שוב
    if (hasPaid) {
      try {
        await generateClaimPDF(claimData);
        setPdfDownloaded(true);
      } catch (error) {
        console.error("Failed to generate PDF:", error);
        alert("שגיאה ביצירת ה-PDF. אנא נסה שוב.");
      }
    } else {
      // אם לא שילם, פתח מסך תשלום
      handlePaymentAndDownload();
    }
  };

  // בקש מה-AI ליצור את ה-JSON כשהמשתמש לוחץ על כפתור
  const requestClaimGeneration = async () => {
    if (isLoading) return;
    
    const requestMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: "הכל נכון! אנא צור את כתב התביעה.",
    };

    setMessages((prev) => [...prev, requestMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, requestMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      };
      
      setMessages((prev) => [...prev, assistantMessage]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const text = decoder.decode(value);
        assistantMessage.content += text;
        setMessages((prev) => 
          prev.map((m) => 
            m.id === assistantMessage.id ? { ...m, content: assistantMessage.content } : m
          )
        );
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // חישוב פרטי בית המשפט והאגרה
  const courtInfo = useMemo(() => {
    if (!claimData) return null;
    const court = findCourtByCity(claimData.defendant.city);
    const fee = calculateFee(claimData.claim.amount);
    return { court, fee };
  }, [claimData]);

  // עיבוד והצגת הודעות
  const formatMessage = (content: string) => {
    // הסתר JSON blocks - גם אלה שעדיין נכתבים (streaming)
    let formatted = content.replace(/```json[\s\S]*?(```|$)/g, "");
    // הסתר גם אם יש JSON בלי backticks
    formatted = formatted.replace(/\{\s*"status"\s*:\s*"complete"[\s\S]*/g, "");
    // הסתר כל דבר שמתחיל ב-{ ונראה כמו JSON
    formatted = formatted.replace(/\{\s*"\s*[\s\S]*$/g, "");
    // נקה רווחים מיותרים
    formatted = formatted.replace(/\n{3,}/g, "\n\n").trim();
    // אם נשאר רק טקסט קצר אחרי הסרת JSON, הוסף הודעה
    if (formatted.length < 20 && content.includes('"status": "complete"')) {
      return "התביעה מוכנה! לחץ על \"הורד כתב תביעה\" למעלה.";
    }
    return formatted;
  };

  // רנדור טקסט עם markdown פשוט (בולד וקו מפריד)
  const renderFormattedText = (text: string) => {
    const formatted = formatMessage(text);
    
    // פיצול לפי שורות
    const lines = formatted.split("\n");
    
    return lines.map((line, lineIndex) => {
      // קו מפריד
      if (line.trim() === "---") {
        return <hr key={lineIndex} className="my-3 border-[var(--border)]" />;
      }
      
      // עיבוד בולד **text**
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      
      return (
        <span key={lineIndex}>
          {parts.map((part, partIndex) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              // בולד
              return (
                <strong key={partIndex} className="font-bold">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
          {lineIndex < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  // מסך "מה עכשיו?" - הנחיות להגשת התביעה
  if (showNextSteps && claimData && courtInfo && courtInfo.court) {
    const court = courtInfo.court;
    
    // מסך הוספת נספחים
    if (showAttachmentsScreen) {
      return (
        <div className="min-h-screen bg-[var(--background)] p-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pt-4">
              <button
                onClick={() => setShowAttachmentsScreen(false)}
                className="p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold">הוספת נספחים לתביעה</h1>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <h4 className="font-bold text-blue-800 mb-2">💡 מהם נספחים?</h4>
              <p className="text-sm text-blue-700">
                נספחים הם ראיות שתומכות בתביעה: צילומי מסך של שיחות, קבלות, חשבוניות, תמונות של המוצר הפגום וכו׳.
                הם יצורפו לכתב התביעה ויוגשו לבית המשפט.
              </p>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={attachmentInputRef}
              onChange={handleAttachmentUpload}
              accept=".jpg,.jpeg,.png,.heic,.webp,.pdf,.doc,.docx"
              multiple
              className="hidden"
            />

            {/* Upload Button */}
            <button
              onClick={() => attachmentInputRef.current?.click()}
              disabled={isUploading}
              className="w-full mb-6 p-6 border-2 border-dashed border-[var(--border)] rounded-xl hover:border-[var(--primary)] hover:bg-[var(--secondary)] transition-all flex flex-col items-center gap-3"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
                  <span className="text-[var(--muted)]">מעלה קבצים...</span>
                </>
              ) : (
                <>
                  <Plus className="w-10 h-10 text-[var(--primary)]" />
                  <span className="font-medium">לחץ להוספת קבצים</span>
                  <span className="text-sm text-[var(--muted)]">תמונות, PDF, מסמכי Word</span>
                </>
              )}
            </button>

            {/* Attachments List */}
            {attachments.length > 0 && (
              <div className="space-y-3 mb-6">
                <h3 className="font-medium text-sm text-[var(--muted)]">נספחים שהועלו ({attachments.length}):</h3>
                {attachments.map((attachment, idx) => (
                  <div
                    key={idx}
                    className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 flex items-center gap-3"
                  >
                    {/* Preview or icon */}
                    {attachment.preview ? (
                      <img
                        src={attachment.preview}
                        alt={attachment.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : attachment.type?.includes("pdf") ? (
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-red-600" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-[var(--secondary)] rounded-lg flex items-center justify-center">
                        <File className="w-6 h-6 text-[var(--muted)]" />
                      </div>
                    )}
                    
                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{attachment.name}</p>
                      <p className="text-xs text-[var(--muted)]">נספח {String.fromCharCode(1488 + idx)}</p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2">
                      {attachment.url && (
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors"
                          title="צפה בקובץ"
                        >
                          <Eye className="w-4 h-4 text-[var(--muted)]" />
                        </a>
                      )}
                      <button
                        onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="הסר"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Suggested attachments based on claim */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 mb-6">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
                נספחים מומלצים לתביעה שלך:
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-[var(--muted)]">☐</span>
                  צילום מסך של ההזמנה/חשבונית
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--muted)]">☐</span>
                  תכתובת עם הנתבע (WhatsApp/מייל)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--muted)]">☐</span>
                  תמונות של הפגם/נזק (אם יש)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--muted)]">☐</span>
                  אישור תשלום (העברה בנקאית/כרטיס אשראי)
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  // Here you would regenerate PDF with attachments
                  // For now, just go back to main screen
                  setShowAttachmentsScreen(false);
                  handleGeneratePDF();
                }}
                disabled={attachments.length === 0}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors",
                  attachments.length > 0
                    ? "bg-[var(--accent)] text-white hover:opacity-90"
                    : "bg-[var(--secondary)] text-[var(--muted)] cursor-not-allowed"
                )}
              >
                <Download className="w-5 h-5" />
                הורד תביעה עם {attachments.length} נספחים
              </button>
              <button
                onClick={() => setShowAttachmentsScreen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--secondary)] rounded-xl hover:bg-[var(--border)] transition-colors"
              >
                חזרה למסך ההנחיות
              </button>
            </div>

            {/* Tip */}
            <p className="text-xs text-center text-[var(--muted)] mt-4">
              💡 טיפ: אפשר גם להדפיס את הנספחים בנפרד ולצרף אותם ידנית לתביעה
            </p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3 shadow-sm">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900">תבעתי</h1>
                <p className="text-xs text-gray-500">מערכת הגשת תביעות</p>
              </div>
            </div>
            <button
              onClick={() => setShowNextSteps(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              חזרה לשיחה
            </button>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30"
            >
              <CheckCircle2 className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">מעולה! התביעה הורדה 🎉</h1>
            <p className="text-gray-500">עכשיו נשאר רק להגיש לבית המשפט</p>
          </div>

          {/* Steps */}
          <div className="space-y-4 mb-8">
            {/* Step 1: בית המשפט */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    בית המשפט שלך
                  </h3>
                  <p className="text-lg font-semibold text-blue-600">{court.name}</p>
                  <p className="text-sm text-gray-500">{court.address}</p>
                  {court.phone && (
                    <a href={`tel:${court.phone}`} className="inline-flex items-center gap-1 mt-2 text-sm text-emerald-600 hover:underline">
                      📞 {court.phone}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Step 2: תשלום אגרה + הגשה */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-500" />
                    תשלום אגרה + הגשת התביעה
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-2xl font-bold text-amber-600">{courtInfo.fee} ₪</p>
                    <span className="text-sm text-gray-400">(אגרה ממשלתית)</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">באתר הממשלתי אפשר לשלם אגרה ולהגיש את התביעה במקום אחד</p>
                  
                  {/* הערה חשובה */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                    <p className="text-sm text-amber-800 flex items-center gap-2">
                      <span>⚠️</span>
                      <span><strong>שימו לב:</strong> ההגשה המקוונת פועלת רק דרך מחשב (לא בנייד)</span>
                    </p>
                  </div>
                  
                  <a 
                    href="https://www.gov.il/he/service/filing_a_small_claim" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-md"
                  >
                    לתשלום אגרה והגשה באתר הממשלתי
                    <span>←</span>
                  </a>
                  
                  {/* אופציות נוספות */}
                  <p className="text-xs text-gray-400 mt-3">או לחלופין: בפקס/פיזית ללשכת בית המשפט</p>
                </div>
              </div>
            </motion.div>

            {/* Step 3: מה להביא */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">📋 צ׳ק-ליסט להגשה:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center">☑️</span>
                      כתב התביעה (הקובץ שהורדת)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center">☑️</span>
                      אישור תשלום אגרה
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center">☑️</span>
                      צילום תעודת זהות
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center">☑️</span>
                      כל הראיות שציינת בתביעה
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center">☑️</span>
                      2 עותקים מכל מסמך (לך ולנתבע)
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 mb-6"
          >
            <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
              <span className="text-xl">💡</span>
              טיפים חשובים
            </h4>
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                הדיון יתקיים תוך כ-60 יום מההגשה
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                תקבל הודעה בדואר על מועד הדיון
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                אפשר להביא עד 2 עדים לדיון
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                הגע 15 דקות לפני הדיון
              </li>
            </ul>
          </motion.div>

          {/* Actions */}
          <div className="flex flex-col gap-3 mb-4">
            {/* Primary: Download PDF again */}
            <button
              onClick={handleGeneratePDF}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-xl hover:opacity-90 transition-all font-semibold shadow-lg shadow-blue-500/20"
            >
              <Download className="w-5 h-5" />
              הורד שוב את כתב התביעה
            </button>
            
            {/* Secondary: Add Attachments */}
            <button
              onClick={() => setShowAttachmentsScreen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors text-gray-700 font-medium"
            >
              <Plus className="w-5 h-5" />
              הוסף נספחים (צילומי מסך, קבלות)
              {attachments.length > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {attachments.length}
                </span>
              )}
            </button>
          </div>

          {/* Start New */}
          <button
            onClick={resetChat}
            className="w-full mt-4 text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            התחל תביעה חדשה
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        {/* Mobile: Clean single row */}
        <div className="sm:hidden px-3 py-2.5">
          <div className="grid grid-cols-3 items-center">
            {/* Left: Logo + Name */}
            <Link href="/" className="flex items-center gap-2 justify-self-start">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">תבעתי</span>
            </Link>

            {/* Center: Progress indicator - clickable */}
            <button
              onClick={() => setShowMobileSteps(!showMobileSteps)}
              className="flex items-center justify-center gap-1.5 text-sm bg-neutral-50 hover:bg-neutral-100 rounded-full px-3 py-1.5 transition-colors"
            >
              <span className="font-semibold text-neutral-800">{STEPS[currentStep - 1]?.name}</span>
              <span className="text-neutral-500 font-medium">{currentStep}/{STEPS.length}</span>
              <ChevronDown className={cn("w-3.5 h-3.5 text-neutral-400 transition-transform", showMobileSteps && "rotate-180")} />
            </button>

            {/* Right: Reset */}
            <button
              onClick={resetChat}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors justify-self-end"
              title="התחל מחדש"
              aria-label="התחל שיחה חדשה"
            >
              <RotateCcw className="w-4 h-4 text-neutral-400" aria-hidden="true" />
            </button>
          </div>

          {/* Mobile Steps Dropdown */}
          <AnimatePresence>
            {showMobileSteps && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-3 bg-neutral-50 rounded-xl p-3 space-y-2">
                  {STEPS.map((step) => (
                    <div
                      key={step.id}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-lg transition-colors",
                        currentStep === step.id && "bg-white shadow-sm",
                        currentStep > step.id && "opacity-60"
                      )}
                    >
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0",
                        currentStep > step.id
                          ? "bg-emerald-500 text-white"
                          : currentStep === step.id
                          ? "bg-blue-500 text-white"
                          : "bg-neutral-200 text-neutral-500"
                      )}>
                        {currentStep > step.id ? "✓" : step.icon}
                      </div>
                      <span className={cn(
                        "font-medium text-sm",
                        currentStep === step.id ? "text-blue-600" : 
                        currentStep > step.id ? "text-emerald-600" : "text-neutral-500"
                      )}>
                        {step.name}
                      </span>
                      {currentStep === step.id && (
                        <span className="mr-auto text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                          כאן אתה
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop: Full header */}
        <div className="hidden sm:block px-4 py-3">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                title="חזרה לדף הבית"
              >
                <Home className="w-5 h-5 text-neutral-500" />
              </Link>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900">תבעתי</h1>
                <p className="text-xs text-gray-500">מערכת הגשת תביעות</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetChat}
                className="p-2.5 rounded-lg hover:bg-[var(--secondary)] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                title="התחל מחדש"
                aria-label="התחל שיחה חדשה"
              >
                <RotateCcw className="w-5 h-5 text-[var(--muted)]" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Desktop: Steps Progress */}
          <div className="max-w-3xl mx-auto mt-3 px-2">
            {/* Progress Bar */}
            <div className="relative h-2 bg-neutral-100 rounded-full overflow-hidden mb-3">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            
            {/* Step Labels */}
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <motion.div
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center text-base transition-all shadow-sm",
                      currentStep > step.id
                        ? "bg-emerald-500 text-white shadow-emerald-200"
                        : currentStep === step.id
                        ? "bg-blue-500 text-white shadow-blue-200 ring-4 ring-blue-100"
                        : "bg-white text-neutral-400 border-2 border-neutral-200"
                    )}
                    initial={false}
                    animate={{
                      scale: currentStep === step.id ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentStep > step.id ? "✓" : step.icon}
                  </motion.div>
                  <span className={cn(
                    "text-[10px] mt-1.5 font-medium transition-colors",
                    currentStep === step.id ? "text-blue-600" : 
                    currentStep > step.id ? "text-emerald-600" : "text-neutral-400"
                  )}>
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPayment={processPayment}
        isProcessing={isProcessingPayment}
        agreedToTerms={agreedToTerms}
        setAgreedToTerms={setAgreedToTerms}
        couponCode={couponCode}
        setCouponCode={setCouponCode}
        couponLoading={couponLoading}
        couponError={couponError}
        appliedCoupon={appliedCoupon}
        onValidateCoupon={validateCoupon}
        onRemoveCoupon={() => {
          setAppliedCoupon(null);
          setCouponCode("");
        }}
        calculateFinalPrice={calculateFinalPrice}
      />

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        claimData={claimData}
        onClose={() => setShowPreview(false)}
        onPayment={() => {
          setShowPreview(false);
          setShowPaymentModal(true);
        }}
      />



      {/* Step 7 - Request Claim Generation */}
      {currentStep >= 7 && !claimData && !isLoading && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-3">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-700">סיימנו לאסוף את כל הפרטים!</span>
            </div>
            <button
              onClick={requestClaimGeneration}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              צור כתב תביעה 📄
            </button>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <main 
        className="flex-1 overflow-y-auto px-4 py-6"
        onClick={() => showMobileSteps && setShowMobileSteps(false)}
      >
        <div className="max-w-3xl mx-auto space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-start" : "justify-end"
                )}
              >
                {/* AI Avatar */}
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center flex-shrink-0 order-2 shadow-md">
                    <Scale className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3",
                    message.role === "user"
                      ? "bg-blue-600 text-white rounded-br-md shadow-md"
                      : "bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-200 order-1"
                  )}
                >
                  <div className="leading-relaxed text-[15px]">
                    {renderFormattedText(message.content)}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Payment Button - as part of chat */}
          {claimData && !showNextSteps && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3 my-4"
            >
              {/* Preview Button */}
              {!hasPaid && (
                <motion.button
                  onClick={() => setShowPreview(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2 underline-offset-2 hover:underline"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Eye className="w-4 h-4" />
                  <span>צפה בתצוגה מקדימה של כתב התביעה</span>
                </motion.button>
              )}
              
              {/* Payment/Download Button */}
              <motion.button
                onClick={handlePaymentAndDownload}
                className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center gap-3">
                  {hasPaid ? (
                    <>
                      <Download className="w-5 h-5" />
                      <span>הורד את כתב התביעה שוב</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>שלם והורד את כתב התביעה</span>
                      <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">₪79</span>
                    </>
                  )}
                </span>
              </motion.button>
            </motion.div>
          )}

          {/* Typing Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-end"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center flex-shrink-0 order-2 shadow-md">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-200 order-1">
                <div className="flex gap-1.5">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Quick Actions (only on welcome) */}
      {showWelcome && messages.length === 1 && (
        <div className="px-4 pb-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl p-3 sm:p-4 border border-blue-100">
              <p className="text-xs sm:text-sm text-neutral-600 mb-2 sm:mb-3 text-center">
                <span className="font-medium">💡 בחר נושא להתחלה מהירה</span>
                <span className="text-neutral-400 block text-[10px] sm:text-xs mt-0.5 sm:mt-1">או פשוט כתוב את הסיפור שלך בתיבת ההודעות</span>
              </p>
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {[
                  { text: "מוצר פגום", desc: "קנייה שנכשלה", icon: "🛒", color: "hover:border-orange-300 hover:bg-orange-50" },
                  { text: "שכירות", desc: "בעיות דיור", icon: "🏠", color: "hover:border-purple-300 hover:bg-purple-50" },
                  { text: "טיסה", desc: "ביטול/איחור", icon: "✈️", color: "hover:border-sky-300 hover:bg-sky-50" },
                  { text: "רכב", desc: "מוסך/ביטוח", icon: "🚗", color: "hover:border-emerald-300 hover:bg-emerald-50" },
                ].map((action) => (
                  <motion.button
                    key={action.text}
                    onClick={() => handleQuickAction(action.text)}
                    className={cn(
                      "p-2 sm:p-3 bg-white border border-neutral-200 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all group",
                      action.color
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex flex-col sm:flex-row items-center sm:gap-2">
                      <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform">{action.icon}</span>
                      <div className="text-center sm:text-right mt-1 sm:mt-0">
                        <div className="font-medium text-neutral-800 text-[10px] sm:text-sm leading-tight">{action.text}</div>
                        <div className="text-[8px] sm:text-xs text-neutral-400 hidden sm:block">{action.desc}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <footer className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4" role="form" aria-label="שדה הקלדת הודעה">
        {/* הצגת קבצים שהועלו */}
        {uploadedFiles.length > 0 && (
          <div className="max-w-3xl mx-auto mb-2">
            <div className="flex flex-wrap gap-2" role="list" aria-label="קבצים מצורפים">
              {uploadedFiles.map((file, idx) => (
                <div
                  key={idx}
                  role="listitem"
                  className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5 text-sm"
                >
                  <Paperclip className="w-3.5 h-3.5 text-gray-500" aria-hidden="true" />
                  <span className="text-gray-700">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}
                    className="text-gray-400 hover:text-gray-700"
                    aria-label={`הסר קובץ ${file.name}`}
                  >
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto"
          aria-label="טופס שליחת הודעה"
        >
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.pdf,.jpg,.jpeg,.png,.doc,.docx"
            className="hidden"
          />
          
          <div className="relative flex items-end gap-2 bg-white border border-gray-300 rounded-xl p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-sm">
            {/* כפתור העלאת קבצים */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || isLoading}
              className={cn(
                "p-3 rounded-lg transition-all duration-200 flex-shrink-0",
                "hover:bg-gray-100 text-gray-500 hover:text-gray-700",
                isUploading && "animate-pulse"
              )}
              title="העלה קובץ או שיחת WhatsApp"
            >
              {isUploading ? (
                <Upload className="w-5 h-5 animate-bounce" />
              ) : (
                <Paperclip className="w-5 h-5" />
              )}
            </button>
            
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => showMobileSteps && setShowMobileSteps(false)}
              placeholder="הקלד את תשובתך..."
              rows={1}
              disabled={isLoading}
              aria-label="הקלד את תשובתך"
              aria-describedby="chat-disclaimer"
              className="flex-1 bg-transparent resize-none outline-none px-3 py-2 max-h-32 text-base placeholder:text-gray-400 text-gray-800 leading-normal"
              style={{
                fontSize: "16px", // Prevents iOS zoom on focus
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label={isLoading ? "שולח הודעה..." : "שלח הודעה"}
              className={cn(
                "p-3 rounded-lg transition-all duration-200",
                input.trim() && !isLoading
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="w-5 h-5 rotate-180" aria-hidden="true" />
              )}
            </button>
          </div>
          <div className="flex justify-between items-center mt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
              aria-label="העלה שיחת WhatsApp כראיה לתביעה"
            >
              <MessageSquare className="w-3 h-3" aria-hidden="true" />
              העלה שיחת WhatsApp כראיה
            </button>
            <p id="chat-disclaimer" className="text-[11px] text-gray-400">
              מערכת זו אינה מהווה תחליף לייעוץ משפטי מקצועי
            </p>
          </div>
        </form>
      </footer>
    </div>
  );
}
