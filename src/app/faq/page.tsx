"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    category: "על השירות",
    questions: [
      {
        q: "מה זה תביעות קטנות?",
        a: "תביעות קטנות הן תביעות בסכום של עד 38,900 ₪ (נכון ל-2025) שנידונות בבית משפט מיוחד, בהליך פשוט וללא צורך בעורך דין. זו הדרך הקלה והמהירה ביותר לתבוע פיצוי כספי."
      },
      {
        q: "מה השירות שלכם מציע?",
        a: "אנחנו עוזרים לך להכין כתב תביעה מקצועי ומוכן להגשה לבית המשפט. המערכת מנחה אותך צעד אחר צעד, אוספת את כל הפרטים הנדרשים, ומפיקה מסמך PDF מוכן להגשה."
      },
      {
        q: "כמה זה עולה?",
        a: "השירות עולה 79 ₪ בלבד - תשלום חד פעמי. אתה משלם רק כשכתב התביעה מוכן ומרוצה מהתוצאה."
      },
      {
        q: "האם זה מחליף עורך דין?",
        a: "השירות מסייע בהכנת המסמכים אך אינו מהווה ייעוץ משפטי. לתיקים מורכבים או בסכומים גבוהים, מומלץ להתייעץ עם עורך דין."
      }
    ]
  },
  {
    category: "התהליך",
    questions: [
      {
        q: "כמה זמן לוקח להכין תביעה?",
        a: "התהליך לוקח בממוצע 5-10 דקות. אתה עונה על שאלות פשוטות והמערכת מכינה את המסמך."
      },
      {
        q: "מה אני צריך כדי להתחיל?",
        a: "תזדקק לפרטים הבאים: תעודת זהות, פרטי הנתבע (שם, כתובת, מספר זיהוי), תיאור המקרה, והסכום שאתה תובע. כדאי להכין גם ראיות (חשבוניות, הסכמים, תכתובות)."
      },
      {
        q: "האם אפשר לשמור ולהמשיך אחר כך?",
        a: "כן! המערכת שומרת אוטומטית את ההתקדמות שלך. תוכל להמשיך מאיפה שהפסקת בכל זמן."
      },
      {
        q: "מה קורה אחרי שמקבלים את הקובץ?",
        a: "תקבל PDF מוכן להגשה + הנחיות מפורטות איך להגיש את התביעה לבית המשפט, כולל קישורים לאתרים הרלוונטיים."
      }
    ]
  },
  {
    category: "הגשה לבית משפט",
    questions: [
      {
        q: "איפה מגישים את התביעה?",
        a: "מגישים לבית המשפט לתביעות קטנות שבאזור מגורי הנתבע. ניתן להגיש באופן מקוון דרך אתר נט-המשפט, או פיזית במזכירות בית המשפט."
      },
      {
        q: "כמה עולה להגיש תביעה לבית המשפט?",
        a: "אגרת בית המשפט היא 1% מסכום התביעה, מינימום 50 ₪. למשל, על תביעה של 5,000 ₪ תשלם אגרה של 50 ₪."
      },
      {
        q: "כמה זמן לוקח עד לדיון?",
        a: "בדרך כלל 2-4 חודשים מיום הגשת התביעה. זה תלוי בעומס של בית המשפט הספציפי."
      },
      {
        q: "מה אם הנתבע לא מגיע לדיון?",
        a: "אם הנתבע לא מגיע לדיון ולא הגיש כתב הגנה, בית המשפט עשוי לפסוק לטובתך בהיעדרו."
      }
    ]
  },
  {
    category: "תשלום והחזרים",
    questions: [
      {
        q: "איך משלמים?",
        a: "התשלום מתבצע בכרטיס אשראי באופן מאובטח. אתה משלם רק אחרי שכתב התביעה מוכן."
      },
      {
        q: "האם אפשר לבטל ולקבל החזר?",
        a: "כן, בהתאם לחוק הגנת הצרכן יש לך 14 יום לבטל את העסקה ולקבל החזר מלא. פרטים נוספים בדף מדיניות הביטול."
      },
      {
        q: "מה אם יש בעיה עם הקובץ?",
        a: "אם יש תקלה טכנית או בעיה במסמך, פנה אלינו ונטפל בזה מיד. שביעות רצונך חשובה לנו."
      }
    ]
  }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-neutral-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-right hover:bg-neutral-50 transition-colors gap-4"
      >
        <ChevronDown 
          className={`w-5 h-5 text-blue-500 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
        <span className="font-medium text-neutral-900 flex-1">{question}</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 pr-14 text-neutral-700 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white flex flex-col">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-4">
              שאלות ותשובות
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              שאלות נפוצות
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              כל מה שצריך לדעת על תביעות קטנות והשירות שלנו
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-10">
            {faqs.map((category, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
                  <h2 className="text-lg font-bold text-white">
                    {category.category}
                  </h2>
                </div>
                <div className="divide-y divide-neutral-100">
                  {category.questions.map((faq, faqIdx) => (
                    <FAQItem key={faqIdx} question={faq.q} answer={faq.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-16 p-8 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-2xl text-center shadow-xl">
            <h3 className="font-bold text-2xl text-white mb-3">לא מצאת תשובה?</h3>
            <p className="text-blue-100 mb-6">אנחנו כאן לעזור בכל שאלה!</p>
            <a
              href="mailto:support@tavati.co.il"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg"
            >
              📧 שלח לנו מייל
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
