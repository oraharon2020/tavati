"use client";

import Link from "next/link";
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  FileText,
  ArrowLeft,
  Clock,
  Target,
  Lightbulb
} from "lucide-react";

export default function InsurancePageClient() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <Link href="/services" className="inline-flex items-center text-blue-200 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 ml-2" />
            חזרה לכל סוגי התביעות
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              תביעה נגד חברת ביטוח
            </h1>
          </div>
          <p className="text-xl text-blue-100 max-w-2xl leading-relaxed">
            שילמת פרמיות שנים, וכשהגיע הרגע לקבל - פתאום יש בעיה? 
            לא אתה הראשון, ויש מה לעשות עם זה.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* The Reality */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              בואו נדבר תכל&apos;ס
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <p className="text-slate-700 leading-relaxed mb-4">
                חברות ביטוח בישראל דוחות בערך 15-20% מהתביעות. חלק באמת לא מוצדקות, 
                אבל הרבה נדחות רק כי אנשים לא יודעים להתמודד עם הבירוקרטיה או מוותרים באמצע.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                הסטטיסטיקה מדברת בעד עצמה: <strong>כ-70% מהתביעות הקטנות נגד חברות ביטוח 
                מסתיימות בזכות התובע</strong> - או בפסיקה או בפשרה. למה? כי לחברת הביטוח 
                יקר יותר לשלוח עורך דין לדיון מאשר לשלם לך את מה שמגיע.
              </p>
              <p className="text-slate-700 leading-relaxed">
                אז לפני שמתייאשים - כדאי לנסות.
              </p>
            </div>
          </section>

          {/* Common Cases */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              מקרים נפוצים שאפשר לתבוע עליהם
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "תאונת רכב שדחו",
                  desc: "טענו לחריגה מהפוליסה, אשמה תורמת, או פשוט \"אין כיסוי\"."
                },
                {
                  title: "ביטוח בריאות/שיניים",
                  desc: "טיפול שהובטח בפוליסה ופתאום יש תנאים שלא הזכירו."
                },
                {
                  title: "נזקי דירה",
                  desc: "נזילה, שריפה קטנה, גניבה - והשמאי העריך נמוך מדי."
                },
                {
                  title: "ביטוח נסיעות",
                  desc: "טיסה בוטלה, מזוודה אבדה, ואומרים שזה לא מכוסה."
                },
                {
                  title: "ביטוח חיים/מחלה",
                  desc: "גילוי מחלה ודחיית תביעה בגלל \"מצב קודם\"."
                },
                {
                  title: "אובדן כושר עבודה",
                  desc: "לא מכירים בנכות או טוענים שאתה יכול לעבוד."
                },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* What You Need */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              מה צריך להכין לתביעה
            </h2>
            <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
              <ul className="space-y-3">
                {[
                  "הפוליסה עצמה (גם הקטן קטן, כן)",
                  "כל ההתכתבויות עם חברת הביטוח - מיילים, מכתבים, הקלטות שיחות",
                  "מכתב הדחייה או ההצעה הנמוכה שקיבלת",
                  "חוות דעת שמאי או מומחה (אם יש)",
                  "קבלות, חשבוניות, הוכחות על הנזק",
                  "תיעוד של הנזק - תמונות, סרטונים",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Tips */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              טיפים מניסיון
            </h2>
            <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100 space-y-4">
              <div>
                <h4 className="font-bold text-slate-800 mb-1">📌 תמיד תקליט שיחות</h4>
                <p className="text-slate-600 text-sm">
                  לפי חוק, מותר להקליט שיחה שאתה צד לה. תודיע בהתחלה &quot;אני מקליט לצרכי 
                  תיעוד&quot; - ותראה איך פתאום מתחילים להתייחס אליך אחרת.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">📌 אל תחתום על ויתור מהר</h4>
                <p className="text-slate-600 text-sm">
                  הרבה פעמים יציעו לך פשרה מהירה בתנאי שתחתום על ויתור תביעות. 
                  קח את ההצעה, אמור שאתה צריך לחשוב, ותבדוק מה באמת מגיע לך.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">📌 פנה לממונה על שוק ההון</h4>
                <p className="text-slate-600 text-sm">
                  לפני תביעה, שווה להגיש תלונה לממונה על שוק ההון. זה בחינם, ולפעמים 
                  זה לבד פותר את הבעיה. גם אם לא - זה מראה לשופט שניסית.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">📌 תעודות זהות של הפוליסה</h4>
                <p className="text-slate-600 text-sm">
                  צטט סעיפים ספציפיים מהפוליסה בתביעה. &quot;על פי סעיף 4.2.1 בפוליסה...&quot; 
                  נשמע הרבה יותר משכנע מ&quot;הבטיחו לי בטלפון&quot;.
                </p>
              </div>
            </div>
          </section>

          {/* Warning */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              מתי כן צריך עורך דין
            </h2>
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
              <p className="text-slate-700 mb-4">
                תביעות קטנות מוגבלות ל-35,000 ₪. אם הנזק שלך גדול יותר, יש שתי אפשרויות:
              </p>
              <ul className="space-y-2 text-slate-700">
                <li>• <strong>לוותר על ההפרש</strong> - תובע 35,000 ₪ גם אם הנזק 50,000 ₪, 
                  ומוותר על השאר. לפעמים שווה את זה.</li>
                <li>• <strong>ללכת לבית משפט רגיל</strong> - עם עורך דין, על מלוא הסכום. 
                  יקר יותר ואורך יותר, אבל אם מדובר בסכומים גדולים - שווה.</li>
              </ul>
              <p className="text-slate-700 mt-4">
                גם אם יש לך מקרה מורכב מאוד (למשל מחלוקת רפואית מסובכת), שווה 
                להתייעץ עם עורך דין לפני שמגישים.
              </p>
            </div>
          </section>

          {/* Timeline */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-600" />
              כמה זמן זה לוקח?
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">1</div>
                  <div>
                    <div className="font-bold text-slate-800">הכנת התביעה</div>
                    <div className="text-slate-600 text-sm">שעה-שעתיים עם המערכת שלנו</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">2</div>
                  <div>
                    <div className="font-bold text-slate-800">הגשה וקביעת דיון</div>
                    <div className="text-slate-600 text-sm">1-3 חודשים (תלוי בעומס בבית המשפט)</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">3</div>
                  <div>
                    <div className="font-bold text-slate-800">הדיון עצמו</div>
                    <div className="text-slate-600 text-sm">בדרך כלל דיון אחד של 20-40 דקות</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">✓</div>
                  <div>
                    <div className="font-bold text-slate-800">פסק דין או פשרה</div>
                    <div className="text-slate-600 text-sm">רוב המקרים נגמרים בפשרה לפני או בדיון</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-3">
                מוכנים להתחיל?
              </h2>
              <p className="text-blue-100 mb-6 max-w-md mx-auto">
                ספרו לנו מה קרה, והמערכת תבנה לכם תביעה מותאמת. 
                זה בחינם, ולוקח כמה דקות.
              </p>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors"
              >
                התחילו לבנות את התביעה
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
