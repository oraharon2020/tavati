"use client";

import { motion } from "framer-motion";
import { Car, CheckCircle2, Download, Plus, Mail, Send } from "lucide-react";
import { ClaimData } from "@/lib/pdfGenerator";
import { Attachment } from "./types";

interface ParkingNextStepsScreenProps {
  claimData: ClaimData;
  attachments: Attachment[];
  onGeneratePDF: () => void;
  onShowAttachments: () => void;
  onReset: () => void;
}

export function ParkingNextStepsScreen({
  claimData,
  attachments,
  onGeneratePDF,
  onShowAttachments,
  onReset,
}: ParkingNextStepsScreenProps) {
  // Extract parking data
  const ticket = (claimData as { ticket?: { authority?: string; ticketNumber?: string; amount?: number } }).ticket;
  const authority = ticket?.authority || "הרשות המקומית";

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">תבעתי</h1>
              <p className="text-xs text-gray-500">ערעור דוח חניה</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm bg-green-100 rounded-full px-3 py-1.5">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-green-700">שולם</span>
          </div>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">מעולה! הערעור מוכן 🎉</h1>
          <p className="text-gray-500">עכשיו נשאר רק לשלוח לרשות</p>
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-8">
          {/* Step 1: הורד את הערעור */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-500" />
                  הורד את מכתב הערעור
                </h3>
                <p className="text-sm text-gray-500 mb-3">קובץ PDF מוכן לשליחה</p>
                <button
                  onClick={onGeneratePDF}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-md"
                >
                  <Download className="w-4 h-4" />
                  הורד מכתב ערעור
                </button>
              </div>
            </div>
          </motion.div>

          {/* Step 2: שלח לרשות */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Send className="w-4 h-4 text-blue-500" />
                  שלח את הערעור ל{authority}
                </h3>
                <p className="text-sm text-gray-500 mb-3">אפשרויות שליחה:</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>שלח במייל לרשות (מומלץ)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-gray-400">📠</span>
                    <span>שלח בפקס</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-gray-400">📬</span>
                    <span>שלח בדואר רשום</span>
                  </div>
                </div>
                
                {/* הערה */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                  <p className="text-sm text-amber-800 flex items-center gap-2">
                    <span>⚠️</span>
                    <span><strong>חשוב:</strong> שמור אישור שליחה (צילום מסך/אישור דואר)</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 3: המתן לתשובה */}
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
                <h3 className="font-bold text-gray-900 mb-2">⏰ המתן לתשובה</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center">📅</span>
                    הרשות חייבת להשיב תוך 30 יום
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center">✅</span>
                    אם לא ענו - הערעור התקבל!
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center">❌</span>
                    אם נדחה - אפשר לפנות לבימ"ש
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
          className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-5 mb-6"
        >
          <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
            <span className="text-xl">💡</span>
            טיפים חשובים
          </h4>
          <ul className="text-sm text-emerald-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              שמור עותק של הערעור והראיות
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              תעד את תאריך השליחה
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              אל תשלם את הקנס לפני קבלת תשובה!
            </li>
          </ul>
        </motion.div>

        {/* Actions */}
        <div className="flex flex-col gap-3 mb-4">
          {/* Primary: Download PDF again */}
          <button
            onClick={onGeneratePDF}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:opacity-90 transition-all font-semibold shadow-lg shadow-emerald-500/20"
          >
            <Download className="w-5 h-5" />
            הורד שוב את מכתב הערעור
          </button>
          
          {/* Secondary: Add Attachments */}
          <button
            onClick={onShowAttachments}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors text-gray-700 font-medium"
          >
            <Plus className="w-5 h-5" />
            הוסף נספחים (צילומי מסך, תמונות)
            {attachments.length > 0 && (
              <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full">
                {attachments.length}
              </span>
            )}
          </button>
        </div>

        {/* Bottom Links */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4 justify-center">
          <button
            onClick={onReset}
            className="text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            התחל ערעור חדש
          </button>
          <span className="hidden sm:inline text-gray-300">|</span>
          <a
            href="/"
            className="text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            חזרה לדף הבית
          </a>
        </div>
      </div>
    </div>
  );
}
