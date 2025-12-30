"use client";

import { useRef, useEffect } from "react";
import { Send, Loader2, Paperclip, Upload, X, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { UploadedFile } from "./types";

interface ChatInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  uploadedFiles: UploadedFile[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  isUploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onSubmit: (e?: React.FormEvent) => Promise<void>;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onCloseMobileSteps?: () => void;
}

export function ChatInput({
  input,
  setInput,
  isLoading,
  uploadedFiles,
  setUploadedFiles,
  isUploading,
  fileInputRef,
  onSubmit,
  onKeyDown,
  onCloseMobileSteps,
}: ChatInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  return (
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
        onSubmit={onSubmit}
        className="max-w-3xl mx-auto"
        aria-label="טופס שליחת הודעה"
      >
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
            onKeyDown={onKeyDown}
            onFocus={onCloseMobileSteps}
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
  );
}
