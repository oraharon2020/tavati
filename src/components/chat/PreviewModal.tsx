"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Eye, X, CreditCard, Shield } from "lucide-react";
import { ClaimData } from "@/lib/pdfGenerator";
import { findCourtByCity } from "@/lib/types";
import { ServiceType } from "@/lib/services";
import { PRICES } from "@/lib/prices";

interface PreviewModalProps {
  isOpen: boolean;
  claimData: ClaimData | null;
  onClose: () => void;
  onPayment: () => void;
  serviceType?: ServiceType;
  price?: number;
}

// תוכן תצוגה מקדימה לתביעות קטנות
function ClaimsPreviewContent({ claimData }: { claimData: ClaimData }) {
  return (
    <>
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
            <div>טל&apos;: {claimData.plaintiff?.phone} | דוא&quot;ל: {claimData.plaintiff?.email}</div>
          </div>
        </div>

        <div className="text-center font-bold text-[12px] my-3">- נ ג ד -</div>

        <div className="flex">
          <div className="font-bold min-w-[60px] text-[12px]">הנתבע:</div>
          <div className="flex-1">
            <div className="font-bold">{claimData.defendant?.name}</div>
            <div>{claimData.defendant?.type === "company" ? "ח.פ." : claimData.defendant?.type === "business" ? "ע.מ." : "ת.ז."} {claimData.defendant?.idOrCompanyNumber}</div>
            <div>{claimData.defendant?.address}, {claimData.defendant?.city} {claimData.defendant?.zipCode}</div>
            {claimData.defendant?.phone && <div>טל&apos;: {claimData.defendant?.phone}</div>}
          </div>
        </div>
      </div>

      {/* Main Title */}
      <div className="text-center text-[16px] font-bold underline mb-5 text-black">כתב תביעה</div>

      {/* Amount */}
      <div className="text-center font-bold mb-5 text-[13px] text-black">
        סכום התביעה: {claimData.claim?.amount?.toLocaleString("he-IL")} ₪
      </div>

      {/* Section A - Intro */}
      <div className="mb-4 text-black">
        <div className="font-bold underline mb-2 text-[12px]">א. מבוא</div>
        <p className="pr-5 mb-1.5" style={{ textIndent: '-20px', paddingRight: '20px', color: '#000' }}>
          1. התובע מגיש בזאת תביעה כספית כנגד הנתבע, לתשלום סך של {claimData.claim?.amount?.toLocaleString("he-IL")} ₪.
        </p>
        <p className="pr-5 mb-1.5" style={{ textIndent: '-20px', paddingRight: '20px', color: '#000' }}>
          2. לבית משפט נכבד זה סמכות עניינית לדון בתביעה...
        </p>
      </div>

      {/* LOCKED SECTION */}
      <div className="relative mt-4">
        <div className="filter blur-[3px] opacity-40 text-neutral-500">
          <div className="mb-3">
            <div className="font-bold underline mb-2 text-[12px]">ב. העובדות</div>
            <p className="pr-5 mb-1.5 text-[11px]">4. ביום {claimData.claim?.date} התקיימו בין הצדדים...</p>
          </div>
          <div className="mb-3">
            <div className="font-bold underline mb-2 text-[12px]">ג. הנזק</div>
            <p className="text-[11px]">כתוצאה ממעשי הנתבע נגרם לתובע נזק...</p>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/95 px-5 py-4 rounded-xl border border-amber-300 shadow-lg text-center">
            <Shield className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <div className="font-bold text-neutral-700 text-sm">המשך המסמך נעול</div>
            <div className="text-xs text-neutral-500 mt-1">פירוט הנזק, בסיס משפטי, הצהרות וחתימה</div>
          </div>
        </div>
      </div>
    </>
  );
}

