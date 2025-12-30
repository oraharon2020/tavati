"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface QuickReplyOption {
  text: string;
  value: string;
  icon?: string;
}

interface QuickReplyButtonsProps {
  options: QuickReplyOption[];
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export function QuickReplyButtons({ options, onSelect, disabled }: QuickReplyButtonsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 justify-end my-2"
    >
      {options.map((option, index) => (
        <motion.button
          key={option.value}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => !disabled && onSelect(option.value)}
          disabled={disabled}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all",
            "bg-white border-2 border-blue-200 text-blue-700",
            "hover:bg-blue-50 hover:border-blue-400 hover:shadow-md",
            "active:scale-95",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          whileHover={!disabled ? { scale: 1.02 } : undefined}
          whileTap={!disabled ? { scale: 0.98 } : undefined}
        >
          {option.icon && <span className="ml-1">{option.icon}</span>}
          {option.text}
        </motion.button>
      ))}
    </motion.div>
  );
}

// פרסור כפתורים מתגובת AI
// פורמט: [BUTTONS: טקסט1|טקסט2|טקסט3] או [BUTTONS: טקסט1:ערך1|טקסט2:ערך2]
export function parseQuickReplies(content: string): { 
  cleanContent: string; 
  buttons: QuickReplyOption[] | null;
} {
  const buttonMatch = content.match(/\[BUTTONS:\s*([^\]]+)\]/);
  
  if (!buttonMatch) {
    return { cleanContent: content, buttons: null };
  }
  
  const cleanContent = content.replace(/\[BUTTONS:[^\]]+\]/g, '').trim();
  const buttonParts = buttonMatch[1].split('|').map(b => b.trim());
  
  const buttons: QuickReplyOption[] = buttonParts.map(part => {
    // בדוק אם יש אייקון בתחילה (emoji)
    const emojiMatch = part.match(/^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])\s*/u);
    let icon: string | undefined;
    let text = part;
    
    if (emojiMatch) {
      icon = emojiMatch[1];
      text = part.slice(emojiMatch[0].length);
    }
    
    // בדוק אם יש ערך נפרד (טקסט:ערך)
    if (text.includes(':')) {
      const [displayText, value] = text.split(':').map(s => s.trim());
      return { text: displayText, value, icon };
    }
    
    return { text, value: text, icon };
  });
  
  return { cleanContent, buttons };
}
