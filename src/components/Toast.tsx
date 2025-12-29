"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showSuccess: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: {
    bg: "bg-green-50 border-green-200",
    icon: "text-green-500",
    title: "text-green-800",
    message: "text-green-600",
  },
  error: {
    bg: "bg-red-50 border-red-200",
    icon: "text-red-500",
    title: "text-red-800",
    message: "text-red-600",
  },
  warning: {
    bg: "bg-yellow-50 border-yellow-200",
    icon: "text-yellow-500",
    title: "text-yellow-800",
    message: "text-yellow-600",
  },
  info: {
    bg: "bg-blue-50 border-blue-200",
    icon: "text-blue-500",
    title: "text-blue-800",
    message: "text-blue-600",
  },
};

// Error messages in Hebrew with friendly explanations
export const errorMessages: Record<string, { title: string; message: string }> = {
  // Network errors
  "network_error": {
    title: "בעיית חיבור",
    message: "נראה שיש בעיה בחיבור לאינטרנט. בדקו את החיבור ונסו שוב.",
  },
  "timeout": {
    title: "הבקשה ארכה יותר מדי",
    message: "השרת לא הגיב בזמן. נסו שוב בעוד כמה שניות.",
  },
  
  // Auth errors
  "invalid_otp": {
    title: "קוד שגוי",
    message: "הקוד שהזנתם לא תקין. בדקו את ה-SMS ונסו שוב.",
  },
  "otp_expired": {
    title: "הקוד פג תוקף",
    message: "הקוד כבר לא בתוקף. לחצו על \"שלח שוב\" לקבלת קוד חדש.",
  },
  "too_many_attempts": {
    title: "יותר מדי ניסיונות",
    message: "חכו כמה דקות לפני שתנסו שוב.",
  },
  
  // Upload errors
  "file_too_large": {
    title: "הקובץ גדול מדי",
    message: "גודל הקובץ המקסימלי הוא 5MB. נסו לדחוס את הקובץ או לבחור קובץ קטן יותר.",
  },
  "invalid_file_type": {
    title: "סוג קובץ לא נתמך",
    message: "אפשר להעלות תמונות (JPG, PNG) או קבצי PDF בלבד.",
  },
  "upload_failed": {
    title: "העלאה נכשלה",
    message: "לא הצלחנו להעלות את הקובץ. נסו שוב.",
  },
  
  // Chat errors
  "chat_error": {
    title: "משהו השתבש",
    message: "לא הצלחנו לשלוח את ההודעה. נסו שוב.",
  },
  "session_expired": {
    title: "הפגישה הסתיימה",
    message: "אנא התחברו מחדש כדי להמשיך.",
  },
  
  // Payment errors
  "payment_failed": {
    title: "התשלום נכשל",
    message: "בדקו את פרטי הכרטיס ונסו שוב.",
  },
  "payment_declined": {
    title: "הכרטיס נדחה",
    message: "פנו לבנק או נסו כרטיס אחר.",
  },
  
  // General
  "unknown_error": {
    title: "שגיאה לא צפויה",
    message: "משהו השתבש. אם הבעיה חוזרת, פנו לתמיכה בווטסאפ.",
  },
};

export function getErrorMessage(errorCode: string): { title: string; message: string } {
  return errorMessages[errorCode] || errorMessages["unknown_error"];
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => removeToast(id), 5000);
  }, [removeToast]);

  const showError = useCallback((title: string, message?: string) => {
    showToast("error", title, message);
  }, [showToast]);

  const showSuccess = useCallback((title: string, message?: string) => {
    showToast("success", title, message);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showError, showSuccess }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[100] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = icons[toast.type];
            const color = colors[toast.type];
            
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className={`${color.bg} border rounded-xl p-4 shadow-lg flex gap-3`}
              >
                <Icon className={`w-5 h-5 ${color.icon} flex-shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold ${color.title}`}>{toast.title}</h4>
                  {toast.message && (
                    <p className={`text-sm ${color.message} mt-0.5`}>{toast.message}</p>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className={`${color.icon} hover:opacity-70 flex-shrink-0`}
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
