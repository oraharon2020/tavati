"use client";

import { MessageSquare, FileText, CreditCard, Download, CheckCircle, ArrowLeft, Clock, Shield, HelpCircle } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const steps = [
  {
    num: 1,
    icon: MessageSquare,
    title: "ספרו מה קרה",
    description: "התחילו שיחה קצרה עם המערכת וספרו בכמה משפטים מה קרה לכם. לא צריך ידע משפטי - פשוט ספרו את הסיפור שלכם.",
    details: [
      "אפשר לכתוב בשפה חופשית",
      "המערכת שואלת שאלות הבהרה",
      "אפשר להעלות תמונות ומסמכים",
    ],
    time: "2 דקות",
    color: "blue",
  },
  {
    num: 2,
    icon: HelpCircle,
    title: "ענו על שאלות ממוקדות",
    description: "המערכת תשאל אתכם שאלות פשוטות כדי להבין טוב יותר את המקרה ולאסוף את כל הפרטים הנדרשים לכתב התביעה.",
    details: [
      "פרטי הצדדים (שלכם ושל הנתבע)",
      "סכום הנזק שנגרם לכם",
      "תאריכים ואירועים רלוונטיים",
    ],
    time: "2 דקות",
    color: "indigo",
  },
  {
    num: 3,
    icon: FileText,
    title: "המערכת כותבת את התביעה",
    description: "ה-AI מנתח את המידע שסיפקתם וכותב כתב תביעה מקצועי בפורמט המקובל בבתי המשפט לתביעות קטנות.",
    details: [
      "ניסוח משפטי מקצועי",
      "מבנה תקני לבית משפט",
      "התאמה לסוג התביעה",
    ],
    time: "30 שניות",
    color: "purple",
  },
  {
    num: 4,
    icon: CreditCard,
    title: "תשלום מאובטח",
    description: "רק אחרי שראיתם את התביעה ואתם מרוצים - משלמים. תשלום חד פעמי של ₪79, בלי מנויים ובלי התחייבויות.",
    details: [
      "תשלום מאובטח בכרטיס אשראי",
      "קבלה נשלחת אוטומטית",
      "אפשרות לביטול לפי חוק",
    ],
    time: "1 דקה",
    color: "green",
  },
  {
    num: 5,
    icon: Download,
    title: "הורידו והגישו",
    description: "מורידים את כתב התביעה כקובץ PDF מוכן להגשה. המסמך כולל את כל הפרטים הנדרשים לבית המשפט.",
    details: [
      "קובץ PDF מוכן להדפסה",
      "הנחיות להגשה",
      "תמיכה בווטסאפ אם צריך עזרה",
    ],
    time: "מיידי",
    color: "emerald",
  },
];

const faqs = [
  {
    q: "האם צריך ידע משפטי?",
    a: "ממש לא. המערכת מנחה אתכם צעד אחר צעד ושואלת שאלות פשוטות בשפה יומיומית.",
  },
  {
    q: "כמה זמן לוקח התהליך?",
    a: "בממוצע 5 דקות מהתחלה ועד כתב תביעה מוכן להגשה.",
  },
  {
    q: "מה אם אני לא מרוצה?",
    a: "משלמים רק אחרי שרואים את התביעה. בנוסף, יש 14 יום לביטול והחזר כספי מלא.",
  },
  {
    q: "האם זה מחליף עורך דין?",
    a: "המערכת מכינה את המסמכים, אבל אינה מהווה ייעוץ משפטי. לתביעות מורכבות מומלץ להתייעץ עם עו\"ד.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <Header />

      {/* Hero */}
      <section className="py-16 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            איך זה עובד?
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            5 שלבים פשוטים מהרגע שמשהו קרה לכם ועד כתב תביעה מוכן להגשה
          </p>
          
          <div className="flex items-center justify-center gap-6 mt-8 text-sm">
            <div className="flex items-center gap-2 text-neutral-600">
              <Clock className="w-5 h-5 text-blue-500" />
              <span>5 דקות בממוצע</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-600">
              <Shield className="w-5 h-5 text-green-500" />
              <span>תשלום רק בסוף</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-600">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>₪79 חד פעמי</span>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;
              
              return (
                <div key={step.num} className="relative">
                  {/* Connector line */}
                  {!isLast && (
                    <div className="absolute right-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-transparent h-full -mb-12" />
                  )}
                  
                  <div className="flex gap-6">
                    {/* Number circle */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-${step.color}-100 text-${step.color}-600 flex items-center justify-center font-bold text-lg relative z-10`}>
                      {step.num}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pb-8">
                      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-${step.color}-50 flex items-center justify-center`}>
                              <Icon className={`w-5 h-5 text-${step.color}-600`} />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900">{step.title}</h3>
                          </div>
                          <span className="text-sm text-neutral-400 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {step.time}
                          </span>
                        </div>
                        
                        <p className="text-neutral-600 mb-4">{step.description}</p>
                        
                        <ul className="space-y-2">
                          {step.details.map((detail, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-neutral-500">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Visual Summary */}
      <section className="py-16 px-6 bg-neutral-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-neutral-900 text-center mb-10">סיכום התהליך</h2>
          
          <div className="flex flex-wrap justify-center items-center gap-4">
            {["ספרו", "ענו", "קבלו", "שלמו", "הגישו"].map((text, i) => (
              <div key={i} className="flex items-center">
                <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{i + 1}</span>
                  <span className="text-xs">{text}</span>
                </div>
                {i < 4 && (
                  <ArrowLeft className="w-6 h-6 text-neutral-300 mx-2 rotate-180" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mini FAQ */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-neutral-900 text-center mb-8">שאלות נפוצות</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-neutral-50 rounded-xl p-5">
                <h3 className="font-semibold text-neutral-900 mb-2">{faq.q}</h3>
                <p className="text-neutral-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/faq" className="text-blue-600 hover:text-blue-700 font-medium">
              לכל השאלות הנפוצות ←
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">מוכנים להתחיל?</h2>
          <p className="text-blue-100 mb-8">
            קבלו כתב תביעה מקצועי תוך 5 דקות
          </p>
          
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-bold text-lg"
          >
            התחילו עכשיו
            <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <p className="text-sm text-blue-200 mt-4">
            תשלום רק אחרי שהתביעה מוכנה • ₪79 חד פעמי
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
