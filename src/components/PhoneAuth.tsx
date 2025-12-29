"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ArrowLeft, Loader2, Scale, Shield } from "lucide-react";

interface PhoneAuthProps {
  onAuthenticated: (phone: string, sessionId?: string | null) => void;
}

export default function PhoneAuth({ onAuthenticated }: PhoneAuthProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async () => {
    if (!phone || phone.length < 9) {
      setError("נא להזין מספר טלפון תקין");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (data.success) {
        setStep("otp");
      } else {
        setError(data.error || "שגיאה בשליחת הקוד");
      }
    } catch {
      setError("שגיאה בשליחת הקוד");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 6) {
      setError("נא להזין קוד בן 6 ספרות");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await res.json();

      if (data.success) {
        onAuthenticated(phone, data.sessionId);
      } else {
        setError(data.error || "קוד שגוי");
      }
    } catch {
      setError("שגיאה באימות הקוד");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center mb-4">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">תבעתי</h1>
          <p className="text-[var(--muted)] mt-2">תביעות קטנות בקלות</p>
        </div>

        {/* Auth Card */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-lg">
          <AnimatePresence mode="wait">
            {step === "phone" ? (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-bold">התחברות עם טלפון</h2>
                    <p className="text-sm text-[var(--muted)]">נשלח קוד אימות ב-SMS</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">מספר טלפון</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="050-0000000"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-right"
                      dir="ltr"
                    />
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}

                  <button
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "שלח קוד אימות"
                    )}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button
                  onClick={() => setStep("phone")}
                  className="flex items-center gap-2 text-[var(--muted)] mb-4 hover:text-[var(--foreground)]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  חזרה
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="font-bold">הזן את הקוד</h2>
                    <p className="text-sm text-[var(--muted)]">נשלח ל-{phone}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">קוד אימות</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="000000"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-center text-2xl tracking-widest"
                      dir="ltr"
                      maxLength={6}
                    />
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}

                  <button
                    onClick={handleVerifyOTP}
                    disabled={loading || otp.length < 6}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "אמת והמשך"
                    )}
                  </button>

                  <button
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="w-full py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    לא קיבלת? שלח שוב
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Trust badges */}
        <div className="mt-6 text-center text-sm text-[var(--muted)]">
          <p>🔒 המידע שלך מוגן ומאובטח</p>
        </div>
      </motion.div>
    </div>
  );
}
