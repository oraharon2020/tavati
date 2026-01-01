import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PRICES } from "@/lib/prices";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">תנאי שימוש</h1>
        
        <div className="prose prose-lg max-w-none space-y-6 text-neutral-700">
          <p className="text-neutral-500">עודכן לאחרונה: {new Date().toLocaleDateString("he-IL")}</p>
          
          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">1. כללי</h2>
            <p>
              ברוכים הבאים לאתר "תבעתי". השימוש באתר ובשירותים המוצעים בו כפוף לתנאי שימוש אלה.
              בעצם השימוש באתר, הנך מסכים לתנאים אלה במלואם.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">2. תיאור השירות</h2>
            <p>
              האתר מספק כלי עזר להכנת כתבי תביעה לבית משפט לתביעות קטנות.
              השירות כולל איסוף מידע באמצעות צ'אט אוטומטי ויצירת מסמך PDF.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">3. אין זה ייעוץ משפטי</h2>
            <p className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <strong>חשוב:</strong> השירות אינו מהווה ייעוץ משפטי ואינו מחליף התייעצות עם עורך דין.
              המידע והמסמכים המופקים הם כלי עזר בלבד. האחריות על תוכן התביעה והגשתה היא על המשתמש בלבד.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">4. תשלום</h2>
            <p>
              השימוש בצ'אט להכנת התביעה הוא חינם.
              התשלום בסך {PRICES.claims} ₪ נדרש להורדת כתב התביעה המוכן.
              התשלום הוא חד-פעמי ואינו מקנה זכות להחזר כספי לאחר הורדת המסמך.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">5. אחריות</h2>
            <p>
              האתר והשירותים מסופקים "כמות שהם" (AS IS).
              איננו אחראים לתוצאות השימוש בשירות, לרבות תוצאות הליכים משפטיים.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">6. שינויים בתנאים</h2>
            <p>
              אנו שומרים לעצמנו את הזכות לעדכן תנאים אלה מעת לעת.
              המשך השימוש באתר לאחר עדכון מהווה הסכמה לתנאים המעודכנים.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">7. יצירת קשר</h2>
            <p>
              לשאלות בנוגע לתנאי שימוש אלה, ניתן לפנות אלינו בדוא"ל: support@tavati.app
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
