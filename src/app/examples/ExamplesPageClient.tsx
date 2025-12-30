"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  FileText, 
  Home, 
  Shield, 
  Wrench, 
  Smartphone, 
  ShoppingBag,
  ArrowLeft,
  Download,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

const examples = [
  {
    id: "deposit",
    title: "תביעה להחזר פיקדון",
    subtitle: "משכיר שלא מחזיר פיקדון",
    icon: Home,
    color: "green",
    amount: "8,500 ₪",
    description: "דייר שעזב דירה בסדר גמור והמשכיר מסרב להחזיר את הפיקדון",
    preview: {
      plaintiff: "ישראל ישראלי",
      defendant: "דוד כהן (בעל הדירה)",
      claimBasis: "הפרת חוזה שכירות - אי החזרת פיקדון",
      facts: [
        "התובע שכר דירה ברחוב הרצל 15, תל אביב, החל מ-1.1.2024",
        "בעת החתימה על החוזה, שילם התובע פיקדון בסך 8,500 ₪",
        "התובע עזב את הדירה ביום 31.12.2024 כשהיא במצב תקין",
        "למרות פניות חוזרות, הנתבע מסרב להחזיר את הפיקדון",
        "הנתבע לא הציג כל נזק או עילה לעיכוב הפיקדון"
      ]
    }
  },
  {
    id: "insurance",
    title: "תביעה נגד חברת ביטוח",
    subtitle: "דחיית תביעה לא מוצדקת",
    icon: Shield,
    color: "blue",
    amount: "15,000 ₪",
    description: "חברת ביטוח שדחתה תביעה על נזק לרכב ללא הצדקה",
    preview: {
      plaintiff: "שרה לוי",
      defendant: "חברת הביטוח הישראלית בע\"מ",
      claimBasis: "הפרת חוזה ביטוח - דחיית תביעה שלא כדין",
      facts: [
        "התובעת מבוטחת בפוליסת ביטוח מקיף לרכב מס' 123456",
        "ביום 15.6.2024 ניזוק הרכב בתאונה שאינה באשמת התובעת",
        "התובעת הגישה תביעה לחברת הביטוח בצירוף כל המסמכים",
        "חברת הביטוח דחתה את התביעה בטענה לא מבוססת",
        "עלות התיקון לפי שמאי: 15,000 ₪"
      ]
    }
  },
  {
    id: "contractor",
    title: "תביעה נגד קבלן",
    subtitle: "עבודה לקויה או לא הושלמה",
    icon: Wrench,
    color: "orange",
    amount: "22,000 ₪",
    description: "קבלן שיפוצים שעזב באמצע העבודה והשאיר ליקויים",
    preview: {
      plaintiff: "משה אברהם",
      defendant: "שיפוצי אלון בע\"מ",
      claimBasis: "הפרת חוזה - אי השלמת עבודה וליקויי בנייה",
      facts: [
        "התובע התקשר עם הנתבע לביצוע שיפוץ מטבח בסך 45,000 ₪",
        "התובע שילם מקדמה של 22,000 ₪",
        "הקבלן התחיל את העבודה אך עזב לאחר שבועיים ללא הסבר",
        "העבודה שבוצעה לקויה ודורשת תיקון",
        "למרות פניות חוזרות, הקבלן לא חזר ולא החזיר כסף"
      ]
    }
  },
  {
    id: "telecom",
    title: "תביעה נגד חברת סלולר",
    subtitle: "חיובים לא מוצדקים",
    icon: Smartphone,
    color: "purple",
    amount: "3,200 ₪",
    description: "חיובי יתר בחשבון טלפון למרות פניות חוזרות",
    preview: {
      plaintiff: "רחל גולן",
      defendant: "פלאפון תקשורת בע\"מ",
      claimBasis: "הפרת חוזה והטעיה צרכנית",
      facts: [
        "התובעת לקוחה של הנתבעת מאז 2020",
        "החל מינואר 2024, התובעת מחויבת בסכומים העולים על החבילה",
        "התובעת פנתה 7 פעמים לשירות הלקוחות ללא הועיל",
        "סך החיובים העודפים: 2,400 ₪",
        "התובעת דורשת גם פיצוי על עוגמת נפש: 800 ₪"
      ]
    }
  },
  {
    id: "consumer",
    title: "תביעה צרכנית",
    subtitle: "מוצר פגום שלא הוחלף",
    icon: ShoppingBag,
    color: "pink",
    amount: "4,500 ₪",
    description: "רכישת מוצר פגום והחנות מסרבת להחליף או להחזיר כסף",
    preview: {
      plaintiff: "יעל כץ",
      defendant: "אלקטרו פלוס בע\"מ",
      claimBasis: "הפרת חוק הגנת הצרכן - אי מתן אחריות",
      facts: [
        "התובעת רכשה מקרר מהנתבעת ביום 1.3.2024 בסך 4,500 ₪",
        "לאחר חודשיים המקרר הפסיק לקרר",
        "התובעת פנתה לחנות בתקופת האחריות",
        "החנות שלחה טכנאי שקבע \"תקלה יצרנית\"",
        "למרות זאת, החנות מסרבת להחליף או לזכות"
      ]
    }
  }
];

