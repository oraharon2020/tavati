import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">מדיניות ביטול והחזרים</h1>
        
        <div className="prose prose-lg max-w-none space-y-6 text-neutral-700">
          <p className="text-neutral-500">עודכן לאחרונה: {new Date().toLocaleDateString("he-IL")}</p>
          
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <strong>בקצרה:</strong> מכיוון שמדובר במוצר דיגיטלי שמועבר מיידית, לא ניתן לבטל את העסקה לאחר הורדת המסמך. זאת בהתאם לחוק הגנת הצרכן.
          </div>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">1. מוצר דיגיטלי</h2>
            <p>
              השירות שלנו מספק מוצר דיגיטלי (קובץ PDF) שמועבר מיידית לאחר התשלום.
              בהתאם לסעיף 14ג(ד) לחוק הגנת הצרכן, התשמ"א-1981, עסקה לרכישת מידע 
              שהועבר ישירות לצרכן באמצעות תקשורת - אינה ניתנת לביטול.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">2. מתי כן נחזיר?</h2>
            <p>
              למרות שאין חובה חוקית, נשמח להחזיר במקרים הבאים:
            </p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li><strong>תקלה טכנית</strong> - אם לא הצלחת להוריד את המסמך עקב תקלה מצידנו</li>
              <li><strong>מסמך פגום</strong> - אם הקובץ שהתקבל אינו תקין או לא קריא</li>
              <li><strong>חיוב כפול</strong> - אם חויבת פעמיים בטעות</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">3. איך לפנות?</h2>
            <p>
              במקרה של בעיה, ניתן לפנות אלינו:
            </p>
            <ul className="list-none space-y-2 mr-4">
              <li>📧 דוא"ל: <a href="mailto:support@tavati.co.il" className="text-blue-600">support@tavati.co.il</a></li>
              <li>⏰ זמן מענה: עד 24 שעות בימי עסקים</li>
            </ul>
            <p className="mt-4">בפנייה יש לציין:</p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>מספר טלפון (שבו בוצעה ההזדהות)</li>
              <li>תיאור הבעיה</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">4. הבהרה חשובה</h2>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p>
                <strong>לפני התשלום</strong> - מוצגת לך תצוגה מקדימה של המסמך, כדי שתוכל לוודא שהתוכן מתאים לצרכיך.
                התשלום מהווה אישור שבדקת את התצוגה המקדימה ואתה מרוצה מהתוצאה.
              </p>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
