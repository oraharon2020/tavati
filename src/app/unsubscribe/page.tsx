"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Phone } from "lucide-react";
import Link from "next/link";

export default function UnsubscribePage() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || phone.length < 9) {
      setMessage("אנא הזן מספר טלפון תקין");
      setStatus("error");
      return;
    }

    setStatus("loading");
    
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("הוסרת בהצלחה מרשימת התפוצה. לא תקבל יותר הודעות SMS מאיתנו.");
      } else {
        setStatus("error");
        setMessage(data.error || "שגיאה בהסרה, נסה שוב");
      }
    } catch {
      setStatus("error");
      setMessage("שגיאה בתקשורת, נסה שוב");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-neutral-900 text-center mb-2">
          הסרה מרשימת התפוצה
        </h1>
        <p className="text-neutral-600 text-center mb-6">
          הזן את מספר הטלפון שלך כדי להפסיק לקבל הודעות SMS מתבעתי
        </p>

        {status === "success" ? (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-green-700 font-medium mb-6">{message}</p>
            <Link
              href="/"
              className="text-blue-600 hover:underline"
            >
              חזרה לדף הבית
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                מספר טלפון
              </label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="050-1234567"
                  className="w-full pr-10 pl-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-neutral-900"
                  dir="ltr"
                />
              </div>
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <XCircle className="w-4 h-4" />
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {status === "loading" ? "מסיר..." : "הסר אותי מהרשימה"}
            </button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-neutral-200 text-center text-sm text-neutral-500">
          <p>
            בהתאם לחוק הספאם (תיקון 40 לחוק התקשורת), יש לך זכות להסרה מכל רשימת תפוצה.
          </p>
          <p className="mt-2">
            שאלות? <Link href="/contact" className="text-blue-600 hover:underline">צור קשר</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
