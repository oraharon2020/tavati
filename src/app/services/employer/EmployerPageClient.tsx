"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Briefcase, 
  CheckCircle, 
  AlertTriangle, 
  FileText,
  ArrowLeft,
  DollarSign,
  Shield,
  Scale
} from "lucide-react";

export default function EmployerPageClient() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <Header />
      <main className="flex-1">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-16">
        <div className="container mx-auto px-4">
          <Link href="/services" className="inline-flex items-center text-indigo-200 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 ml-2" />
            חזרה לכל סוגי התביעות
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
              <Briefcase className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              תביעות עבודה
            </h1>
          </div>
          <p className="text-xl text-indigo-100 max-w-2xl leading-relaxed">
            המעסיק חייב לך כסף? פוטרת בלי כלום? תנאים לא חוקיים? 
            בית הדין לעבודה עומד לרשותך.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Important Note */}
          <section className="mb-12">
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Scale className="w-6 h-6 text-blue-600" />
                איפה תובעים?
              </h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                תביעות עבודה לא מוגשות לתביעות קטנות הרגילות - אלא ל<strong>בית הדין לעבודה</strong>. 
                החדשות הטובות? ההליך דומה, לא צריך עורך דין, והשופטים מכירים טוב את החוקים.
              </p>
              <p className="text-slate-700 leading-relaxed">
                <strong>המערכת שלנו עוזרת לכם</strong> גם בתביעות עבודה - 
                אותו תהליך, אותה תוצאה מקצועית.
              </p>
            </div>
          </section>

          {/* Common Claims */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-indigo-600" />
              על מה אפשר לתבוע
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "שכר שלא שולם",
                  desc: "משכורות, בונוסים, עמלות, שעות נוספות שלא קיבלת.",
                },
                {
                  title: "פיצויי פיטורים",
                  desc: "פוטרת אחרי שנה? מגיע לך חודש משכורת על כל שנה.",
                },
                {
                  title: "הודעה מוקדמת",
                  desc: "פיטורים בלי התראה מראש? מגיע לך פיצוי.",
                },
                {
                  title: "חופשה ומחלה",
                  desc: "ימי חופשה שנצברו ולא שולמו, ימי מחלה שקוזזו.",
                },
                {
                  title: "הפרשות פנסיוניות",
                  desc: "המעסיק לא הפריש לפנסיה? זו עבירה וחוב כספי.",
                },
                {
                  title: "דמי הבראה",
                  desc: "עבדת יותר משנה? מגיע לך דמי הבראה.",
                },
                {
                  title: "הפליה והטרדה",
                  desc: "פוטרת בגלל הריון? הופלית? יש עילה לתביעה.",
                },
                {
                  title: "תנאים לא חוקיים",
                  desc: "עבדת בלי חוזה? קיבלת פחות ממינימום? תובעים.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-indigo-600" />
              הזכויות הבסיסיות שלך (שהרבה מעסיקים מתעלמים מהן)
            </h2>
            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4">
                  <h4 className="font-bold text-slate-800 mb-2">📝 חוזה עבודה</h4>
                  <p className="text-slate-600 text-sm">
                    המעסיק חייב לתת לך חוזה כתוב תוך 30 יום מתחילת העבודה. 
                    לא נתן? זה כשלעצמו עילה לתביעה.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <h4 className="font-bold text-slate-800 mb-2">💰 שכר מינימום</h4>
                  <p className="text-slate-600 text-sm">
                    נכון להיום: 5,880.02 ₪ לחודש או 32.30 ₪ לשעה. 
                    פחות מזה - לא חוקי.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <h4 className="font-bold text-slate-800 mb-2">⏰ שעות נוספות</h4>
                  <p className="text-slate-600 text-sm">
                    מעל 8.5 שעות ביום = 125% על השעתיים הראשונות, 150% אחרי. 
                    לא שילמו? תובעים.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <h4 className="font-bold text-slate-800 mb-2">🏖️ חופשה שנתית</h4>
                  <p className="text-slate-600 text-sm">
                    מינימום 12 יום בשנה (עולה עם הוותק). 
                    חופשה שלא נוצלה - חייבים לשלם עליה.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <h4 className="font-bold text-slate-800 mb-2">🏦 פנסיה</h4>
                  <p className="text-slate-600 text-sm">
                    המעסיק חייב להפריש לפנסיה אחרי 6 חודשים (או מיום 1 אם יש לך קרן קיימת).
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <h4 className="font-bold text-slate-800 mb-2">🤒 ימי מחלה</h4>
                  <p className="text-slate-600 text-sm">
                    צבירה של 1.5 יום לחודש. מהיום השני - 50%, מהשלישי - 100%.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Evidence */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-indigo-600" />
              מה צריך לתביעה
            </h2>
            <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
              <ul className="space-y-3">
                {[
                  "תלושי שכר - כל התלושים שיש לך (המעסיק חייב לתת עותק)",
                  "חוזה עבודה - אם קיבלת. אם לא - זו בעיה שלו",
                  "רישום שעות - אם יש לך (אפליקציה, יומן, דוחות נוכחות)",
                  "התכתבויות - מיילים, וואטסאפ עם המעסיק או HR",
                  "מכתב פיטורים/התפטרות - אם רלוונטי",
                  "אישורים רפואיים - אם פוטרת בזמן מחלה או הריון",
                  "עדים - עמיתים לעבודה שיכולים להעיד על התנאים",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-white rounded-xl p-4 mt-4">
                <h4 className="font-bold text-slate-800 mb-2">💡 אין לך תלושים?</h4>
                <p className="text-slate-600 text-sm">
                  המעסיק חייב לשמור אותם 7 שנים ולתת לך עותק על פי דרישה. 
                  אם הוא לא נותן - זה מחזק את התביעה שלך.
                </p>
              </div>
            </div>
          </section>

          {/* Calculation */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              📊 איך מחשבים מה מגיע לך
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">פיצויי פיטורים:</h4>
                  <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg">
                    משכורת אחרונה × מספר שנות עבודה<br/>
                    <span className="text-slate-500">
                      לדוגמה: 10,000 ₪ × 3 שנים = 30,000 ₪
                    </span>
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">חודש הודעה מוקדמת:</h4>
                  <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg">
                    יום לכל חודש עבודה בשנה הראשונה<br/>
                    2.5 ימים לכל חודש עבודה בשנה השנייה והשלישית<br/>
                    חודש שלם מהשנה הרביעית
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">פדיון חופשה:</h4>
                  <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg">
                    שכר יומי × ימי חופשה שנצברו ולא נוצלו
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">דמי הבראה:</h4>
                  <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg">
                    418 ₪ ליום × מספר ימי הבראה לפי ותק<br/>
                    <span className="text-slate-500">
                      (5 ימים בשנה הראשונה, עולה עם הוותק)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Employer Excuses */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              תירוצים שמעסיקים אוהבים
            </h2>
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100 space-y-4">
              <div className="border-b border-red-200 pb-4">
                <h4 className="font-bold text-slate-800 mb-1">&quot;אתה עובד עצמאי&quot;</h4>
                <p className="text-slate-600 text-sm">
                  <strong>לא תמיד.</strong> אם קבעו לך שעות, עבדת רק בשבילם, והשתמשת בציוד שלהם - 
                  אתה עובד, גם אם חתמת על &quot;חוזה קבלן&quot;.
                </p>
              </div>
              <div className="border-b border-red-200 pb-4">
                <h4 className="font-bold text-slate-800 mb-1">&quot;התפטרת, אין פיצויים&quot;</h4>
                <p className="text-slate-600 text-sm">
                  <strong>לא תמיד נכון.</strong> יש מצבים שגם התפטרות מזכה בפיצויים - 
                  הרעת תנאים, מעבר דירה, מצב בריאותי, לידה, ועוד.
                </p>
              </div>
              <div className="border-b border-red-200 pb-4">
                <h4 className="font-bold text-slate-800 mb-1">&quot;אין לי כסף לשלם&quot;</h4>
                <p className="text-slate-600 text-sm">
                  <strong>לא הבעיה שלך.</strong> חובות של המעסיק אליך הם חובות. 
                  אם אין לו - יש ביטוח פנסיוני, ואפשר לתבוע גם את הבעלים אישית.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">&quot;חתמת שאתה מוותר&quot;</h4>
                <p className="text-slate-600 text-sm">
                  <strong>לא תמיד תקף.</strong> ויתור על זכויות קוגנטיות (כמו פיצויים ושכר מינימום) 
                  הוא חסר תוקף, גם אם חתמת עליו.
                </p>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              ⏱️ כמה זמן יש לך?
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-700">שכר עבודה</span>
                  <span className="font-bold text-indigo-600">7 שנים</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-700">פיצויי פיטורים</span>
                  <span className="font-bold text-indigo-600">7 שנים</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-700">הפרשות לפנסיה</span>
                  <span className="font-bold text-indigo-600">7 שנים</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-700">הפליה/הטרדה</span>
                  <span className="font-bold text-indigo-600">שנה אחת</span>
                </div>
              </div>
              <p className="text-slate-600 mt-4 text-sm">
                <strong>שימו לב:</strong> גם אם יש 7 שנים - ככל שעובר זמן קשה יותר להוכיח. 
                תגישו כמה שיותר מהר.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-3">
                מגיע לך מה ששולם לך
              </h2>
              <p className="text-indigo-100 mb-6 max-w-md mx-auto">
                ספרו לנו מה קרה והמערכת תעזור לכם לחשב מה מגיע 
                ולבנות תביעה מקצועית לבית הדין לעבודה.
              </p>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
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
