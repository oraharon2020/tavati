"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Scale, CheckCircle2, MapPin, FileCheck, Download, Plus } from "lucide-react";
import { ClaimData } from "@/lib/pdfGenerator";
import { findCourtByCity, calculateFee } from "@/lib/types";
import { Attachment } from "./types";

interface NextStepsScreenProps {
  claimData: ClaimData;
  attachments: Attachment[];
  onGeneratePDF: () => void;
  onShowAttachments: () => void;
  onBackToChat: () => void;
  onReset: () => void;
}

export function NextStepsScreen({
  claimData,
  attachments,
  onGeneratePDF,
  onShowAttachments,
  onBackToChat,
  onReset,
}: NextStepsScreenProps) {
  // חישוב פרטי בית המשפט והאגרה
  const courtInfo = useMemo(() => {
    const court = findCourtByCity(claimData.defendant.city);
    const fee = calculateFee(claimData.claim.amount);
    return { court, fee };
  }, [claimData]);

  const court = courtInfo.court;
  if (!court) return null;

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
            onClick={onBackToChat}
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
            onClick={onGeneratePDF}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-xl hover:opacity-90 transition-all font-semibold shadow-lg shadow-blue-500/20"
          >
            <Download className="w-5 h-5" />
            הורד שוב את כתב התביעה
          </button>
          
          {/* Secondary: Add Attachments */}
          <button
            onClick={onShowAttachments}
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
          onClick={onReset}
          className="w-full mt-4 text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          התחל תביעה חדשה
        </button>
      </div>
    </div>
  );
}
