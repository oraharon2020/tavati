"use client";

import { useRef, useState, useCallback } from "react";
import { Attachment, UploadedFile } from "../types";

interface UseFileUploadProps {
  currentSessionId: string | null;
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  setAttachments: React.Dispatch<React.SetStateAction<Attachment[]>>;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}

interface UseFileUploadReturn {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  attachmentInputRef: React.RefObject<HTMLInputElement | null>;
  isUploading: boolean;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleAttachmentUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export function useFileUpload({
  currentSessionId,
  setUploadedFiles,
  setAttachments,
  setInput,
}: UseFileUploadProps): UseFileUploadReturn {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // העלאת נספחים
  const handleAttachmentUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, [currentSessionId, setAttachments]);

  // העלאת קובץ
  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, [currentSessionId, setUploadedFiles, setInput]);

  return {
    fileInputRef,
    attachmentInputRef,
    isUploading,
    handleFileUpload,
    handleAttachmentUpload,
  };
}
