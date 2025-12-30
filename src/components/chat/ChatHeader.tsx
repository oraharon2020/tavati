"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Scale, RotateCcw, Home } from "lucide-react";
import { Step } from "./types";
import { STEPS } from "./constants";

interface ChatHeaderProps {
  currentStep: number;
  onReset: () => void;
}

export default function ChatHeader({ currentStep, onReset }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3 shadow-sm">
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
            onClick={onReset}
            className="p-2.5 rounded-lg hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            title="התחל מחדש"
            aria-label="התחל שיחה חדשה"
          >
            <RotateCcw className="w-5 h-5 text-neutral-400" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Steps Progress - Compact on Mobile */}
      <div className="max-w-3xl mx-auto mt-3 px-2">
        {/* Mobile: Compact single line */}
        <div className="sm:hidden">
          <div className="flex items-center gap-3 bg-neutral-50 rounded-xl p-2.5">
            {/* Progress circle */}
            <div className="relative w-10 h-10 flex-shrink-0">
              <svg className="w-10 h-10 -rotate-90">
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <motion.circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 100" }}
                  animate={{ 
                    strokeDasharray: `${(currentStep / STEPS.length) * 100} 100`
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600">{currentStep}/{STEPS.length}</span>
              </div>
            </div>
            
            {/* Current step info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-lg">{STEPS[currentStep - 1]?.icon}</span>
                <span className="font-semibold text-neutral-900 text-sm">{STEPS[currentStep - 1]?.name}</span>
              </div>
              <p className="text-xs text-neutral-500 truncate">
                {currentStep < STEPS.length ? `הבא: ${STEPS[currentStep]?.name}` : "שלב אחרון! 🎉"}
              </p>
            </div>
          </div>
        </div>
        
        {/* Desktop: Full step display */}
        <div className="hidden sm:block">
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
            {STEPS.map((step) => (
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
  );
}
