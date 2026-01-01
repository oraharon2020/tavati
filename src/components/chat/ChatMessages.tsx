"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, CreditCard, Download, Eye, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "./types";
import { ClaimData } from "@/lib/pdfGenerator";
import { QuickReplyButtons, parseQuickReplies } from "./QuickReplyButtons";
import { ChatInlineForm, parseInlineForm, FormType } from "./ChatInlineForm";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  claimData: ClaimData | null;
  hasPaid: boolean;
  showNextSteps: boolean;
  onShowPreview: () => void;
  onPaymentAndDownload: () => void;
  onSendMessage?: (text: string) => void;
}

// עיבוד והצגת הודעות - מסיר גם BUTTONS ו-FORM תגים
const formatMessage = (content: string) => {
  // הסתר JSON blocks - גם אלה שעדיין נכתבים (streaming)
  let formatted = content.replace(/```json[\s\S]*?(```|$)/g, "");
  // הסתר גם אם יש JSON בלי backticks
  formatted = formatted.replace(/\{\s*"status"\s*:\s*"complete"[\s\S]*/g, "");
  // הסתר כל דבר שמתחיל ב-{ ונראה כמו JSON
  formatted = formatted.replace(/\{\s*"\s*[\s\S]*$/g, "");
  // הסתר תגי BUTTONS ו-FORM
  formatted = formatted.replace(/\[BUTTONS:[^\]]+\]/g, "");
  formatted = formatted.replace(/\[FORM:\s*\w+\]/g, "");
  // נקה רווחים מיותרים
  formatted = formatted.replace(/\n{3,}/g, "\n\n").trim();
  // אם נשאר רק טקסט קצר אחרי הסרת JSON, הוסף הודעה
  if (formatted.length < 20 && content.includes('"status": "complete"')) {
    return "התביעה מוכנה! לחץ על \"הורד כתב תביעה\" למעלה.";
  }
  return formatted;
};

// רנדור טקסט עם markdown פשוט (בולד, קו מפריד, לינקים)
const renderFormattedText = (text: string) => {
  const formatted = formatMessage(text);
  
  // פיצול לפי שורות
  const lines = formatted.split("\n");
  
  return lines.map((line, lineIndex) => {
    // קו מפריד
    if (line.trim() === "---") {
      return <hr key={lineIndex} className="my-3 border-[var(--border)]" />;
    }
    
    // עיבוד לינקים [text](url) ובולד **text**
    const processLine = (text: string): React.ReactNode[] => {
      const result: React.ReactNode[] = [];
      let remaining = text;
      let keyIndex = 0;
      
      while (remaining.length > 0) {
        // חפש לינק [text](url) - גמיש יותר
        const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)\s]+)\)/);
        // חפש בולד **text**
        const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
        
        // מצא מה קודם
        const linkIndex = linkMatch ? remaining.indexOf(linkMatch[0]) : Infinity;
        const boldIndex = boldMatch ? remaining.indexOf(boldMatch[0]) : Infinity;
        
        if (linkIndex === Infinity && boldIndex === Infinity) {
          // אין יותר תבניות, הוסף את השאר
          result.push(remaining);
          break;
        }
        
        if (linkIndex < boldIndex) {
          // לינק קודם
          if (linkIndex > 0) {
            result.push(remaining.slice(0, linkIndex));
          }
          result.push(
            <a
              key={`link-${keyIndex++}`}
              href={linkMatch![2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {linkMatch![1]}
            </a>
          );
          remaining = remaining.slice(linkIndex + linkMatch![0].length);
        } else {
          // בולד קודם
          if (boldIndex > 0) {
            result.push(remaining.slice(0, boldIndex));
          }
          result.push(
            <strong key={`bold-${keyIndex++}`} className="font-bold">
              {boldMatch![1]}
            </strong>
          );
          remaining = remaining.slice(boldIndex + boldMatch![0].length);
        }
      }
      
      return result;
    };
    
    return (
      <span key={lineIndex}>
        {processLine(line)}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    );
  });
};

export function ChatMessages({
  messages,
  isLoading,
  claimData,
  hasPaid,
  showNextSteps,
  onShowPreview,
  onPaymentAndDownload,
  onSendMessage,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [answeredButtons, setAnsweredButtons] = useState<Set<string>>(new Set());
  const [answeredForms, setAnsweredForms] = useState<Set<string>>(new Set());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
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
            <div className="flex flex-col max-w-[80%] order-1">
              <div
                className={cn(
                  "rounded-2xl px-4 py-3",
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-br-md shadow-md"
                    : "bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-200"
                )}
              >
                <div className="leading-relaxed text-[15px]">
                  {renderFormattedText(message.content)}
                </div>
              </div>
              
              {/* Quick Reply Buttons - only for last assistant message */}
              {message.role === "assistant" && 
               message.id === messages.filter(m => m.role === "assistant").slice(-1)[0]?.id &&
               !answeredButtons.has(message.id) &&
               !isLoading &&
               onSendMessage && (() => {
                const { buttons } = parseQuickReplies(message.content);
                if (buttons && buttons.length > 0) {
                  return (
                    <QuickReplyButtons
                      options={buttons}
                      onSelect={(value) => {
                        setAnsweredButtons(prev => new Set([...prev, message.id]));
                        onSendMessage(value);
                      }}
                      disabled={isLoading}
                    />
                  );
                }
                return null;
              })()}
              
              {/* Inline Form - only for last assistant message */}
              {message.role === "assistant" && 
               message.id === messages.filter(m => m.role === "assistant").slice(-1)[0]?.id &&
               !answeredForms.has(message.id) &&
               !isLoading &&
               onSendMessage && (() => {
                const { formType } = parseInlineForm(message.content);
                if (formType) {
                  return (
                    <ChatInlineForm
                      formType={formType}
                      onSubmit={(data) => {
                        setAnsweredForms(prev => new Set([...prev, message.id]));
                        onSendMessage(data.text);
                      }}
                      disabled={isLoading}
                    />
                  );
                }
                return null;
              })()}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Payment Button - as part of chat (only show if not paid and not on next steps) */}
      {claimData && !showNextSteps && !hasPaid && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3 my-4"
        >
          {/* Preview Button */}
          {!hasPaid && (
            <motion.button
              onClick={onShowPreview}
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
            onClick={onPaymentAndDownload}
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
  );
}
