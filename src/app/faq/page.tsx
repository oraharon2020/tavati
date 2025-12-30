"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Script from "next/script";

const faqs = [
  {
    category: "על תביעות קטנות בכלל",
    questions: [
      {
        q: "מה זה בעצם תביעות קטנות?",
        a: "תביעות קטנות הן תביעות כספיות עד 38,900 ₪ (הסכום מתעדכן בינואר כל שנה). הן מתנהלות בבית משפט מיוחד, בהליך פשוט וקצר יותר, בלי צורך בעורך דין. זו הדרך הכי נגישה להגן על הזכויות שלך."
      },
      {
        q: "על מה אפשר לתבוע בתביעות קטנות?",
        a: "כמעט על הכל! מוצר פגום, שכירות שלא חזרה, קבלן שעשה עבודה גרועה, ביטוח שדחה תביעה, חברת סלולר שגבתה חיובים מופרכים, ועוד. אם מישהו חייב לך כסף או גרם לך נזק כספי עד 38,900 ₪ - אפשר לתבוע."
      },
      {
        q: "האם חייבים עורך דין בתביעות קטנות?",
        a: "לא! זו כל המטרה של תביעות קטנות - לאפשר לאנשים לייצג את עצמם. בעצם, לפי החוק אסור להגיע עם עורך דין לתביעות קטנות (למעט במקרים חריגים שבית המשפט מאשר)."
      },
      {
        q: "כמה עולה להגיש תביעה קטנה?",
        a: "אגרת בית המשפט היא 1% מסכום התביעה, מינימום 50 ₪. כלומר, על תביעה של 5,000 ₪ תשלמו 50 ₪, על תביעה של 15,000 ₪ תשלמו 150 ₪. אם תזכו - הנתבע עלול להיות מחויב להחזיר לכם את האגרה."
      },
      {
        q: "כמה זמן לוקח עד לדיון?",
        a: "בדרך כלל 2-4 חודשים מיום הגשת התביעה. זה משתנה לפי בית המשפט והעומס שלו. בתי משפט בפריפריה בדרך כלל מהירים יותר."
      },
      {
        q: "מה הסיכוי שלי לזכות?",
        a: "אי אפשר להבטיח, אבל הסטטיסטיקה מעודדת - בתביעות עם תיעוד טוב, אחוז ההצלחה גבוה. הרבה תביעות נגמרות בפשרה עוד לפני הדיון, כי לנתבעים לא משתלם להתעסק."
      }
    ]
  },
  {
    category: "על השירות של תבעתי",
    questions: [
      {
        q: "מה אתם עושים בדיוק?",
        a: "אנחנו עוזרים לך להכין כתב תביעה מקצועי ומוכן להגשה לבית המשפט. המערכת שואלת אותך שאלות פשוטות, מנחה אותך מה לכלול, ומפיקה מסמך PDF מוכן להגשה - עם כל הסעיפים המשפטיים הנכונים."
      },
      {
        q: "כמה זה עולה?",
        a: "השירות עולה 79 ₪ בלבד - תשלום חד פעמי. אתה משלם רק כשכתב התביעה מוכן ומרוצה מהתוצאה. ניסוח אצל עורך דין היה עולה 500-1,500 ₪ לפחות."
      },
      {
        q: "האם זה מחליף ייעוץ משפטי?",
        a: "לא. השירות מסייע בהכנת מסמכים ומספק מידע כללי, אבל אינו מהווה ייעוץ משפטי. אם יש לך מקרה מורכב או ספקות - שווה להתייעץ עם עורך דין."
      },
      {
        q: "מה אני צריך בשביל להתחיל?",
        a: "רק את הפרטים הבסיסיים: מי אתה, מי הנתבע (שם וכתובת), מה קרה וכמה כסף מגיע לך. את השאר המערכת תשאל ותנחה."
      },
      {
        q: "כמה זמן לוקח התהליך?",
        a: "5-15 דקות בממוצע. אתה עונה על שאלות, המערכת מנסחת, ואתה מקבל מסמך מוכן. אפשר גם לשמור ולהמשיך אחר כך."
      }
    ]
  },
  {
    category: "התהליך והמסמכים",
    questions: [
      {
        q: "מה המערכת מפיקה בסוף?",
        a: "קובץ PDF מקצועי של כתב תביעה, עם כל הסעיפים הנדרשים לפי תקנות בית המשפט - עילת התביעה, פירוט העובדות, הסכום הנתבע, ועוד. מוכן להדפסה ולהגשה."
      },
      {
        q: "האם אפשר לערוך את המסמך אחרי?",
        a: "אתה מקבל PDF, אבל אם צריך שינויים אפשר לחזור למערכת ולערוך. המסמך נשאר נגיש אליך."
      },
      {
        q: "מה אם אני צריך לצרף ראיות?",
        a: "כתב התביעה עצמו לא מכיל את הראיות - הן מוגשות בנפרד. אנחנו נסביר לך בדיוק אילו מסמכים להביא לדיון ואיך להציג אותם."
      },
      {
        q: "מה עם מכתב התראה?",
        a: "המערכת יכולה לעזור לך לנסח גם מכתב התראה לשלוח לפני התביעה. לפעמים המכתב לבד פותר את הבעיה ולא צריך לתבוע."
      },
      {
        q: "האם אתם שולחים את התביעה לבית המשפט?",
        a: "לא. אנחנו מכינים את המסמך, אתה מגיש אותו. ההגשה היא פשוטה - או באתר נט-המשפט באינטרנט, או פיזית במזכירות בית המשפט."
      }
    ]
  },
  {
    category: "הגשה ודיון בבית המשפט",
    questions: [
      {
        q: "לאיזה בית משפט מגישים?",
        a: "מגישים לבית המשפט לתביעות קטנות באזור מגורי הנתבע. אם הנתבע בתל אביב - מגישים בתל אביב. אם יש כמה נתבעים במקומות שונים - אפשר לבחור."
      },
      {
        q: "איך מגישים את התביעה?",
        a: "שתי אפשרויות: באופן מקוון דרך אתר נט-המשפט (הכי נוח), או פיזית במזכירות בית המשפט. ההגשה המקוונת זמינה 24/7."
      },
      {
        q: "מה אם הנתבע לא מגיע לדיון?",
        a: "בית המשפט יכול לפסוק לטובתך בהיעדרו - זה נקרא פסק דין בהיעדר הגנה. כמובן, עדיין צריך להוכיח את התביעה, אבל זה הרבה יותר קל."
      },
      {
        q: "האם מותר להביא עדים?",
        a: "בהחלט! עדים יכולים לחזק מאוד את התביעה. צריך להודיע לבית המשפט ולנתבע על העדים מראש."
      },
      {
        q: "כמה זמן נמשך דיון?",
        a: "בדרך כלל 15-30 דקות לדיון פשוט. השופט שומע את שני הצדדים, שואל שאלות, ונותן פסק דין - לפעמים באותו יום ולפעמים תוך שבועות."
      },
      {
        q: "מה אם הנתבע מציע פשרה?",
        a: "זה קורה הרבה! אם ההצעה טובה - שקלו לקבל. פשרה זה כסף בטוח היום, לעומת פסק דין שאולי יהיה יותר אבל גם אולי פחות."
      }
    ]
  },
  {
    category: "אחרי הזכייה",
    questions: [
      {
        q: "זכיתי! איך מקבלים את הכסף?",
        a: "קודם כל - מזל טוב! הנתבע צריך לשלם תוך 30 יום (אלא אם נקבע אחרת). אם הוא לא משלם - אפשר לפתוח תיק הוצאה לפועל ולגבות בכוח."
      },
      {
        q: "מה אם הנתבע לא משלם?",
        a: "פונים להוצאה לפועל עם פסק הדין. שם יכולים לעקל משכורת, חשבון בנק, רכב, ואפילו דירה. הרבה אנשים משלמים ברגע שרואים שהולכים רציני."
      },
      {
        q: "האם הנתבע יכול לערער?",
        a: "כן, יש אפשרות ערעור לבית משפט שלום. אבל ערעור על תביעה קטנה זה יקר ומסובך, אז רוב האנשים לא טורחים אלא אם הסכום גבוה."
      }
    ]
  },
  {
    category: "תשלום וביטולים",
    questions: [
      {
        q: "איך משלמים?",
        a: "בכרטיס אשראי, באופן מאובטח. משלמים רק אחרי שהמסמך מוכן ומרוצים ממנו."
      },
      {
        q: "אפשר לבטל ולקבל החזר?",
        a: "כן! בהתאם לחוק הגנת הצרכן יש לך 14 יום לבטל ולקבל החזר מלא. פרטים מלאים בדף מדיניות הביטולים."
      },
      {
        q: "מה אם יש בעיה טכנית?",
        a: "פנו אלינו ונטפל בזה מיד. אם משהו לא עובד - נתקן או נחזיר כסף."
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
  // Generate FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.flatMap(category => 
      category.questions.map(q => ({
        "@type": "Question",
        "name": q.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.a
        }
      }))
    )
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white flex flex-col">
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
