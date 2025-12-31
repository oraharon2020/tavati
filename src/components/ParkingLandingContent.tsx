"use client";

import { CheckCircle, Clock, Shield, ArrowLeft, Car, AlertTriangle } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const APPEAL_REASONS = [
  { icon: "🚫", title: "לא היה שלט", description: "השילוט היה חסר או לא ברור" },
  { icon: "💳", title: "שילמתי בזמן", description: "שילמתי באפליקציה/פנגו/חניון" },
  { icon: "♿", title: "תו נכה", description: "יש לי תו נכה בתוקף" },
  { icon: "🚨", title: "מצב חירום", description: "נאלצתי לעצור בגלל חירום" },
  { icon: "❌", title: "פרטים שגויים", description: "פרטי הדוח שגויים" },
  { icon: "📦", title: "פריקה/טעינה", description: "הייתי בפריקה מורשית" },
];

export default function ParkingLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main id="main-content" role="main">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center py-16 px-6 bg-gradient-to-br from-[#f0fdf4] to-[#ecfdf5]">
          {/* Background */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <div 
              className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-emerald-200/40 rounded-full blur-[100px]"
              style={{ animation: 'float 20s ease-in-out infinite' }}
            />
            <div 
              className="absolute bottom-[10%] left-[5%] w-[350px] h-[350px] bg-green-200/30 rounded-full blur-[80px]"
              style={{ animation: 'float 25s ease-in-out infinite', animationDelay: '-5s' }}
            />
          </div>

          <div className="max-w-6xl mx-auto w-full relative z-10">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Right Side - Content */}
              <motion.div
                className="text-center md:text-right"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur border border-emerald-100 rounded-full text-emerald-700 text-sm font-medium mb-6 shadow-sm"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Car className="w-4 h-4" />
                  ערעור על דוח חניה
                </motion.div>

                <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-5 leading-tight">
                  קיבלת דוח חניה?
                  <br />
                  <span className="bg-gradient-to-l from-emerald-600 to-emerald-500 bg-clip-text text-transparent">ערער עליו בקלות</span>
                </h1>

                <p className="text-lg text-neutral-700 mb-8 max-w-md mx-auto md:mx-0">
                  ספר לנו מה קרה ונכין לך מכתב ערעור מקצועי - מוכן לשליחה תוך 3 דקות
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center md:justify-start">
                  <Link
                    href="/chat?service=parking"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-gradient-to-l from-emerald-600 to-emerald-500 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-600 transition-all font-semibold text-base shadow-lg shadow-emerald-500/25 hover:scale-[1.02]"
                  >
                    <span>התחל ערעור עכשיו</span>
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 justify-center md:justify-start text-sm text-neutral-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span>סיכויי הצלחה גבוהים</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-500" />
                    <span>רק 3 דקות</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-500" />
                    <span>39₪ בלבד</span>
                  </div>
                </div>
              </motion.div>

              {/* Left Side - Visual */}
              <motion.div
                className="flex justify-center order-first md:order-last"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full border border-emerald-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                      <Car className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900">דוח חניה</h3>
                      <p className="text-sm text-neutral-500">ערער בקלות</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                      <span className="text-2xl">📝</span>
                      <div>
                        <p className="font-medium text-neutral-800">מלא פרטים</p>
                        <p className="text-sm text-neutral-500">פרטי הדוח והסיבה</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                      <span className="text-2xl">🤖</span>
                      <div>
                        <p className="font-medium text-neutral-800">AI יוצר ערעור</p>
                        <p className="text-sm text-neutral-500">מכתב מקצועי ומנומק</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                      <span className="text-2xl">📤</span>
                      <div>
                        <p className="font-medium text-neutral-800">שלח לרשות</p>
                        <p className="text-sm text-neutral-500">מוכן להגשה</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="text-3xl font-bold text-emerald-600">39₪</span>
                    <span className="text-neutral-500 mr-1">בלבד</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Appeal Reasons Section */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">סיבות נפוצות לערעור</h2>
              <p className="text-neutral-600">בחר את הסיבה המתאימה ואנחנו ננסח את הערעור</p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {APPEAL_REASONS.map((reason, index) => (
                <motion.div
                  key={index}
                  className="bg-neutral-50 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer border border-transparent hover:border-emerald-200"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="text-4xl mb-4 block">{reason.icon}</span>
                  <h3 className="font-bold text-neutral-900 mb-2">{reason.title}</h3>
                  <p className="text-sm text-neutral-600">{reason.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/chat?service=parking"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold"
              >
                התחל ערעור עכשיו
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-20 px-6 bg-gradient-to-br from-emerald-50 to-green-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">איך זה עובד?</h2>
            </div>

            <div className="space-y-8">
              {[
                { step: 1, title: "מלא את פרטיך", desc: "שם, טלפון וכתובת" },
                { step: 2, title: "הזן את פרטי הדוח", desc: "מספר דוח, תאריך וסכום" },
                { step: 3, title: "בחר את סיבת הערעור", desc: "ותאר בקצרה מה קרה" },
                { step: 4, title: "צרף ראיות (אופציונלי)", desc: "תמונות או צילומי מסך" },
                { step: 5, title: "קבל מכתב ערעור מוכן", desc: "שלח לרשות ישירות מהמייל" },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  className="flex items-center gap-6"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900">{item.title}</h3>
                    <p className="text-neutral-600">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Warning / Time Limit */}
        <section className="py-12 px-6 bg-amber-50 border-y border-amber-200">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              <h3 className="text-xl font-bold text-amber-800">חשוב לדעת</h3>
            </div>
            <p className="text-amber-700">
              יש להגיש ערעור על דוח חניה <strong>תוך 30 יום</strong> מקבלת הדוח.
              <br />
              אל תפספסו את ההזדמנות לערער!
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">מוכן לערער על הדוח?</h2>
            <p className="text-lg text-emerald-100 mb-8">
              התהליך פשוט, מהיר ויעיל. 
              <br />
              הרבה ערעורים מתקבלים - שווה לנסות!
            </p>
            <Link
              href="/chat?service=parking"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors font-bold text-lg shadow-xl"
            >
              התחל ערעור עכשיו - 39₪
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, -10px) rotate(2deg); }
          50% { transform: translate(-5px, 15px) rotate(-1deg); }
          75% { transform: translate(-15px, -5px) rotate(1deg); }
        }
      `}</style>
    </div>
  );
}
