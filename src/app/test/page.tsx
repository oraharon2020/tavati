"use client";

import { useState } from "react";
import { generateClaimPDF } from "@/lib/pdfGenerator";
import { ClaimData, calculateFee, validateIsraeliID } from "@/lib/types";

// נתוני טסט לדוגמה - מבוסס על כתב תביעה אמיתי
const testClaimData: ClaimData = {
  plaintiff: {
    fullName: "אור אהרון",
    idNumber: "312273709",
    address: "הלוחמות 20",
    city: "ראשון לציון",
    zipCode: "7526403",
    phone: "0528884290",
    email: "or.aharon1122@gmail.com",
  },
  defendant: {
    name: "ניר גרוס",
    type: "individual",
    idOrCompanyNumber: "028063238",
    address: "יוחנן הסנדלר 6 קומה 18 דירה 69",
    city: "בת ים",
    zipCode: "5930200",
    phone: "0542377488",
  },
  claim: {
    type: "contract",
    amount: 4000,
    description:
      "ביום 14 ביוני 2024 נחתם הסכם מכירת ריהוט בין הצדדים. הנתבע שילם חלק מהסכום המוסכם בלבד וסירב לשלם את יתרת התשלום בטענות שאינן מבוססות לגבי מצב הריהוט שנמכר לו.",
    date: "14 ביוני 2024",
    evidence: [
      "הסכם מכירה חתום",
      "קבלות על תשלומים שהתקבלו",
      "תכתובות וואטסאפ עם הנתבע",
      "תמונות הריהוט במצבו בעת המכירה",
    ],
    breakdown: "יתרת חוב על פי ההסכם: 4,000 ש״ח",
  },
  declarations: {
    under5Claims: true,
    truthful: true,
  },
};

export default function TestPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      await generateClaimPDF(testClaimData);
      setGenerated(true);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("שגיאה ביצירת ה-PDF: " + error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center"
    >
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          🧪 טסט יצירת PDF
        </h1>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="font-bold mb-3">נתוני הטסט:</h2>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-blue-600">התובע:</h3>
              <p>שם: {testClaimData.plaintiff.fullName}</p>
              <p>ת.ז.: {testClaimData.plaintiff.idNumber}</p>
              <p>עיר: {testClaimData.plaintiff.city}</p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-600">הנתבע:</h3>
              <p>שם: {testClaimData.defendant.name}</p>
              <p>סוג: חברה בע״מ</p>
              <p>עיר: {testClaimData.defendant.city}</p>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-blue-600">סכום התביעה:</h3>
            <p className="text-2xl font-bold text-green-600">
              ₪{testClaimData.claim.amount.toLocaleString("he-IL")}
            </p>
            <p className="text-sm text-gray-500">
              אגרה: ₪{Math.max(Math.round(testClaimData.claim.amount * 0.01), 50)}
            </p>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-blue-600">ראיות:</h3>
            <ul className="list-disc list-inside text-sm">
              {testClaimData.claim.evidence.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        </div>

        <button
          onClick={handleGeneratePDF}
          disabled={isGenerating}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? "⏳ יוצר PDF..." : "📄 צור PDF לדוגמה"}
        </button>

        {generated && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg text-center">
            ✅ ה-PDF נוצר והורד בהצלחה!
          </div>
        )}

        <div className="mt-6 text-center">
          <a href="/" className="text-blue-600 hover:underline">
            ← חזרה לצ׳אט
          </a>
        </div>
      </div>
    </div>
  );
}
