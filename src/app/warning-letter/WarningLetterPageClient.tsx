"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Mail, 
  CheckCircle, 
  AlertTriangle, 
  FileText,
  ArrowLeft,
  Clock,
  Send,
  Copy,
  Lightbulb
} from "lucide-react";
import { useState } from "react";

const letterTemplate = `לכבוד
[שם הנמען]
[כתובת]

תאריך: [תאריך]

הנדון: דרישה להחזר כספים / לתיקון ליקויים / [נושא]

1. ביום [תאריך] התקשרנו בהסכם ל[תיאור קצר].

2. על פי ההסכם, התחייבת ל[מה הייתם אמורים לקבל].

3. בפועל, [מה קרה - תיאור הבעיה].

4. פניתי אליך מספר פעמים (בתאריכים: [תאריכים]) אך ללא הועיל.

5. אני דורש/ת ממך ל[מה אתם רוצים - החזר כספי / תיקון / פיצוי] בסך [סכום] ₪.

6. אבקש לקבל את תשובתך תוך 14 יום מיום קבלת מכתב זה.

7. היה ולא תיענה לדרישתי, אפנה לבית המשפט לתביעות קטנות ללא התראה נוספת.

בברכה,
[שמך]
[טלפון]
[דוא"ל]`;

export default function WarningLetterPageClient() {
  const [copied, setCopied] = useState(false);

  const copyTemplate = () => {
    navigator.clipboard.writeText(letterTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
                <Mail className="w-4 h-4" />
                השלב הראשון לפני תביעה
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                מכתב התראה לפני תביעה
              </h1>
              <p className="text-xl text-amber-100">
                לפעמים מכתב טוב חוסך תביעה שלמה
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            
            {/* Why send */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center">למה לשלוח מכתב התראה?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold mb-2">לפתור בלי בית משפט</h3>
                  <p className="text-gray-600 text-sm">
                    הרבה פעמים הצד השני מעדיף לשלם מאשר להגיע לדיון. 
                    מכתב רשמי מראה שאתם רציניים.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold mb-2">תיעוד לבית המשפט</h3>
                  <p className="text-gray-600 text-sm">
                    אם כן תגישו תביעה, המכתב יוכיח שניסיתם לפתור 
                    את העניין בדרכי שלום.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="font-bold mb-2">לתת הזדמנות</h3>
                  <p className="text-gray-600 text-sm">
                    לפעמים הצד השני פשוט לא מודע לבעיה או שוכח. 
                    מכתב נותן לו הזדמנות לתקן.
                  </p>
                </div>
              </div>
            </section>

            {/* Template */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">תבנית למכתב התראה</h2>
                <button
                  onClick={copyTemplate}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? "הועתק!" : "העתק תבנית"}
                </button>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b flex items-center justify-between">
                  <span className="text-sm text-gray-500">תבנית למילוי - החליפו את הטקסט בסוגריים מרובעים</span>
                </div>
                <pre className="p-6 text-sm leading-relaxed whitespace-pre-wrap font-sans text-gray-800 bg-gray-50">
                  {letterTemplate}
                </pre>
              </div>
            </section>

            {/* Tips */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">טיפים למכתב התראה אפקטיבי</h2>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-green-600">1</span>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">היו עניינים וברורים</h3>
                    <p className="text-gray-600 text-sm">
                      כתבו בקצרה מה קרה ומה אתם דורשים. אל תכתבו 3 עמודים - עמוד אחד מספיק.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-green-600">2</span>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">ציינו סכום מדויק</h3>
                    <p className="text-gray-600 text-sm">
                      אל תכתבו "פיצוי הולם" - כתבו סכום מדויק. זה מקצועי יותר ומראה שחישבתם.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-green-600">3</span>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">תנו דדליין ריאלי</h3>
                    <p className="text-gray-600 text-sm">
                      14 יום זה סטנדרטי. פחות מ-7 ימים יכול להיראות לא סביר.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-green-600">4</span>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">שלחו בדואר רשום</h3>
                    <p className="text-gray-600 text-sm">
                      כך יש לכם הוכחה שהמכתב נשלח והתקבל. שמרו את האישור!
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-green-600">5</span>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">אפשר גם באימייל</h3>
                    <p className="text-gray-600 text-sm">
                      בנוסף לדואר רשום, שלחו גם במייל. כך יש סיכוי שיקראו מהר יותר.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* What happens next */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">מה קורה אחרי ששולחים?</h2>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      ✓
                    </div>
                    <div>
                      <h3 className="font-bold text-green-700">תרחיש טוב: הצד השני משלם</h3>
                      <p className="text-gray-600">
                        מעולה! חסכתם זמן, כסף ועוגמת נפש. ברכו את עצמכם ותמשיכו הלאה.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      ?
                    </div>
                    <div>
                      <h3 className="font-bold text-amber-700">תרחיש אפשרי: מציעים פשרה</h3>
                      <p className="text-gray-600">
                        שקלו את ההצעה. לפעמים לקבל 80% עכשיו עדיף על 100% בעוד חצי שנה.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      ✗
                    </div>
                    <div>
                      <h3 className="font-bold text-red-700">תרחיש פחות טוב: אין תגובה או דחייה</h3>
                      <p className="text-gray-600">
                        עכשיו אתם יודעים שצריך לתבוע. אתם מוכנים ויש לכם תיעוד שניסיתם.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Note */}
            <section className="mb-12">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex gap-4">
                  <Lightbulb className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-blue-800 mb-2">טיפ חשוב</h3>
                    <p className="text-blue-700">
                      מכתב התראה הוא לא חובה לפני תביעה קטנה, אבל הוא מומלץ מאוד. 
                      הוא יכול לחסוך לכם את כל התהליך, ואם לא - הוא יעזור לכם בבית המשפט.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-3">
                שלחתם מכתב ולא עזר?
              </h2>
              <p className="text-amber-100 mb-6 max-w-lg mx-auto">
                הגיע הזמן להגיש תביעה. ספרו לנו מה קרה 
                ונכין לכם כתב תביעה מקצועי תוך דקות.
              </p>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-3 rounded-xl font-bold hover:bg-orange-50 transition-colors"
              >
                התחילו להכין תביעה
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
