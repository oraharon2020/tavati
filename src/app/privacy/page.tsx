import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">מדיניות פרטיות</h1>
        
        <div className="prose prose-lg max-w-none space-y-6 text-neutral-700">
          <p className="text-neutral-500">עודכן לאחרונה: {new Date().toLocaleDateString("he-IL")}</p>
          
          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">1. מידע שאנו אוספים</h2>
            <p>
              במהלך השימוש בשירות, אנו אוספים את המידע הבא:
            </p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>פרטים אישיים (שם, ת.ז., כתובת, טלפון, אימייל)</li>
              <li>פרטי התביעה (תיאור האירוע, סכום, ראיות)</li>
              <li>פרטי הנתבע</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">2. שימוש במידע</h2>
            <p>
              המידע משמש אך ורק ליצירת כתב התביעה עבורך.
            </p>
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <strong>הבטחה:</strong> איננו שומרים את המידע האישי שלך לאחר יצירת המסמך.
              המידע מעובד בזמן אמת ולא נשמר בשרתים שלנו.
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">3. שיתוף מידע</h2>
            <p>
              איננו משתפים, מוכרים או מעבירים את המידע האישי שלך לצדדים שלישיים,
              למעט במקרים הבאים:
            </p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>אם נדרש על פי חוק</li>
              <li>לצורך עיבוד תשלומים (דרך ספק סליקה מאובטח)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">4. אבטחת מידע</h2>
            <p>
              אנו משתמשים באמצעי אבטחה מתקדמים להגנה על המידע שלך:
            </p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>הצפנת SSL בכל התקשורת</li>
              <li>עיבוד מידע בזמן אמת ללא שמירה</li>
              <li>שרתים מאובטחים</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">5. Cookies</h2>
            <p>
              האתר משתמש ב-cookies לצורך שיפור חוויית השימוש.
              אינך חייב לקבל cookies ותוכל לחסום אותם בהגדרות הדפדפן.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">6. זכויותיך</h2>
            <p>
              על פי חוק הגנת הפרטיות, יש לך זכות:
            </p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>לדעת אילו מידע נאסף עליך</li>
              <li>לבקש מחיקת מידע</li>
              <li>לבקש תיקון מידע שגוי</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">7. יצירת קשר</h2>
            <p>
              לשאלות בנוגע לפרטיות, ניתן לפנות אלינו בדוא"ל: privacy@tavati.app
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
