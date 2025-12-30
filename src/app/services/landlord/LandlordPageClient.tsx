"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Home, 
  CheckCircle, 
  AlertTriangle, 
  FileText,
  ArrowLeft,
  Users,
  Scale,
  Camera
} from "lucide-react";

export default function LandlordPageClient() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <Header />
      <main className="flex-1">
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-600 to-green-800 text-white py-16">
        <div className="container mx-auto px-4">
          <Link href="/services" className="inline-flex items-center text-green-200 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 ml-2" />
            חזרה לכל סוגי התביעות
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
              <Home className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              תביעות שכירות
            </h1>
          </div>
          <p className="text-xl text-green-100 max-w-2xl leading-relaxed">
            יחסי שוכר-משכיר הם מכרה זהב לסכסוכים. 
            פיקדון, נזקים, תיקונים - על הכל אפשר לריב, ועל הכל אפשר לתבוע.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Two Sides */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-green-600" />
              שני צדדים לסיפור
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-3 text-lg">אני שוכר ורוצה לתבוע</h3>
                <ul className="space-y-2 text-slate-600 text-sm">
                  <li>• פיקדון שלא הוחזר (או הוחזר חלקי)</li>
                  <li>• המשכיר לא מתקן תקלות</li>
                  <li>• חויבתי על נזקים שלא גרמתי</li>
                  <li>• הפרת חוזה מצד המשכיר</li>
                  <li>• הטרדות או כניסה לדירה בלי אישור</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-3 text-lg">אני משכיר ורוצה לתבוע</h3>
                <ul className="space-y-2 text-slate-600 text-sm">
                  <li>• השוכר השאיר נזקים בדירה</li>
                  <li>• חובות שכירות שלא שולמו</li>
                  <li>• הפרת חוזה מצד השוכר</li>
                  <li>• עזב בלי התראה מוקדמת</li>
                  <li>• שימוש לא חוקי בדירה</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Deposit - The Big One */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Scale className="w-6 h-6 text-green-600" />
              הנושא הכי חם: פיקדון
            </h2>
            <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
              <p className="text-slate-700 leading-relaxed mb-4">
                רוב התביעות בנושא שכירות עוסקות בפיקדון. החוק ברור: 
                <strong> המשכיר חייב להחזיר את הפיקדון תוך 60 יום מסיום השכירות</strong>, 
                בניכוי נזקים שהוכחו.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                המילה החשובה היא &quot;הוכחו&quot;. המשכיר לא יכול סתם להגיד &quot;היה נזק&quot; - 
                הוא צריך להראות תמונות, קבלות של תיקון, ולהוכיח שהנזק לא היה קיים לפני.
              </p>
              <div className="bg-white rounded-xl p-4 mt-4">
                <h4 className="font-bold text-slate-800 mb-2">💡 הטיפ הכי חשוב:</h4>
                <p className="text-slate-600 text-sm">
                  אם לא עשית פרוטוקול מסירה מסודר עם תמונות - זה לא סוף העולם. 
                  גם בלי זה אפשר לטעון שהנזקים היו בלאי סביר או שהמשכיר לא הוכיח שאתה אשם.
                </p>
              </div>
            </div>
          </section>

          {/* Documentation */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Camera className="w-6 h-6 text-green-600" />
              איך לתעד נכון (לפני ואחרי)
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">בכניסה לדירה:</h4>
                  <ul className="text-slate-600 text-sm space-y-1">
                    <li>• צלם את כל הדירה, כולל פגמים קיימים</li>
                    <li>• צלם את המונים (חשמל, מים, גז)</li>
                    <li>• תעד בכתב את מצב הדירה ותחתים את המשכיר</li>
                    <li>• שמור העתק של החוזה והפיקדון</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">ביציאה מהדירה:</h4>
                  <ul className="text-slate-600 text-sm space-y-1">
                    <li>• צלם שוב את כל הדירה</li>
                    <li>• צלם את המונים</li>
                    <li>• מסור את המפתחות מול עדים או בכתב</li>
                    <li>• שלח הודעה בכתב על סיום השכירות</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Evidence */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-green-600" />
              מה צריך לתביעה
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "חוזה השכירות",
                  desc: "ההסכם המקורי - זה הבסיס לכל טענה."
                },
                {
                  title: "אישורי תשלום",
                  desc: "העברות, צ'קים, קבלות - הוכחה שהפיקדון שולם."
                },
                {
                  title: "התכתבויות",
                  desc: "וואטסאפים, מיילים, SMS - כל תקשורת רלוונטית."
                },
                {
                  title: "תמונות ותיעוד",
                  desc: "מצב הדירה בכניסה וביציאה."
                },
                {
                  title: "עדויות",
                  desc: "שכנים, חברים שראו את הדירה, בעלי מקצוע."
                },
                {
                  title: "הצעות מחיר",
                  desc: "לתיקונים שנדרשו או שהמשכיר טוען להם."
                },
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-1">{item.title}</h4>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Common Mistakes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              טעויות נפוצות (שעדיף להימנע מהן)
            </h2>
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100 space-y-4">
              <div>
                <h4 className="font-bold text-slate-800 mb-1">❌ לחכות יותר מדי</h4>
                <p className="text-slate-600 text-sm">
                  יש התיישנות של 7 שנים, אבל ככל שעובר זמן - קשה יותר להוכיח ולזכור פרטים. 
                  תתבעו בחודשים הקרובים לאירוע.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">❌ להסכים בעל פה</h4>
                <p className="text-slate-600 text-sm">
                  &quot;דיברנו והוא אמר שיחזיר&quot; לא שווה כלום בבית משפט. 
                  תמיד תסכמו בכתב - אפילו בוואטסאפ זה כתב.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">❌ לעזוב בלי להודיע</h4>
                <p className="text-slate-600 text-sm">
                  גם אם המשכיר מעצבן - תנו התראה מסודרת לפי החוזה. 
                  אחרת הוא יכול לתבוע אתכם על הפסד שכירות.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">❌ לזרוק חפצים של השוכר</h4>
                <p className="text-slate-600 text-sm">
                  למשכירים: גם אם השוכר עזב - אסור לזרוק את הרכוש שלו בלי הליך משפטי. 
                  זו גניבה, וזה יעלה לכם ביוקר.
                </p>
              </div>
            </div>
          </section>

          {/* Pro Tips */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              טיפים שעובדים
            </h2>
            <div className="bg-green-50 rounded-2xl p-6 border border-green-100 space-y-4">
              <div>
                <h4 className="font-bold text-slate-800 mb-1">✓ שלחו מכתב התראה קודם</h4>
                <p className="text-slate-600 text-sm">
                  לפני שמגישים תביעה - שלחו מכתב דרישה מסודר. 
                  הרבה פעמים זה לבד פותר את העניין, ואם לא - זה נראה טוב בבית משפט.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">✓ בדקו את חוק השכירות</h4>
                <p className="text-slate-600 text-sm">
                  חוק שכירות הוגנת (2017) מגן על שוכרים ומגדיר מה מותר ומה אסור. 
                  הכירו את הזכויות שלכם.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">✓ תחשבו על פשרה</h4>
                <p className="text-slate-600 text-sm">
                  לפעמים עדיף לקבל 70% מהפיקדון מחר מאשר 100% בעוד חצי שנה. 
                  הציעו פשרה סבירה.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">✓ תביעו גם על עוגמת נפש</h4>
                <p className="text-slate-600 text-sm">
                  אם המשכיר התנהג בצורה מזלזלת או מטרידה - אפשר לתבוע גם פיצוי 
                  על עוגמת נפש. זה יכול להוסיף כמה אלפי שקלים.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-3">
                בואו נכין את התביעה ביחד
              </h2>
              <p className="text-green-100 mb-6 max-w-md mx-auto">
                תספרו לנו מה קרה, והמערכת תעזור לכם לנסח תביעה 
                מקצועית עם כל המסמכים הנדרשים.
              </p>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors"
              >
                התחילו עכשיו - בחינם
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