// תוכן תצוגה מקדימה לערעור חניה
function ParkingPreviewContent({ claimData }: { claimData: ClaimData }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parkingData = claimData as any;
  const appellant = parkingData.appellant;
  const ticket = parkingData.ticket;
  const appeal = parkingData.appeal;

  return (
    <>
      {/* Header */}
      <div className="text-center border-b-2 border-emerald-600 pb-3 mb-5">
        <div className="text-[15px] font-bold mb-1 text-black">ערעור על דוח חניה</div>
        <div className="text-[11px] text-neutral-600">לכבוד: {ticket?.authority || "הרשות המקומית"}</div>
      </div>

      {/* Date */}
      <div className="text-left text-[11px] text-black mb-4">
        תאריך: {new Date().toLocaleDateString("he-IL")}
      </div>

      {/* Appellant Details */}
      <div className="mb-5 text-black">
        <div className="font-bold text-[12px] mb-2">פרטי המערער:</div>
        <div className="bg-neutral-50 p-3 rounded-lg text-[11px]">
          <div><strong>שם:</strong> {appellant?.fullName}</div>
          <div><strong>ת.ז.:</strong> {appellant?.idNumber}</div>
          <div><strong>כתובת:</strong> {appellant?.address}, {appellant?.city}</div>
          <div><strong>טלפון:</strong> {appellant?.phone}</div>
        </div>
      </div>

      {/* Ticket Details */}
      <div className="mb-5 text-black">
        <div className="font-bold text-[12px] mb-2">פרטי הדוח:</div>
        <div className="bg-neutral-50 p-3 rounded-lg text-[11px]">
          <div><strong>מספר דוח:</strong> {ticket?.ticketNumber}</div>
          <div><strong>תאריך:</strong> {ticket?.date}</div>
          <div><strong>מיקום:</strong> {ticket?.location}</div>
          <div><strong>מספר רכב:</strong> {ticket?.vehicleNumber}</div>
          <div><strong>סכום:</strong> {ticket?.amount} ₪</div>
        </div>
      </div>

      {/* Main Title */}
      <div className="text-center text-[14px] font-bold underline mb-4 text-black">נושא: ערעור על דוח חניה מס&apos; {ticket?.ticketNumber}</div>

      {/* Appeal Reason */}
      <div className="mb-4 text-black">
        <div className="font-bold text-[12px] mb-2">סיבת הערעור:</div>
        <p className="text-[11px]">{appeal?.reasonLabel}</p>
      </div>

      {/* LOCKED SECTION */}
      <div className="relative mt-4">
        <div className="filter blur-[3px] opacity-40 text-neutral-500">
          <div className="mb-3">
            <div className="font-bold text-[12px] mb-2">תיאור האירוע:</div>
            <p className="text-[11px]">{appeal?.description?.substring(0, 50)}...</p>
          </div>
          <div className="mb-3">
            <div className="font-bold text-[12px] mb-2">הנימוקים המשפטיים:</div>
            <p className="text-[11px]">על פי תקנות התעבורה...</p>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/95 px-5 py-4 rounded-xl border border-amber-300 shadow-lg text-center">
            <Shield className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <div className="font-bold text-neutral-700 text-sm">המשך המסמך נעול</div>
            <div className="text-xs text-neutral-500 mt-1">תיאור מלא, נימוקים משפטיים וחתימה</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function PreviewModal({
  isOpen,
  claimData,
  onClose,
  onPayment,
  serviceType = 'claims',
  price,
}: PreviewModalProps) {
  if (!claimData) return null;
  
  const isParking = serviceType === 'parking';
  const displayPrice = price || PRICES[serviceType] || PRICES.claims;
  const documentName = isParking ? 'מכתב הערעור' : 'כתב התביעה';

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
            <div className={`px-6 py-4 flex items-center justify-between ${isParking ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-blue-600 to-emerald-500'}`}>
              <div className="flex items-center gap-3 text-white">
                <Eye className="w-5 h-5" />
                <span className="font-semibold">תצוגה מקדימה - {documentName}</span>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Content */}
            <div 
              className="flex-1 overflow-y-auto p-4 bg-neutral-100 relative"
              style={{ 
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
              }}
              onCopy={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
              onContextMenu={(e) => e.preventDefault()}
            >
              <div className="bg-white shadow-lg mx-auto max-w-[600px] p-8 relative text-[12px] leading-[1.7] text-black" style={{ fontFamily: 'David, "Times New Roman", serif', color: '#000' }}>
                
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                  <div className="text-[60px] font-bold text-neutral-200 rotate-[-45deg] whitespace-nowrap">
                    תצוגה מקדימה
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-black">
                  {isParking ? (
                    <ParkingPreviewContent claimData={claimData} />
                  ) : (
                    <ClaimsPreviewContent claimData={claimData} />
                  )}
                </div>
              </div>
            </div>

            {/* Preview Footer */}
            <div className="border-t border-neutral-200 p-4 bg-neutral-50">
              <button
                onClick={onPayment}
                className={`w-full py-3 text-white rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 ${isParking ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-blue-600 to-emerald-500'}`}
              >
                <CreditCard className="w-5 h-5" />
                שלם ₪{displayPrice} וקבל את {documentName} המלא
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
