"use client";

import Link from "next/link";
import { 
  Heart, 
  CheckCircle, 
  AlertTriangle, 
  FileText,
  ArrowLeft,
  Stethoscope,
  Building,
  Clock
} from "lucide-react";

export default function MedicalPageClient() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-16">
        <div className="container mx-auto px-4">
          <Link href="/services" className="inline-flex items-center text-teal-200 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 ml-2" />
            חזרה לכל סוגי התביעות
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
              <Heart className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              תביעות שירותי בריאות
            </h1>
          </div>
          <p className="text-xl text-teal-100 max-w-2xl leading-relaxed">
            קופת החולים מתחמקת, רופא שיניים שעשה עבודה גרועה, 
            טיפול שהובטח ולא התקבל. גם על בריאות אפשר לתבוע.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Important Disclaimer */}
          <section className="mb-12">
            <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
              <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                הבהרה חשובה
              </h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                <strong>רשלנות רפואית מורכבת</strong> (טעות בניתוח, אבחון שגוי שגרם לנזק חמור) 
                דורשת בדרך כלל עורך דין ומומחים רפואיים. תביעות קטנות מתאימות יותר למקרים כמו:
              </p>
              <ul className="text-slate-600 space-y-1">
                <li>• סירוב לאשר טיפול/תרופה שמגיע לך</li>
                <li>• טיפול שיניים לקוי</li>
                <li>• חיובים לא מוצדקים</li>
                <li>• המתנה ארוכה מדי לתור</li>
                <li>• אי-כיבוד התחייבויות של ביטוח משלים</li>
              </ul>
            </div>
          </section>

          {/* Types of Claims */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Building className="w-6 h-6 text-teal-600" />
              נגד מי תובעים ועל מה
            </h2>
            <div className="space-y-6">
              {/* Health Funds */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-3 text-lg flex items-center gap-2">
                  <Building className="w-5 h-5 text-teal-600" />
                  קופות חולים (מכבי, כללית, מאוחדת, לאומית)
                </h3>
                <ul className="text-slate-600 text-sm space-y-2">
                  <li>• <strong>דחיית טיפול או תרופה</strong> שנמצאת בסל הבריאות</li>
                  <li>• <strong>המתנה ארוכה מדי</strong> לתור מומחה (יש תקנות)</li>
                  <li>• <strong>סירוב להחזר</strong> על טיפול שבוצע בחו&quot;ל או באופן פרטי</li>
                  <li>• <strong>בעיות בביטוח משלים</strong> - שילמתם ולא מקבלים שירות</li>
                  <li>• <strong>אי מתן מידע</strong> על זכויות או אפשרויות טיפול</li>
                </ul>
              </div>

              {/* Dentists */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-3 text-lg flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-teal-600" />
                  רופאי שיניים ומרפאות
                </h3>
                <ul className="text-slate-600 text-sm space-y-2">
                  <li>• <strong>טיפול לקוי</strong> - סתימה שנפלה, כתר שלא מתאים, שתל שנכשל</li>
                  <li>• <strong>עלויות שונות מהסיכום</strong> - הבטיחו מחיר אחד וגבו יותר</li>
                  <li>• <strong>טיפול לא נדרש</strong> - עשו טיפולים שלא היו צריכים</li>
                  <li>• <strong>אי-מתן אחריות</strong> - מסרבים לתקן עבודה גרועה</li>
                </ul>
              </div>

              {/* Private Services */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-3 text-lg flex items-center gap-2">
                  <Heart className="w-5 h-5 text-teal-600" />
                  שירותים פרטיים
                </h3>
                <ul className="text-slate-600 text-sm space-y-2">
                  <li>• <strong>מכוני אסתטיקה</strong> - טיפולים שלא הצליחו או גרמו נזק</li>
                  <li>• <strong>פיזיותרפיה/כירופרקטיקה</strong> - טיפול לקוי, החמרת מצב</li>
                  <li>• <strong>בדיקות פרטיות</strong> - תוצאות שגויות, עיכובים</li>
                  <li>• <strong>ייעוץ תזונתי</strong> - הבטחות שווא, דיאטות מסוכנות</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Evidence */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-teal-600" />
              מה צריך לתביעה
            </h2>
            <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
              <ul className="space-y-3">
                {[
                  "תיק רפואי - יש לך זכות לקבל עותק מלא (בקשה בכתב לקופה/מרפאה)",
                  "קבלות וחשבוניות - על כל טיפול ששילמת",
                  "חוות דעת רפואית - רופא אחר שאומר שהטיפול היה לקוי",
                  "תמונות - לפני ואחרי (במיוחד בשיניים ואסתטיקה)",
                  "התכתבויות - מיילים, הודעות, טפסים שמילאת",
                  "פניות קודמות - תלונות שהגשת לקופה או לרופא",
                  "חוו\"ד מומחה - אם יש מחלוקת מקצועית על איכות הטיפול",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              🏥 הזכויות שלך מול קופת החולים
            </h2>
            <div className="bg-teal-50 rounded-2xl p-6 border border-teal-100">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4">
                  <h4 className="font-bold text-slate-800 mb-2">זמני המתנה מקסימליים</h4>
                  <p className="text-slate-600 text-sm">
                    יש תקנות שקובעות כמה זמן מותר לחכות לתור מומחה 
                    (בדרך כלל 2-4 שבועות). עברו? מגיע לך פיצוי.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <h4 className="font-bold text-slate-800 mb-2">זכות לדעת מראש</h4>
                  <p className="text-slate-600 text-sm">
                    חובה לספר לך מה עולה כסף ומה לא לפני הטיפול. 
                    גילית רק אחרי? לא חייב לשלם.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <h4 className="font-bold text-slate-800 mb-2">זכות לבקש חוות דעת שנייה</h4>
                  <p className="text-slate-600 text-sm">
                    מותר לך לקבל חוות דעת ממומחה אחר, ולפעמים הקופה חייבת לממן את זה.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <h4 className="font-bold text-slate-800 mb-2">ועדת חריגים</h4>
                  <p className="text-slate-600 text-sm">
                    אם נדחית, יש לך זכות לערער לוועדת חריגים. 
                    דחו גם שם? עכשיו יש עילה לתביעה.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Dental Specific */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              🦷 טיפול שיניים לקוי - מה עושים
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <p className="text-slate-700 leading-relaxed mb-4">
                שיניים זה תחום מיוחד בתביעות קטנות. למה? כי הנזק ברור, 
                יש תיעוד (צילומים), ואפשר להביא רופא שיניים אחר שיאמר שהעבודה גרועה.
              </p>
              <div className="space-y-3">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-bold text-slate-800 mb-1">שלב 1: תעד</h4>
                  <p className="text-slate-600 text-sm">
                    צלם את הפה, שמור צילומי רנטגן, תעד את הכאבים והבעיות.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-bold text-slate-800 mb-1">שלב 2: פנה לרופא</h4>
                  <p className="text-slate-600 text-sm">
                    תן לו הזדמנות לתקן. שלח בקשה בכתב. אם מסרב או נכשל - יש לך הוכחה.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-bold text-slate-800 mb-1">שלב 3: חוות דעת</h4>
                  <p className="text-slate-600 text-sm">
                    לך לרופא שיניים אחר, בקש חוות דעת בכתב על מצב העבודה והעלות לתיקון.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-bold text-slate-800 mb-1">שלב 4: תביעה</h4>
                  <p className="text-slate-600 text-sm">
                    תבע את עלות התיקון + עלות הטיפול המקורי + עוגמת נפש.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Before Suing */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-teal-600" />
              לפני שמגישים תביעה
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <ol className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-slate-800">תלונה לקופה/מרפאה</h4>
                    <p className="text-slate-600 text-sm">
                      פנו לשירות לקוחות או למנהל. לפעמים זה מספיק.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-slate-800">נציב תלונות</h4>
                    <p className="text-slate-600 text-sm">
                      לכל קופת חולים יש נציב תלונות. חייבים לענות תוך 30 יום.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-slate-800">משרד הבריאות</h4>
                    <p className="text-slate-600 text-sm">
                      אפשר להגיש תלונה לנציבות לבריאות הציבור. לא עוזר ישירות לכסף, 
                      אבל מכניס לחץ ומראה לשופט שניסית.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold shrink-0">4</div>
                  <div>
                    <h4 className="font-bold text-slate-800">מכתב התראה</h4>
                    <p className="text-slate-600 text-sm">
                      לפני תביעה - שלחו מכתב רשום עם דרישה ברורה ומועד לתשובה.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          {/* Warning */}
          <section className="mb-12">
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
              <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                מתי כן צריך עורך דין
              </h2>
              <ul className="text-slate-700 space-y-2">
                <li>• <strong>נזק גופני משמעותי</strong> - פציעה, נכות, החמרת מצב רפואי</li>
                <li>• <strong>סכומים גבוהים</strong> - מעל 35,000 ₪</li>
                <li>• <strong>רשלנות מורכבת</strong> - שדורשת הוכחה רפואית מסובכת</li>
                <li>• <strong>אובדן הכנסה</strong> - לא יכולת לעבוד בגלל הטיפול הכושל</li>
              </ul>
              <p className="text-slate-600 mt-3 text-sm">
                במקרים אלה, עורכי דין לרשלנות רפואית עובדים בהסכמי &quot;no win no fee&quot; - 
                אתה משלם רק אם זוכה.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-3">
                גם על בריאות מגיע פיצוי
              </h2>
              <p className="text-teal-100 mb-6 max-w-md mx-auto">
                ספרו לנו מה קרה והמערכת תעזור לכם לבנות תביעה 
                מסודרת לקבלת הפיצוי שמגיע לכם.
              </p>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 bg-white text-teal-600 px-8 py-3 rounded-xl font-bold hover:bg-teal-50 transition-colors"
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
