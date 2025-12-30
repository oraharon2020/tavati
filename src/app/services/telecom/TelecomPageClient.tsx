"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Smartphone, 
  CheckCircle, 
  AlertTriangle, 
  FileText,
  ArrowLeft,
  Phone,
  DollarSign,
  Shield
} from "lucide-react";

export default function TelecomPageClient() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <Header />
      <main className="flex-1">
      {/* Hero */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4">
          <Link href="/services" className="inline-flex items-center text-purple-200 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 ml-2" />
            חזרה לכל סוגי התביעות
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
              <Smartphone className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              תביעה נגד חברת סלולר/אינטרנט
            </h1>
          </div>
          <p className="text-xl text-purple-100 max-w-2xl leading-relaxed">
            חיובים שמופיעים משום מקום, הבטחות שנשכחות, ושעות על הטלפון עם שירות לקוחות. 
            נשמע מוכר? יש מה לעשות עם זה.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Why It Works */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-600" />
              למה דווקא תביעות נגד חברות תקשורת מצליחות?
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <p className="text-slate-700 leading-relaxed mb-4">
                חברות תקשורת הן מהנתבעות הכי נפוצות בתביעות קטנות. 
                והן גם מפסידות הרבה - לא כי השופטים לא אוהבים אותן, 
                אלא כי הן באמת טועות לא מעט.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                <strong>הסיבה העיקרית:</strong> הכל מתועד. כל שיחה שלך עם נציג מוקלטת, 
                כל הבטחה נרשמת (או לא...), כל חיוב יש לו היסטוריה. וכשיש מסמכים - 
                קל להוכיח.
              </p>
              <p className="text-slate-700 leading-relaxed">
                <strong>יתרון נוסף:</strong> לחברות התקשורת לא משתלם להילחם על כמה מאות או אלפי שקלים. 
                הרבה פעמים הן יציעו פשרה עוד לפני הדיון.
              </p>
            </div>
          </section>

          {/* Common Issues */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-purple-600" />
              מקרים שאפשר לתבוע עליהם
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "חיוב על שירותים שלא הזמנת",
                  desc: "פתאום יש בחשבון 'תוכן פרימיום' או 'ערוצים נוספים'? זו תוספת לא מורשית."
                },
                {
                  title: "הבטחת מחיר שלא קוימה",
                  desc: "הבטיחו 99 ₪ לחודש ומחייבים 149? אם יש הקלטה או מסמך - יש תביעה."
                },
                {
                  title: "קנסות יציאה מופרזים",
                  desc: "גובים אלפים על התחייבות שכבר נגמרה או שלא הוסברה כראוי."
                },
                {
                  title: "שירות גרוע שלא תוקן",
                  desc: "אינטרנט איטי חודשים, קליטה גרועה, טכנאי שלא מגיע."
                },
                {
                  title: "ציוד שלא הוחזר",
                  desc: "החזרת ממיר/נתב אבל עדיין מחייבים? יש לך אישור החזרה?"
                },
                {
                  title: "עיכוב בניוד",
                  desc: "ביקשת לעבור לחברה אחרת ומשאירים אותך בכוח? זה אסור."
                },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pro Tips */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Phone className="w-6 h-6 text-purple-600" />
              הטריק הכי חשוב: בקש את ההקלטה
            </h2>
            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
              <p className="text-slate-700 leading-relaxed mb-4">
                לפי חוק הגנת הצרכן, חברות חייבות לשמור הקלטות של שיחות מכירה ושירות. 
                <strong> אתה זכאי לקבל עותק של כל שיחה שהקליטו</strong>.
              </p>
              <div className="bg-white rounded-xl p-4 mb-4">
                <h4 className="font-bold text-slate-800 mb-2">איך מבקשים:</h4>
                <ol className="text-slate-600 text-sm space-y-2">
                  <li>1. שלח מכתב או מייל לחברה עם בקשה לקבלת &quot;כל ההקלטות בתיק הלקוח&quot;</li>
                  <li>2. ציין את התאריכים הרלוונטיים (למשל: &quot;כל השיחות מינואר 2024&quot;)</li>
                  <li>3. החברה חייבת להשיב תוך 30 יום</li>
                  <li>4. אם לא מספקים - זה כשלעצמו עילה לתביעה</li>
                </ol>
              </div>
              <p className="text-slate-700 leading-relaxed">
                <strong>למה זה קריטי?</strong> כי ההקלטה היא ההוכחה הכי חזקה. 
                אם הנציג הבטיח מחיר מסוים וזה מוקלט - אין מה להתווכח.
              </p>
            </div>
          </section>

          {/* Evidence Checklist */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-purple-600" />
              מה צריך לתביעה
            </h2>
            <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
              <ul className="space-y-3">
                {[
                  "חשבוניות - את כל החשבונים הרלוונטיים (אפשר להוריד מהאזור האישי)",
                  "התקשרויות - תאריכים שדיברת עם נציגים, מספרי פניה אם יש",
                  "הקלטות - אם הקלטת בעצמך שיחות, או שקיבלת מהחברה",
                  "מיילים ו-SMS - כל הודעה שקיבלת מהחברה",
                  "צילומי מסך - מהאפליקציה, מהאתר, מהמבצע שהבטיחו",
                  "חוזה/הסכם - אם יש, במיוחד אם סימנת על משהו",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Regulatory Bodies */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              🏛️ עוד דרך: תלונה למשרד התקשורת
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <p className="text-slate-700 leading-relaxed mb-4">
                לפני תביעה, שווה להגיש תלונה למשרד התקשורת. זה בחינם ויכול לפתור את הבעיה בלי משפט.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-bold text-slate-800 mb-2">יתרונות:</h4>
                  <ul className="text-slate-600 text-sm space-y-1">
                    <li>• בחינם</li>
                    <li>• החברות מפחדות מהרגולטור</li>
                    <li>• יכול לסיים בהחזר מלא</li>
                    <li>• מראה לשופט שניסית</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-bold text-slate-800 mb-2">חסרונות:</h4>
                  <ul className="text-slate-600 text-sm space-y-1">
                    <li>• לוקח זמן (חודש-חודשיים)</li>
                    <li>• לא תמיד נותנים פיצוי מעבר להחזר</li>
                    <li>• אין סנקציות אמיתיות</li>
                  </ul>
                </div>
              </div>
              <p className="text-slate-700 mt-4">
                <strong>המלצה:</strong> הגש תלונה למשרד התקשורת, וב-25 ימים תגיש תביעה. 
                אם התלונה פותרת את העניין - תבטל את התביעה. אם לא - יש לך עוד הוכחה.
              </p>
            </div>
          </section>

          {/* Common Defense */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              מה החברות יטענו (ואיך להתמודד)
            </h2>
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100 space-y-4">
              <div className="border-b border-red-200 pb-4">
                <h4 className="font-bold text-slate-800 mb-1">&quot;חתמת על החוזה&quot;</h4>
                <p className="text-slate-600 text-sm">
                  <strong>תשובה:</strong> חוזה לא מאפשר לגבות על שירותים שלא הוזמנו. 
                  גם אם יש סעיף קטן - תנאי מקפח בחוזה אחיד אפשר לבטל.
                </p>
              </div>
              <div className="border-b border-red-200 pb-4">
                <h4 className="font-bold text-slate-800 mb-1">&quot;הודענו ב-SMS&quot;</h4>
                <p className="text-slate-600 text-sm">
                  <strong>תשובה:</strong> SMS לא מספיק להסכמה על שינוי מהותי. 
                  צריך הסכמה אקטיבית, לא שתיקה.
                </p>
              </div>
              <div className="border-b border-red-200 pb-4">
                <h4 className="font-bold text-slate-800 mb-1">&quot;אין לנו הקלטה&quot;</h4>
                <p className="text-slate-600 text-sm">
                  <strong>תשובה:</strong> אם הם לא שמרו הקלטה בניגוד לחוק - 
                  זה פועל לטובתך. הגרסה שלך מתקבלת.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">&quot;זו טעות שתוקנה&quot;</h4>
                <p className="text-slate-600 text-sm">
                  <strong>תשובה:</strong> תיקון לא מבטל את הנזק. 
                  הפסדת כסף, זמן, ועוגמת נפש - מגיע לך פיצוי.
                </p>
              </div>
            </div>
          </section>

          {/* Real Numbers */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              💰 מספרים אמיתיים
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <p className="text-slate-700 leading-relaxed mb-4">
                מה אפשר לצפות לקבל בתביעה נגד חברת תקשורת:
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-700">החזר חיובים שגויים</span>
                  <span className="font-bold text-purple-600">100% מהסכום</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-700">ריבית והצמדה</span>
                  <span className="font-bold text-purple-600">מיום החיוב השגוי</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-700">עוגמת נפש</span>
                  <span className="font-bold text-purple-600">1,000-5,000 ₪</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-700">הוצאות משפט</span>
                  <span className="font-bold text-purple-600">500-1,500 ₪</span>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-3">
                נמאס לכם מחיובים מופרכים?
              </h2>
              <p className="text-purple-100 mb-6 max-w-md mx-auto">
                ספרו לנו מה קרה והמערכת תעזור לכם לבנות תביעה 
                שתגרום לחברה להתייחס אליכם ברצינות.
              </p>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors"
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
