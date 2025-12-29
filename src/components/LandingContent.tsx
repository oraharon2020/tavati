"use client";

import { CheckCircle, Clock, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ChatPreview from "@/components/ChatPreview";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Props {
  blogSection: React.ReactNode;
}

export default function LandingContent({ blogSection }: Props) {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Content */}
      <main id="main-content" role="main">
      
      {/* Hero - Clean Design with Subtle Animation */}
      <section className="relative min-h-[85vh] flex items-center py-16 px-6 bg-gradient-to-br from-[#f8fafc] to-[#eef4ff]" aria-labelledby="hero-title">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          {/* Floating gradient orbs */}
          <div 
            className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-blue-200/40 rounded-full blur-[100px]"
            style={{ animation: 'float 20s ease-in-out infinite' }}
          />
          <div 
            className="absolute bottom-[10%] left-[5%] w-[350px] h-[350px] bg-indigo-200/30 rounded-full blur-[80px]"
            style={{ animation: 'float 25s ease-in-out infinite', animationDelay: '-5s' }}
          />
          <div 
            className="absolute top-[40%] left-[20%] w-[200px] h-[200px] bg-cyan-200/30 rounded-full blur-[60px]"
            style={{ animation: 'float 18s ease-in-out infinite', animationDelay: '-10s' }}
          />
          
          {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Right Side - Content */}
            <div className="flex justify-center md:justify-end order-2 md:order-1">
              <div className="max-w-lg">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur border border-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6 shadow-sm">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" aria-hidden="true"></span>
                  כתיבת תביעות קטנות עם AI
                </div>
                
                <h1 id="hero-title" className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 leading-tight">
                  כתב תביעה מקצועי
                  <br />
                  <span className="text-blue-600">תוך 5 דקות</span>
                </h1>

                <p className="text-lg text-neutral-600 mb-8 max-w-md">
                  ענו על כמה שאלות פשוטות וקבלו כתב תביעה מוכן להגשה לבית משפט לתביעות קטנות
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    href="/chat"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold text-base shadow-lg shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    צרו תביעה עכשיו
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  </Link>
                  
                  <Link
                    href="#how-it-works"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-neutral-700 rounded-xl hover:bg-neutral-50 transition-all font-medium border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    איך זה עובד?
                  </Link>
                </div>

                <div className="flex items-center gap-4 text-sm text-neutral-500">
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-green-500" aria-hidden="true" />
                    מאובטח
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    תשלום רק לאחר קבלת התביעה
                  </div>
                </div>
              </div>
            </div>
            
            {/* Left Side - Chat Preview with floating effect */}
            <div className="flex justify-center md:justify-start order-1 md:order-2">
              <div className="relative">
                {/* Glow effect behind */}
                <div className="absolute inset-0 bg-blue-400/20 rounded-3xl blur-2xl transform scale-105" />
                
                {/* Chat Preview Card */}
                <div className="relative z-10 bg-white rounded-2xl shadow-2xl shadow-blue-900/10 overflow-hidden border border-neutral-200/50">
                  <ChatPreview />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-12 px-6 bg-white border-b">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600">73%</div>
              <div className="text-sm text-neutral-500 mt-1">שיעור הצלחה בתביעות</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600">5 דק׳</div>
              <div className="text-sm text-neutral-500 mt-1">זמן יצירת תביעה</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600">₪79</div>
              <div className="text-sm text-neutral-500 mt-1">מחיר קבוע</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-6 bg-neutral-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">איך זה עובד?</h2>
            <p className="text-lg text-neutral-600">3 שלבים פשוטים לכתב תביעה מקצועי</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "1", title: "ספרו מה קרה", desc: "ענו על כמה שאלות פשוטות על המקרה שלכם בשיחה קצרה" },
              { num: "2", title: "המערכת כותבת", desc: "ה-AI מנתח את המקרה וכותב כתב תביעה מקצועי" },
              { num: "3", title: "קבלו את התביעה", desc: "מורידים PDF מוכן להגשה ישירות לבית המשפט" }
            ].map((step) => (
              <div key={step.num} className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold mb-4">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">{step.title}</h3>
                <p className="text-neutral-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">מחיר פשוט ושקוף</h2>
            <p className="text-lg text-neutral-600">ללא הפתעות, ללא עלויות נסתרות</p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center shadow-xl shadow-blue-500/20">
              <div className="text-5xl font-bold mb-2">₪79</div>
              <p className="text-blue-100 mb-6">תשלום חד פעמי</p>
              
              <div className="space-y-3 text-right mb-8">
                {[
                  "כתב תביעה מקצועי מותאם למקרה שלכם",
                  "מסמך PDF מוכן להגשה",
                  "הדרכה להגשה עצמית",
                  "תמיכה בווטסאפ",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-blue-50">
                    <CheckCircle className="w-5 h-5 text-blue-200 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              
              <Link
                href="/chat"
                className="block w-full py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
              >
                התחילו עכשיו
              </Link>
              
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-blue-200">
                <Clock className="w-4 h-4" />
                משלמים רק אחרי שהתביעה מוכנה
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-neutral-600">
                <span className="font-semibold text-neutral-900">עו״ד גובה אלפי שקלים</span> על אותה עבודה
              </p>
              
              <p className="text-sm text-neutral-500 mt-2">
                חסכו 95% מהעלות ושמרו על 100% מהפיצוי
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials / Trust */}
      <section className="py-16 px-6 bg-neutral-50 border-y">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-xl text-neutral-700 font-medium mb-2">
            &quot;הגשתי תביעה נגד חברת הביטוח וזכיתי ב-5,000 ₪&quot;
          </p>
          <p className="text-sm text-neutral-500">— דניאל, תל אביב</p>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">באילו מקרים אפשר לתבוע?</h2>
            <p className="text-lg text-neutral-600">המערכת מתאימה למגוון רחב של תביעות קטנות</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "תיירות וטיסות", desc: "ביטולים, עיכובים, מזוודות" },
              { name: "שכירות ודיור", desc: "פיקדונות, ליקויים" },
              { name: "ספאם והטרדות", desc: "הודעות פרסום, שיחות" },
              { name: "צרכנות", desc: "מוצרים פגומים, אחריות" },
              { name: "רכב ומוסכים", desc: "תיקונים, הונאות" },
              { name: "שירות לקוי", desc: "ספקים, קבלנים" },
            ].map((type) => (
              <div
                key={type.name}
                className="bg-neutral-50 rounded-xl p-5 border border-neutral-200 hover:border-blue-300 transition-colors"
              >
                <h3 className="font-semibold text-neutral-900 mb-1">{type.name}</h3>
                <p className="text-sm text-neutral-500">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section - Server Component */}
      {blogSection}

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 bg-neutral-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">שאלות נפוצות</h2>
          </div>
          
          <div className="space-y-4">
            {[
              { q: "האם זה באמת עובד?", a: "כן. המערכת מבוססת על AI שנבנה בשיתוף עורכי דין. 73% מהתביעות הקטנות בישראל מסתיימות בהצלחה." },
              { q: "כמה זמן לוקח?", a: "בממוצע 5 דקות לקבלת כתב תביעה מקצועי מוכן להגשה." },
              { q: "צריך עורך דין?", a: "לא. תביעות קטנות מיועדות להגשה עצמית. המערכת מכינה את כל המסמכים הנדרשים." },
              { q: "מתי משלמים?", a: "רק אחרי שהתביעה מוכנה ואתם מרוצים מהתוצאה." },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-lg border-b border-neutral-100 p-4">
                <h3 className="font-semibold text-neutral-900 mb-2">{item.q}</h3>
                <p className="text-neutral-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-blue-600" aria-labelledby="cta-title">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 id="cta-title" className="text-3xl md:text-4xl font-bold mb-4">
            מוכנים להתחיל?
          </h2>
          <p className="text-lg mb-8 text-blue-100">
            קבלו כתב תביעה מקצועי תוך דקות ספורות
          </p>
          
          <Link
            href="/chat"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-colors text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
          >
            התחילו עכשיו
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      </main>

      <Footer />
    </div>
  );
}
