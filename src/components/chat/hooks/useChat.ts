"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Message, UploadedFile } from "../types";
import { ClaimData } from "@/lib/pdfGenerator";
import { ServiceType } from "@/lib/services";

interface UseChatProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setShowWelcome: React.Dispatch<React.SetStateAction<boolean>>;
  saveToSession: (newMessages: Message[], step?: number, claimData?: ClaimData | null) => Promise<void>;
  uploadedFiles: UploadedFile[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  claimData: ClaimData | null;
  serviceType?: ServiceType;
  maxSteps?: number;
}

interface UseChatReturn {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  currentStep: number;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  handleSendMessage: (text?: string) => Promise<void>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleQuickAction: (text: string) => void;
  requestClaimGeneration: () => Promise<void>;
  extractClaimData: (content: string) => ClaimData | null;
}

export function useChat({
  messages,
  setMessages,
  setShowWelcome,
  saveToSession,
  uploadedFiles,
  setUploadedFiles,
  claimData,
  serviceType = 'claims',
  maxSteps = 8,
}: UseChatProps): UseChatReturn {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // זיהוי השלב הנוכחי מההודעות
  const currentStep = useMemo(() => {
    const lastAssistantMessage = [...messages].reverse().find(m => m.role === "assistant");
    if (!lastAssistantMessage) return 1;
    
    const match = lastAssistantMessage.content.match(/שלב\s*(\d)/);
    return match ? Math.min(parseInt(match[1]), maxSteps) : 1;
  }, [messages, maxSteps]);

  // זיהוי אם התביעה/ערעור מוכן (יש JSON בהודעה)
  const extractClaimData = useCallback((content: string): ClaimData | null => {
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.status === "complete") {
          // תמיכה גם ב-claimData וגם ב-parkingAppealData
          return parsed.claimData || parsed.parkingAppealData || null;
        }
      } catch (e) {
        console.error("Failed to parse claim data:", e);
      }
    }
    return null;
  }, []);

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
        body: JSON.stringify({ messages: messagesToSend, serviceType }),
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
  }, [input, isLoading, messages, setMessages, setShowWelcome, saveToSession, currentStep, claimData, uploadedFiles, setUploadedFiles]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  // פונקציה לשליחת הודעה ישירה (עבור כפתורים וטפסים)
  const handleSendMessage = useCallback(async (text?: string) => {
    const messageText = text;
    if (!messageText?.trim() || isLoading) return;
    
    // שלח ישירות בלי לעבור דרך ה-input
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setShowWelcome(false);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
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
  }, [isLoading, messages, setMessages, setShowWelcome, saveToSession, currentStep, claimData]);

  const handleQuickAction = useCallback((text: string) => {
    setInput(text);
    setTimeout(() => handleSubmit(), 100);
  }, [handleSubmit]);

  // בקש מה-AI ליצור את ה-JSON כשהמשתמש לוחץ על כפתור
  const requestClaimGeneration = useCallback(async () => {
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
  }, [isLoading, messages, setMessages]);

  return {
    input,
    setInput,
    isLoading,
    currentStep,
    handleSubmit,
    handleSendMessage,
    handleKeyDown,
    handleQuickAction,
    requestClaimGeneration,
    extractClaimData,
  };
}