export default function ExamplesPageClient() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
                <FileText className="w-4 h-4" />
                דוגמאות מעשיות
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                דוגמאות לכתבי תביעה
              </h1>
              <p className="text-xl text-indigo-100">
                ראו איך נראה כתב תביעה מקצועי לפני שמתחילים
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Intro */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-amber-800 mb-2">שימו לב</h3>
                  <p className="text-amber-700">
                    הדוגמאות כאן הן להמחשה בלבד. כל מקרה הוא ייחודי וכתב התביעה שלכם 
                    צריך להתאים בדיוק למה שקרה לכם. המערכת שלנו יוצרת כתב תביעה מותאם אישית 
                    לפי הסיפור שלכם.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Examples Grid */}
          <div className="max-w-5xl mx-auto space-y-8">
            {examples.map((example, index) => {
              const Icon = example.icon;
              const colorClasses = {
                green: "bg-green-100 text-green-600 border-green-200",
                blue: "bg-blue-100 text-blue-600 border-blue-200",
                orange: "bg-orange-100 text-orange-600 border-orange-200",
                purple: "bg-purple-100 text-purple-600 border-purple-200",
                pink: "bg-pink-100 text-pink-600 border-pink-200"
              }[example.color] || "bg-blue-100 text-blue-600 border-blue-200";
              
              return (
                <div key={example.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  {/* Header */}
                  <div className={`p-6 ${colorClasses.replace("border", "bg").split(" ")[0]}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm`}>
                          <Icon className={`w-6 h-6 ${colorClasses.split(" ")[1]}`} />
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">דוגמה {index + 1}</span>
                          <h2 className="text-xl font-bold text-gray-900">{example.title}</h2>
                          <p className="text-gray-600">{example.subtitle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500">סכום התביעה</span>
                        <div className="text-2xl font-bold text-gray-900">{example.amount}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Preview */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-6">{example.description}</p>
                    
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="text-center mb-6">
                        <div className="text-sm text-gray-500 mb-1">בבית המשפט לתביעות קטנות</div>
                        <div className="text-lg font-bold">כתב תביעה</div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white rounded-lg p-4 border">
                          <div className="text-sm text-gray-500 mb-1">התובע/ת</div>
                          <div className="font-semibold text-gray-900">{example.preview.plaintiff}</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border">
                          <div className="text-sm text-gray-500 mb-1">הנתבע/ת</div>
                          <div className="font-semibold text-gray-900">{example.preview.defendant}</div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <div className="text-sm text-gray-500 mb-2">עילת התביעה</div>
                        <div className="bg-white rounded-lg p-4 border font-medium text-gray-900">
                          {example.preview.claimBasis}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-500 mb-2">תיאור העובדות</div>
                        <div className="bg-white rounded-lg p-4 border space-y-2">
                          {example.preview.facts.map((fact, i) => (
                            <div key={i} className="flex gap-2 text-sm">
                              <span className="text-gray-400">{i + 1}.</span>
                              <span className="text-gray-700">{fact}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="px-6 pb-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 text-gray-600">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>כתב תביעה מלא כולל גם: הסעדים המבוקשים, רשימת מסמכים, והצהרה חתומה</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="max-w-3xl mx-auto mt-16">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-3">
                רוצים כתב תביעה מותאם למקרה שלכם?
              </h2>
              <p className="text-indigo-100 mb-6 max-w-lg mx-auto">
                ספרו לנו מה קרה, והמערכת תכין לכם כתב תביעה מקצועי 
                עם כל הפרטים הנכונים - תוך דקות.
              </p>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
              >
                התחילו עכשיו - בחינם
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* SEO Content */}
          <div className="max-w-3xl mx-auto mt-16 prose prose-lg prose-gray">
            <h2 className="text-gray-900">למה חשוב לראות דוגמה לכתב תביעה?</h2>
            <p className="text-gray-700">
              הרבה אנשים שרוצים להגיש תביעה קטנה לבד לא יודעים איך נראה כתב תביעה מקצועי. 
              הדוגמאות בדף זה נועדו לתת לכם מושג על המבנה הנכון, אבל כל מקרה הוא ייחודי.
            </p>
            
            <h3 className="text-gray-900">מה חייב להיות בכתב תביעה?</h3>
            <ul className="text-gray-700">
              <li><strong className="text-gray-900">פרטי הצדדים</strong> - שם, כתובת ות.ז. של התובע והנתבע</li>
              <li><strong className="text-gray-900">עילת התביעה</strong> - על מה תובעים (הפרת חוזה, נזיקין וכו')</li>
              <li><strong className="text-gray-900">תיאור העובדות</strong> - מה קרה, מתי, ומה הנזק</li>
              <li><strong className="text-gray-900">הסעדים</strong> - כמה כסף דורשים ועל מה</li>
              <li><strong className="text-gray-900">רשימת מסמכים</strong> - אילו ראיות מצרפים</li>
              <li><strong className="text-gray-900">הצהרה</strong> - שכל הפרטים נכונים</li>
            </ul>
            
            <h3 className="text-gray-900">איך להגיש תביעה קטנה בעצמי?</h3>
            <p className="text-gray-700">
              להגיש תביעה קטנה לבד זה פשוט יותר ממה שחושבים. הצעד הראשון הוא 
              להכין כתב תביעה מסודר. המערכת שלנו עוזרת לכם לעשות את זה - 
              פשוט ספרו מה קרה ואנחנו נכין את המסמך.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
