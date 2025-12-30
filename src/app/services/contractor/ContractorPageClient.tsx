"use client";

import Link from "next/link";
import { 
  Wrench, 
  CheckCircle, 
  AlertTriangle, 
  FileText,
  ArrowLeft,
  Clock,
  Calculator,
  MessageSquare
} from "lucide-react";

export default function ContractorPageClient() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-600 to-orange-800 text-white py-16">
        <div className="container mx-auto px-4">
          <Link href="/services" className="inline-flex items-center text-orange-200 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 ml-2" />
            חזרה לכל סוגי התביעות
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
              <Wrench className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              תביעה נגד קבלן או בעל מקצוע
            </h1>
          </div>
          <p className="text-xl text-orange-100 max-w-2xl leading-relaxed">
            שיפוץ שהפך לסיוט? עבודה שלא נגמרה? 
            כספים שנעלמו? הגיע הזמן לקבל בחזרה את מה שמגיע לכם.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Reality Check */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-orange-600" />
              נשמע מוכר?
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <p className="text-slate-700 leading-relaxed mb-4">
                כולנו מכירים את הסיפור: מתחילים שיפוץ עם הבטחות גדולות, 
                לוח זמנים &quot;ברזל&quot;, ומחיר שנראה סביר. חודשיים אחרי - 
                הדירה הפוכה, הקבלן נעלם כל יומיים, והחשבון תפח פי שניים.
              </p>
              <p className="text-slate-700 leading-relaxed">
                החדשות הטובות: תביעות נגד קבלנים ובעלי מקצוע הן מהנפוצות בתביעות קטנות, 
                ויש לשופטים ניסיון רב איתן. אם יש לכם תיעוד בסיסי - הסיכויים טובים.
              </p>
            </div>
          </section>

          {/* Types of Claims */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-orange-600" />
              על מה אפשר לתבוע
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "עבודה לקויה",
                  desc: "ריצוף עקום, צבע שמתקלף, אינסטלציה שדולפת - עבודה שלא עומדת בסטנדרט."
                },
                {
                  title: "אי-השלמת עבודה",
                  desc: "הקבלן נעלם באמצע, לא גמר את מה שהתחייב, השאיר בלאגן."
                },
                {
                  title: "חריגה מהמחיר",
                  desc: "הסכמתם על X ופתאום מבקשים X+20,000. בלי הסכמה מראש - לא חייבים."
                },
                {
                  title: "איחורים משמעותיים",
                  desc: "חודש הפך לשישה? אם יש לכם נזקים מהעיכוב - אפשר לתבוע."
                },
                {
                  title: "נזק לרכוש",
                  desc: "שברו משהו, הרסו ריהוט, גרמו נזק לשכנים? זה על הקבלן."
                },
                {
                  title: "שימוש בחומרים זולים",
                  desc: "הבטיח שיש ושילמתם על שיש - וגיליתם שזה שיש מזויף? זו הונאה."
                },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Documentation */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              התיעוד שיעשה את ההבדל
            </h2>
            <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">📝 חוזה או הצעת מחיר</h4>
                  <p className="text-slate-600 text-sm">
                    גם אם זה היה רק SMS או וואטסאפ עם מחיר - זה חוזה. 
                    אין חוזה כתוב? גם עדות בעל פה תקפה, רק יותר קשה להוכיח.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">📸 תמונות ווידאו</h4>
                  <p className="text-slate-600 text-sm">
                    לפני, אחרי, ובמהלך העבודה. צלמו הכל - גם את הבעיות וגם את ה&quot;פתרונות&quot; הגרועים. 
                    תמונה אחת שווה אלף מילים, במיוחד בבית משפט.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">💬 כל התקשורת</h4>
                  <p className="text-slate-600 text-sm">
                    שמרו את כל הוואטסאפים, מיילים, SMS. גם &quot;אני אגיע מחר&quot; 
                    שנכתב 47 פעמים מוכיח דפוס של עיכובים.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">💰 קבלות ותשלומים</h4>
                  <p className="text-slate-600 text-sm">
                    העברות בנקאיות, צ&apos;קים, קבלות (אם קיבלתם). 
                    אם שילמתם במזומן בלי קבלה - תעדו לפחות מתי וכמה.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">🔧 חוות דעת מקצועית</h4>
                  <p className="text-slate-600 text-sm">
                    אם אפשר - תביאו בעל מקצוע אחר שיעריך את העבודה הגרועה בכתב. 
                    זה לא חובה, אבל מאוד עוזר.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Calculate Damages */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Calculator className="w-6 h-6 text-orange-600" />
              איך מחשבים את הנזק
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <p className="text-slate-700 leading-relaxed mb-4">
                החישוב צריך להיות הגיוני ומגובה. הנה הקטגוריות העיקריות:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <span className="font-bold text-orange-600">1.</span>
                  <div>
                    <span className="font-bold text-slate-800">עלות תיקון:</span>
                    <span className="text-slate-600 text-sm mr-2">
                      הביאו הצעות מחיר מ-2-3 בעלי מקצוע אחרים לתיקון הבעיות
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <span className="font-bold text-orange-600">2.</span>
                  <div>
                    <span className="font-bold text-slate-800">החזר על עבודה לא גמורה:</span>
                    <span className="text-slate-600 text-sm mr-2">
                      שילמתם על משהו שלא נעשה? תחשבו את הפרופורציה
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <span className="font-bold text-orange-600">3.</span>
                  <div>
                    <span className="font-bold text-slate-800">נזקים נגררים:</span>
                    <span className="text-slate-600 text-sm mr-2">
                      נאלצתם לשכור מקום אחר? לקנות ציוד חדש? זה גם נחשב
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <span className="font-bold text-orange-600">4.</span>
                  <div>
                    <span className="font-bold text-slate-800">עוגמת נפש:</span>
                    <span className="text-slate-600 text-sm mr-2">
                      סבלתם? זה שווה משהו - בדרך כלל 2,000-5,000 ₪ בתביעות קטנות
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Common Excuses */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              תירוצים שקבלנים אוהבים (ומה לענות)
            </h2>
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100 space-y-4">
              <div className="border-b border-red-200 pb-4">
                <h4 className="font-bold text-slate-800 mb-1">&quot;אתה שינית את הדרישות באמצע&quot;</h4>
                <p className="text-slate-600 text-sm">
                  <strong>תשובה:</strong> אם היו שינויים - הם צריכים להיות מתועדים ומוסכמים. 
                  אחרת, ההסכם המקורי הוא הקובע.
                </p>
              </div>
              <div className="border-b border-red-200 pb-4">
                <h4 className="font-bold text-slate-800 mb-1">&quot;החומרים התייקרו&quot;</h4>
                <p className="text-slate-600 text-sm">
                  <strong>תשובה:</strong> אם נתן הצעת מחיר סגורה - זו הבעיה שלו, לא שלך. 
                  שינוי מחיר צריך הסכמה מראש.
                </p>
              </div>
              <div className="border-b border-red-200 pb-4">
                <h4 className="font-bold text-slate-800 mb-1">&quot;זה בגלל הפועלים שלי&quot;</h4>
                <p className="text-slate-600 text-sm">
                  <strong>תשובה:</strong> הקבלן אחראי על העובדים שלו. הבעיות שלו 
                  עם הצוות הן לא הבעיות שלך.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">&quot;אתה לא מבין בעבודה&quot;</h4>
                <p className="text-slate-600 text-sm">
                  <strong>תשובה:</strong> לא צריך להיות מומחה כדי לראות שמשהו עקום, 
                  דולף או לא גמור. השופט גם לא מומחה.
                </p>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-orange-600" />
              מתי לתבוע?
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">כשהוא מפסיק להגיב</span>
                    <p className="text-slate-600 text-sm">
                      נעלם לכמה ימים? קורה. נעלם לשבועיים ולא עונה לטלפון? הגיע הזמן לפעול.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">אחרי שנתתם צ&apos;אנס לתקן</span>
                    <p className="text-slate-600 text-sm">
                      שלחו הודעה בכתב עם דרישה לתיקון ומועד אחרון. אם הוא לא תיקן - 
                      יש לכם הוכחה שניסיתם.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">לפני שעבר יותר מדי זמן</span>
                    <p className="text-slate-600 text-sm">
                      ככל שעובר זמן, קשה יותר להוכיח. אל תחכו שנה - פעלו תוך כמה חודשים.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Before You Sue */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              💡 לפני שמגישים תביעה
            </h2>
            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
              <ol className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="font-bold text-orange-600">1.</span>
                  <span>שלחו מכתב התראה (רצוי בדואר רשום או מייל) עם דרישה ברורה ומועד אחרון</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-orange-600">2.</span>
                  <span>תעדו את כל הבעיות עם תמונות ווידאו</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-orange-600">3.</span>
                  <span>קבלו הצעות מחיר לתיקון מבעלי מקצוע אחרים</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-orange-600">4.</span>
                  <span>העריכו אם זה שווה את המאמץ - תביעות קטנות מוגבלות ל-35,000 ₪</span>
                </li>
              </ol>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-3">
                הגיע הזמן לקבל את מה שמגיע לכם
              </h2>
              <p className="text-orange-100 mb-6 max-w-md mx-auto">
                ספרו לנו מה קרה, והמערכת תעזור לכם לבנות תביעה 
                מקצועית שתגרום לקבלן להתחרט.
              </p>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-3 rounded-xl font-bold hover:bg-orange-50 transition-colors"
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
