"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Eye, X, CreditCard, Shield } from "lucide-react";
import { ClaimData } from "@/lib/pdfGenerator";
import { findCourtByCity } from "@/lib/types";
import { BASE_PRICE } from "./constants";

interface PreviewModalProps {
  isOpen: boolean;
  claimData: ClaimData | null;
  onClose: () => void;
  onPayment: () => void;
}

export default function PreviewModal({
  isOpen,
  claimData,
  onClose,
  onPayment,
}: PreviewModalProps) {
  if (!claimData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Preview Header */}
            <div className="bg-gradient-to-r from-blue-600 to-emerald-500 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-white">
                <Eye className="w-5 h-5" />
                <span className="font-semibold">תצוגה מקדימה</span>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Content - Non-selectable */}
            <div 
              className="flex-1 overflow-y-auto p-4 bg-neutral-100 relative"
              style={{ 
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
              }}
              onCopy={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
              onContextMenu={(e) => e.preventDefault()}
            >
              {/* Document Preview - Exact PDF replica */}
              <div className="bg-white shadow-lg mx-auto max-w-[600px] p-8 relative text-[12px] leading-[1.7] text-black" style={{ fontFamily: 'David, "Times New Roman", serif', color: '#000' }}>
                
                {/* Subtle Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                  <div className="text-[60px] font-bold text-neutral-200 rotate-[-45deg] whitespace-nowrap">
                    תצוגה מקדימה
                  </div>
                </div>

                {/* All content relative to watermark */}
                <div className="relative z-10 text-black">
                  {/* Header */}
                  <div className="text-center border-b-2 border-black pb-3 mb-5">
                    <div className="text-[11px] font-bold mb-1 text-black">מדינת ישראל</div>
                    <div className="text-[11px] font-bold mb-2 text-black">הרשות השופטת</div>
                    <div className="text-[15px] font-bold mb-1 text-black">
                      {findCourtByCity(claimData.defendant?.city || claimData.plaintiff?.city || "")?.name || "בית משפט לתביעות קטנות"}
                    </div>
                    <div className="text-[9px] text-neutral-600">
                      {findCourtByCity(claimData.defendant?.city || claimData.plaintiff?.city || "")?.address || ""}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="text-left text-[11px] text-black mb-4">
                    תאריך: {new Date().toLocaleDateString("he-IL")}
                  </div>

                  {/* Parties Section */}
                  <div className="mb-5 text-black">
                    <div className="flex mb-3">
                      <div className="font-bold min-w-[60px] text-[12px]">התובע:</div>
                      <div className="flex-1">
                        <div className="font-bold">{claimData.plaintiff?.fullName}</div>
                        <div>ת.ז. {claimData.plaintiff?.idNumber}</div>
                        <div>{claimData.plaintiff?.address}, {claimData.plaintiff?.city} {claimData.plaintiff?.zipCode}</div>
                        <div>טל': {claimData.plaintiff?.phone} | דוא"ל: {claimData.plaintiff?.email}</div>
                      </div>
                    </div>

                    <div className="text-center font-bold text-[12px] my-3">- נ ג ד -</div>

                    <div className="flex">
                      <div className="font-bold min-w-[60px] text-[12px]">הנתבע:</div>
                      <div className="flex-1">
                        <div className="font-bold">{claimData.defendant?.name}</div>
                        <div>{claimData.defendant?.type === "company" ? "ח.פ." : claimData.defendant?.type === "business" ? "ע.מ." : "ת.ז."} {claimData.defendant?.idOrCompanyNumber}</div>
                        <div>{claimData.defendant?.address}, {claimData.defendant?.city} {claimData.defendant?.zipCode}</div>
                        {claimData.defendant?.phone && <div>טל': {claimData.defendant?.phone}</div>}
                      </div>
                    </div>
                  </div>

                  {/* Main Title */}
                  <div className="text-center text-[16px] font-bold underline mb-5 text-black">כתב תביעה</div>

                  {/* Amount */}
                  <div className="text-center font-bold mb-5 text-[13px] text-black">
                    סכום התביעה: {claimData.claim?.amount?.toLocaleString("he-IL")} ₪
                  </div>

                  {/* Section A - Intro - FULL */}
                  <div className="mb-4 text-black">
                    <div className="font-bold underline mb-2 text-[12px]">א. מבוא</div>
                    <p className="pr-5 mb-1.5" style={{ textIndent: '-20px', paddingRight: '20px', color: '#000' }}>
                      1. התובע מגיש בזאת תביעה כספית כנגד הנתבע, לתשלום סך של {claimData.claim?.amount?.toLocaleString("he-IL")} ₪.
                    </p>
                    <p className="pr-5 mb-1.5" style={{ textIndent: '-20px', paddingRight: '20px', color: '#000' }}>
                      2. לבית משפט נכבד זה סמכות עניינית לדון בתביעה, מכוח סעיף 60 לחוק בתי המשפט [נוסח משולב], התשמ"ד-1984, שכן סכום התביעה אינו עולה על 38,900 ₪.
                    </p>
                    <p className="pr-5 mb-1.5" style={{ textIndent: '-20px', paddingRight: '20px', color: '#000' }}>
                      3. לבית משפט נכבד זה סמכות מקומית לדון בתביעה, שכן מקום מושבו של הנתבע הוא בתחום שיפוטו של בית משפט זה.
                    </p>
                  </div>

                  {/* Section B - Facts - FULL */}
                  <div className="mb-4 text-black">
                    <div className="font-bold underline mb-2 text-[12px]">ב. העובדות</div>
                    <p className="pr-5 mb-1.5" style={{ textIndent: '-20px', paddingRight: '20px', color: '#000' }}>
                      4. ביום {claimData.claim?.date} התקיימו בין הצדדים יחסים עסקיים/משפטיים כמפורט להלן.
                    </p>
                    <p className="pr-5 mb-1.5" style={{ textIndent: '-20px', paddingRight: '20px', color: '#000' }}>
                      5. {claimData.claim?.description}
                    </p>
                  </div>

                  {/* LOCKED SECTION - More content hidden */}
                  <div className="relative mt-4">
                    {/* Semi-visible blurred content */}
                    <div className="filter blur-[3px] opacity-40 text-neutral-500">
                      <div className="mb-3">
                        <div className="font-bold underline mb-2 text-[12px]">ג. הנזק</div>
                        <p className="pr-5 mb-1.5 text-[11px]" style={{ textIndent: '-20px', paddingRight: '20px' }}>
                          6. כתוצאה ממעשי ו/או מחדלי הנתבע, נגרם לתובע נזק כספי בסך של {claimData.claim?.amount?.toLocaleString("he-IL")} ₪.
                        </p>
                      </div>
                      <div className="mb-3">
                        <div className="font-bold underline mb-2 text-[12px]">ד. הבסיס המשפטי</div>
                        <div className="border border-neutral-300 p-2 mb-2 bg-neutral-50 text-[11px]">
                          <strong>עילת התביעה מבוססת על:</strong> חוק הגנת הצרכן / חוק החוזים
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="font-bold underline mb-2 text-[12px]">ה. הסעד המבוקש</div>
                        <p className="text-[11px]">לאור כל האמור לעיל, מתבקש בית המשפט הנכבד לחייב את הנתבע...</p>
                      </div>
                      <div className="mb-3">
                        <div className="font-bold underline mb-2 text-[12px]">ו. הצהרת התובע</div>
                        <p className="text-[11px]">אני החתום מטה מצהיר כי כל העובדות המפורטות...</p>
                      </div>
                    </div>

                    {/* Lock overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/95 px-5 py-4 rounded-xl border border-amber-300 shadow-lg text-center">
                        <Shield className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                        <div className="font-bold text-neutral-700 text-sm">המשך המסמך נעול</div>
                        <div className="text-xs text-neutral-500 mt-1">פירוט הנזק, בסיס משפטי, הצהרות וחתימה</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Footer */}
            <div className="border-t border-neutral-200 p-4 bg-neutral-50">
              <button
                onClick={onPayment}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                שלם ₪{BASE_PRICE} וקבל את המסמך המלא
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
