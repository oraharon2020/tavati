"use client";

import Link from "next/link";
import { 
  ShoppingBag, 
  CheckCircle, 
  AlertTriangle, 
  FileText,
  ArrowLeft,
  Truck,
  CreditCard,
  RotateCcw
} from "lucide-react";

export default function ConsumerPageClient() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-pink-600 to-pink-800 text-white py-16">
        <div className="container mx-auto px-4">
          <Link href="/services" className="inline-flex items-center text-pink-200 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 ml-2" />
            חזרה לכל סוגי התביעות
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              תביעות צרכניות
            </h1>
          </div>
          <p className="text-xl text-pink-100 max-w-2xl leading-relaxed">
            מוצר שהתקלקל אחרי חודש, חנות שלא מכבדת החזרות, 
            אחריות שפתאום &quot;לא חלה&quot;? יש חוק, ויש זכויות.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Consumer Rights */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-pink-600" />
              הזכויות שלך לפי חוק הגנת הצרכן
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <p className="text-slate-700 leading-relaxed mb-4">
                חוק הגנת הצרכן בישראל הוא אחד החזקים בעולם. הבעיה? 
                רוב האנשים לא מכירים את הזכויות שלהם, והחנויות סומכות על זה.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <h4 className="font-bold text-slate-800 mb-2">✓ 14 יום להחזרה</h4>
                  <p className="text-slate-600 text-sm">
                    ברכישה מרחוק (אינטרנט, טלפון) - יש לך 14 יום לבטל בלי סיבה. 
                    בחנות פיזית - רק אם יש פגם.
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <h4 className="font-bold text-slate-800 mb-2">✓ שנה אחריות לפחות</h4>
                  <p className="text-slate-600 text-sm">
                    על כל מוצר חשמלי/אלקטרוני יש חובת אחריות של שנה לפחות. 
                    לא &quot;30 יום&quot;, לא &quot;3 חודשים&quot;.
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <h4 className="font-bold text-slate-800 mb-2">✓ תיקון תוך זמן סביר</h4>
                  <p className="text-slate-600 text-sm">
                    אם לקחו לתיקון - צריך להחזיר תוך 14 יום. 
                    יותר מזה? אפשר לדרוש מוצר חלופי או החזר.
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <h4 className="font-bold text-slate-800 mb-2">✓ 3 תיקונים = החלפה</h4>
                  <p className="text-slate-600 text-sm">
                    אם המוצר תוקן 3 פעמים על אותה תקלה - 
                    מגיע לך מוצר חדש או החזר מלא.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Common Cases */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-pink-600" />
              מקרים נפוצים
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: "מכשיר חשמלי שהתקלקל",
                  desc: "טלפון, מחשב, מקרר, מכונת כביסה - כל דבר שמפסיק לעבוד בתקופת האחריות.",
                  tip: "שמור את הקבלה ואת תעודת האחריות. בלי קבלה - קשה יותר אבל לא בלתי אפשרי."
                },
                {
                  title: "רהיטים פגומים",
                  desc: "ספה שנשברה, ארון שהגיע שבור, שולחן שלא תואם לתמונה.",
                  tip: "צלם מיד כשמקבלים. אם יש פגם - תעד ושלח מייל באותו יום."
                },
                {
                  title: "משלוח שלא הגיע",
                  desc: "שילמת ולא קיבלת, או שההזמנה הגיעה חסרה.",
                  tip: "יש לך זכות לבטל ולקבל החזר מלא אם המשלוח מתעכב מעבר למובטח."
                },
                {
                  title: "מוצר לא כפי שפורסם",
                  desc: "קנית משהו והוא שונה מהתיאור באתר או מהתמונה.",
                  tip: "צלם מסך של הפרסום המקורי לפני שמתלוננים - חנויות אוהבות לשנות."
                },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm mb-2">{item.desc}</p>
                  <p className="text-pink-600 text-sm">💡 {item.tip}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Online Shopping */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Truck className="w-6 h-6 text-pink-600" />
              קניות באינטרנט - זכויות מיוחדות
            </h2>
            <div className="bg-pink-50 rounded-2xl p-6 border border-pink-100">
              <p className="text-slate-700 leading-relaxed mb-4">
                כשקונים באינטרנט יש הגנות נוספות. החוק מכיר בכך שלא ראית את המוצר לפני הקנייה:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <RotateCcw className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">14 יום לביטול:</span>
                    <span className="text-slate-600 text-sm mr-2">
                      אפשר להחזיר גם אם המוצר תקין. החנות יכולה לגבות עד 5% דמי ביטול או 100 ₪ - הנמוך מביניהם.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">החזר תוך 14 יום:</span>
                    <span className="text-slate-600 text-sm mr-2">
                      אם ביטלת עסקה - החנות חייבת להחזיר את הכסף תוך 14 יום. לא חודש, לא &quot;כשנוכל&quot;.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">מידע מלא:</span>
                    <span className="text-slate-600 text-sm mr-2">
                      האתר חייב להציג מחיר סופי, תנאי משלוח, ומדיניות החזרות. חסר מידע? זו הפרה.
                    </span>
                  </div>
                </li>
              </ul>
              <div className="bg-white rounded-xl p-4 mt-4">
                <h4 className="font-bold text-slate-800 mb-2">⚠️ חריגים:</h4>
                <p className="text-slate-600 text-sm">
                  יש מוצרים שאי אפשר להחזיר: תוכנה שנפתחה, מוצרים בהזמנה אישית, 
                  מזון, וכרטיסים לאירועים. אבל רוב המוצרים - כן.
                </p>
              </div>
            </div>
          </section>

          {/* Evidence */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              מה צריך לתביעה
            </h2>
            <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
              <ul className="space-y-3">
                {[
                  "קבלה או אישור הזמנה - הוכחה שקנית ומתי",
                  "תמונות של המוצר הפגום - לפני ואחרי (אם רלוונטי)",
                  "צילומי מסך של הפרסום המקורי - התיאור, המחיר, ההבטחות",
                  "התכתבויות עם החנות - מיילים, וואטסאפ, צ'אט באתר",
                  "פניות לשירות לקוחות - תאריכים ומספרי פניה",
                  "חוות דעת טכנית (אם יש) - טכנאי שבדק ואמר שזה פגום",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Store Excuses */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              תירוצים שחנויות אוהבות (ולמה הם שטויות)
            </h2>
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100 space-y-4">
              <div className="border-b border-red-200 pb-4">
                <h4 className="font-bold text-slate-800 mb-1">&quot;אין החזרות על מבצע&quot;</h4>
                <p className="text-slate-600 text-sm">
                  <strong>שטות.</strong> מבצע או לא מבצע - הזכויות שלך לפי חוק לא משתנות. 
                  מוצר פגום מוחזר גם אם קנית אותו ב-50% הנחה.
                </p>
              </div>
              <div className="border-b border-red-200 pb-4">
                <h4 className="font-bold text-slate-800 mb-1">&quot;צריך את האריזה המקורית&quot;</h4>
                <p className="text-slate-600 text-sm">
                  <strong>לא בהכרח.</strong> לפגמים באחריות - לא צריך אריזה. 
                  לביטול עסקה באינטרנט - המוצר צריך להיות במצב סביר, לא באריזה סגורה.
                </p>
              </div>
              <div className="border-b border-red-200 pb-4">
                <h4 className="font-bold text-slate-800 mb-1">&quot;תתקשר ליבואן&quot;</h4>
                <p className="text-slate-600 text-sm">
                  <strong>לא.</strong> החנות שמכרה לך את המוצר אחראית. 
                  היא יכולה להתחשבן עם היבואן, אבל זו לא הבעיה שלך.
                </p>
              </div>
              <div className="border-b border-red-200 pb-4">
                <h4 className="font-bold text-slate-800 mb-1">&quot;זה שימוש לא נכון&quot;</h4>
                <p className="text-slate-600 text-sm">
                  <strong>שיוכיחו.</strong> נטל ההוכחה על החנות, לא עליך. 
                  אם הם טוענים שעשית משהו לא בסדר - שיביאו הוכחות.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">&quot;תעשה צ&apos;ארג&apos;בק&quot;</h4>
                <p className="text-slate-600 text-sm">
                  <strong>זה אפשרות, אבל לא תמיד.</strong> צ&apos;ארג&apos;בק דרך חברת האשראי עובד 
                  רק ב-18 החודשים הראשונים ובתנאים מסוימים. תביעה קטנה עובדת תמיד.
                </p>
              </div>
            </div>
          </section>

          {/* Step by Step */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              📋 השלבים לפני תביעה
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <ol className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-slate-800">פנו לחנות בכתב</h4>
                    <p className="text-slate-600 text-sm">
                      מייל או טופס באתר. תארו את הבעיה ומה אתם רוצים (החלפה/החזר).
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-slate-800">תנו להם זמן סביר</h4>
                    <p className="text-slate-600 text-sm">
                      שבוע-שבועיים להגיב. אם לא עונים או דוחים - יש לכם הוכחה שניסיתם.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-slate-800">שלחו מכתב התראה</h4>
                    <p className="text-slate-600 text-sm">
                      מכתב פורמלי עם התראה שתפנו לבית משפט. לפעמים זה לבד פותר.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold shrink-0">4</div>
                  <div>
                    <h4 className="font-bold text-slate-800">הגישו תביעה</h4>
                    <p className="text-slate-600 text-sm">
                      אם שום דבר לא עזר - זה הזמן לתביעות קטנות.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-3">
                מגיע לך יותר טוב
              </h2>
              <p className="text-pink-100 mb-6 max-w-md mx-auto">
                ספרו לנו מה קרה והמערכת תעזור לכם לבנות תביעה 
                שתגרום לחנות להתייחס אליכם כמו שמגיע.
              </p>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 bg-white text-pink-600 px-8 py-3 rounded-xl font-bold hover:bg-pink-50 transition-colors"
              >
                התחילו עכשיו
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
