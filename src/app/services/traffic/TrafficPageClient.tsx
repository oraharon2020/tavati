"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Car, 
  CheckCircle, 
  AlertTriangle, 
  Camera,
  ArrowLeft,
  FileText,
  Clock,
  Users
} from "lucide-react";

export default function TrafficPageClient() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <Header />
      <main className="flex-1">
      {/* Hero */}
      <div className="bg-gradient-to-br from-red-600 to-red-800 text-white py-16">
        <div className="container mx-auto px-4">
          <Link href="/services" className="inline-flex items-center text-red-200 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 ml-2" />
            חזרה לכל סוגי התביעות
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
              <Car className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              תביעות תאונות דרכים
            </h1>
          </div>
          <p className="text-xl text-red-100 max-w-2xl leading-relaxed">
            נכנסו לך? נכנסת למישהו ומתווכחים על האשמה? 
            הביטוח לא משלם? יש דרך לפתור את זה.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Important Note */}
          <section className="mb-12">
            <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
              <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                חשוב לדעת
              </h2>
              <p className="text-slate-700 leading-relaxed">
                תביעות קטנות מתאימות ל<strong>נזקי רכוש בלבד</strong> - פחחות, נזק לרכב, 
                ירידת ערך. אם יש לך <strong>נזקי גוף</strong> (פציעות), גם קלים - 
                מומלץ להתייעץ עם עורך דין לפני שעושים צעד. תביעות גוף הן עולם אחר.
              </p>
            </div>
          </section>

          {/* When to Sue */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-red-600" />
              את מי תובעים?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-3 text-lg">אפשרות 1: את הנהג הפוגע</h3>
                <p className="text-slate-600 text-sm mb-3">
                  תובעים את הנהג שגרם לתאונה באופן אישי. הוא יצטרך להגן על עצמו 
                  או לגרור את הביטוח שלו.
                </p>
                <ul className="text-slate-600 text-sm space-y-1">
                  <li>✓ פשוט יותר</li>
                  <li>✓ לא צריך להתמודד עם חברת ביטוח</li>
                  <li>✗ הנהג עלול לא להגיע או לא לשלם</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-3 text-lg">אפשרות 2: את חברת הביטוח שלו</h3>
                <p className="text-slate-600 text-sm mb-3">
                  תובעים ישירות את הביטוח של הצד השני. 
                  צריך לדעת מי המבטח שלו.
                </p>
                <ul className="text-slate-600 text-sm space-y-1">
                  <li>✓ הביטוח ישלם אם תזכה</li>
                  <li>✓ יותר מקצועי</li>
                  <li>✗ הם ישלחו עורך דין</li>
                </ul>
              </div>
            </div>
            <p className="text-slate-600 mt-4 text-center">
              💡 <strong>טיפ:</strong> אפשר לתבוע את שניהם ביחד. ככה מבטיחים שמישהו ישלם.
            </p>
          </section>

          {/* At the Scene */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Camera className="w-6 h-6 text-red-600" />
              מה לעשות ברגע התאונה (אם עדיין לא קרה)
            </h2>
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">1</span>
                  <div>
                    <span className="font-bold text-slate-800">צלם הכל</span>
                    <p className="text-slate-600 text-sm">
                      את שני הרכבים, את הנזקים, את הסביבה, את לוחיות הרישוי, את תעודת הזהות 
                      והרישיון של הנהג השני, את תעודת הביטוח שלו.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">2</span>
                  <div>
                    <span className="font-bold text-slate-800">קח פרטים של עדים</span>
                    <p className="text-slate-600 text-sm">
                      שם וטלפון של כל מי שראה. עדים הם זהב בבית משפט.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">3</span>
                  <div>
                    <span className="font-bold text-slate-800">אל תודה באשמה</span>
                    <p className="text-slate-600 text-sm">
                      גם אם אתה חושב שזה באשמתך - אל תגיד את זה. תן לביטוח ולמומחים להחליט.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">4</span>
                  <div>
                    <span className="font-bold text-slate-800">מלא טופס תאונה</span>
                    <p className="text-slate-600 text-sm">
                      הטופס הכחול שאמור להיות ברכב. אם אין - צלם את הפרטים והשלם אחר כך.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">5</span>
                  <div>
                    <span className="font-bold text-slate-800">דווח לביטוח שלך</span>
                    <p className="text-slate-600 text-sm">
                      גם אם הצד השני אשם - תדווח לביטוח שלך. הם יעזרו לך לתבוע.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          {/* Evidence Needed */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-red-600" />
              מה צריך לתביעה
            </h2>
            <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
              <ul className="space-y-3">
                {[
                  "תמונות מזירת התאונה - הרכבים, הנזקים, הסביבה",
                  "טופס תאונה או דוח משטרה (אם היה)",
                  "פרטי הנהג השני - שם, ת.ז., טלפון, כתובת",
                  "פרטי הביטוח של הצד השני - חברה ומספר פוליסה",
                  "הצעות מחיר לתיקון - מ-2-3 מוסכים שונים",
                  "חוות דעת שמאי (מומלץ מאוד) - קובע את גובה הנזק",
                  "אישור על ירידת ערך (אם רלוונטי) - רכב חדש שניזוק",
                  "קבלות על הוצאות - גרירה, רכב חלופי, וכו'",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Appraiser */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              🔍 שמאי רכב - כן או לא?
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <p className="text-slate-700 leading-relaxed mb-4">
                שמאי עולה כסף (300-800 ₪), אבל זו בדרך כלל השקעה טובה. למה?
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-bold text-slate-800 mb-2">מתי כדאי:</h4>
                  <ul className="text-slate-600 text-sm space-y-1">
                    <li>• נזק מעל 5,000 ₪</li>
                    <li>• מחלוקת על גובה הנזק</li>
                    <li>• רכב יחסית חדש (ירידת ערך)</li>
                    <li>• הצד השני מתכחש לאשמה</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-bold text-slate-800 mb-2">אפשר בלי:</h4>
                  <ul className="text-slate-600 text-sm space-y-1">
                    <li>• נזק קטן וברור</li>
                    <li>• יש הצעות מחיר ברורות</li>
                    <li>• הצד השני מודה באשמה</li>
                    <li>• כבר תיקנת ויש קבלה</li>
                  </ul>
                </div>
              </div>
              <p className="text-slate-700 mt-4">
                <strong>חשוב:</strong> אם תזכה בתביעה, תוכל לתבוע גם את עלות השמאי.
              </p>
            </div>
          </section>

          {/* Calculating Damages */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              💰 מה אפשר לתבוע
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-700">עלות תיקון</span>
                  <span className="font-bold text-red-600">לפי הצעות מחיר/שמאי</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-700">ירידת ערך</span>
                  <span className="font-bold text-red-600">2-10% משווי הרכב</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-700">רכב חלופי</span>
                  <span className="font-bold text-red-600">לפי קבלות</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-700">גרירה</span>
                  <span className="font-bold text-red-600">לפי קבלות</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-700">עלות שמאי</span>
                  <span className="font-bold text-red-600">לפי קבלה</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-700">עוגמת נפש</span>
                  <span className="font-bold text-red-600">500-2,000 ₪</span>
                </div>
              </div>
            </div>
          </section>

          {/* Fault Issues */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
              מה אם יש מחלוקת על האשמה?
            </h2>
            <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100">
              <p className="text-slate-700 leading-relaxed mb-4">
                זה המצב הנפוץ - כל צד חושב שהשני אשם. מה עושים?
              </p>
              <div className="space-y-3">
                <div className="bg-white rounded-xl p-4">
                  <h4 className="font-bold text-slate-800 mb-1">תיעוד הוא המלך</h4>
                  <p className="text-slate-600 text-sm">
                    תמונות, עדים, דוח משטרה - כל מה שיכול להוכיח את הגרסה שלך.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <h4 className="font-bold text-slate-800 mb-1">אשמה תורמת</h4>
                  <p className="text-slate-600 text-sm">
                    לפעמים השופט יקבע שגם אתה אשם ב-30% ויפחית את הפיצוי בהתאם. 
                    זה לא סוף העולם.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <h4 className="font-bold text-slate-800 mb-1">הלכות פסוקות</h4>
                  <p className="text-slate-600 text-sm">
                    יש כללים ברורים - מי שפגע מאחור בדרך כלל אשם, מי שיצא מחניה אשם, 
                    וכו&apos;. השופט מכיר את הכללים.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-red-600" />
              כמה זמן יש לך?
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <p className="text-slate-700 leading-relaxed mb-4">
                התיישנות בתאונות דרכים (נזקי רכוש): <strong>7 שנים</strong>. 
                אבל אל תחכו - עדים נעלמים, זיכרונות נשכחים, מסמכים אובדים.
              </p>
              <p className="text-slate-700 leading-relaxed">
                <strong>המלצה:</strong> אם עברו 3-6 חודשים ולא הצלחתם להגיע להסדר - 
                תגישו תביעה. תוך כדי התהליך עדיין אפשר להגיע לפשרה.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-3">
                בואו נעזור לכם לקבל את מה שמגיע
              </h2>
              <p className="text-red-100 mb-6 max-w-md mx-auto">
                ספרו לנו מה קרה והמערכת תעזור לכם לבנות תביעה 
                מסודרת עם כל הפרטים הנדרשים.
              </p>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-3 rounded-xl font-bold hover:bg-red-50 transition-colors"
              >
                התחילו עכשיו
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </section>

        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
