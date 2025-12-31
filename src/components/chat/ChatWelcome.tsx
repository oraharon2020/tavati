"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ServiceType } from "@/lib/services";

interface ChatWelcomeProps {
  onQuickAction: (text: string) => void;
  serviceType?: ServiceType;
}

// Quick actions לתביעות קטנות
const CLAIMS_QUICK_ACTIONS = [
  { text: "מוצר פגום", desc: "קנייה שנכשלה", icon: "🛒", color: "hover:border-orange-300 hover:bg-orange-50" },
  { text: "שכירות", desc: "בעיות דיור", icon: "🏠", color: "hover:border-purple-300 hover:bg-purple-50" },
  { text: "טיסה", desc: "ביטול/איחור", icon: "✈️", color: "hover:border-sky-300 hover:bg-sky-50" },
  { text: "רכב", desc: "מוסך/ביטוח", icon: "🚗", color: "hover:border-emerald-300 hover:bg-emerald-50" },
];

// Quick actions לערעור חניה
const PARKING_QUICK_ACTIONS = [
  { text: "שילוט חסר", desc: "לא היה שלט", icon: "🚫", color: "hover:border-red-300 hover:bg-red-50" },
  { text: "פרקומט תקול", desc: "המכשיר לא עבד", icon: "🅿️", color: "hover:border-blue-300 hover:bg-blue-50" },
  { text: "היתר נכים", desc: "יש לי תג נכה", icon: "♿", color: "hover:border-purple-300 hover:bg-purple-50" },
  { text: "נסיבות חירום", desc: "מצב רפואי/חירום", icon: "🚑", color: "hover:border-emerald-300 hover:bg-emerald-50" },
];

export function ChatWelcome({ onQuickAction, serviceType = 'claims' }: ChatWelcomeProps) {
  const isParking = serviceType === 'parking';
  const quickActions = isParking ? PARKING_QUICK_ACTIONS : CLAIMS_QUICK_ACTIONS;
  const title = isParking ? "💡 בחר סיבת ערעור להתחלה מהירה" : "💡 בחר נושא להתחלה מהירה";
  const subtitle = isParking 
    ? "או פשוט תאר את המקרה שלך בתיבת ההודעות"
    : "או פשוט כתוב את הסיפור שלך בתיבת ההודעות";
  const gradientColors = isParking 
    ? "from-emerald-50 to-teal-50 border-emerald-100"
    : "from-blue-50 to-emerald-50 border-blue-100";

  return (
    <div className="px-4 pb-4">
      <div className="max-w-3xl mx-auto">
        <div className={cn("bg-gradient-to-br rounded-2xl p-3 sm:p-4 border", gradientColors)}>
          <p className="text-xs sm:text-sm text-neutral-600 mb-2 sm:mb-3 text-center">
            <span className="font-medium">{title}</span>
            <span className="text-neutral-400 block text-[10px] sm:text-xs mt-0.5 sm:mt-1">{subtitle}</span>
          </p>
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {quickActions.map((action) => (
              <motion.button
                key={action.text}
                onClick={() => onQuickAction(action.text)}
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
  );
}
