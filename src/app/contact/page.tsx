"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "שאלה כללית",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();
      
      setStatus("sent");
      setFormData({ name: "", email: "", phone: "", subject: "שאלה כללית", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col text-neutral-900">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto px-6 py-12 w-full">
        <h1 className="text-3xl font-bold mb-2 text-neutral-900">צור קשר</h1>
        <p className="text-neutral-600 mb-8">יש לך שאלה? נשמח לעזור!</p>

        {status === "sent" ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-green-800 mb-2">הודעתך נשלחה בהצלחה!</h2>
            <p className="text-green-700">נחזור אליך בהקדם האפשרי.</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 text-green-600 underline"
            >
              שלח הודעה נוספת
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-700">שם מלא *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-neutral-900"
                  placeholder="ישראל ישראלי"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-700">טלפון</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-neutral-900"
                  placeholder="050-1234567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-700">אימייל *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-neutral-900"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-700">נושא הפנייה</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-neutral-900 bg-white"
              >
                <option value="שאלה כללית">שאלה כללית</option>
                <option value="בעיה טכנית">בעיה טכנית</option>
                <option value="בקשת החזר">בקשת החזר</option>
                <option value="שיתוף פעולה">שיתוף פעולה</option>
                <option value="אחר">אחר</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-700">הודעה *</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-neutral-900 resize-none"
                placeholder="כתוב את הודעתך כאן..."
              />
            </div>

            {status === "error" && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                שגיאה בשליחת ההודעה. נסה שוב או צור קשר בוואטסאפ.
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-neutral-900 text-white py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              {status === "sending" ? "שולח..." : "שלח הודעה"}
            </button>
          </form>
        )}

        {/* Alternative contact methods */}
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-lg font-bold mb-4 text-neutral-900">דרכים נוספות ליצירת קשר</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://wa.me/972528884290?text=היי, פניתי מאתר תבעתי"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
            >
              <span className="text-2xl">💬</span>
              <div>
                <div className="font-medium text-neutral-900">WhatsApp</div>
                <div className="text-sm text-neutral-500">מענה מהיר</div>
              </div>
            </a>
            <a
              href="mailto:support@tavati.app"
              className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <span className="text-2xl">📧</span>
              <div>
                <div className="font-medium text-neutral-900">אימייל</div>
                <div className="text-sm text-neutral-500">support@tavati.app</div>
              </div>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
