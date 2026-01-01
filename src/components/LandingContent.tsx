"use client";

import { CheckCircle, Clock, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ChatPreview from "@/components/ChatPreview";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { PRICES } from "@/lib/prices";

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
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Right Side - Content */}
            <motion.div 
              className="flex justify-center md:justify-end order-1 md:order-1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="max-w-lg text-center md:text-right">
                <motion.div 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur border border-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6 shadow-sm"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" aria-hidden="true"></span>
                  המערכת שתעזור לך לתבוע
                </motion.div>
                
                <motion.h1 
                  id="hero-title" 
                  className="text-4xl md:text-5xl font-bold text-neutral-900 mb-5 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  כתב תביעה מקצועי
                  <br />
                  <span className="bg-gradient-to-l from-blue-600 to-blue-500 bg-clip-text text-transparent">בלי עורך דין</span>
                </motion.h1>

                <motion.p 
                  className="text-lg text-neutral-700 mb-8 max-w-md mx-auto md:mx-0 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  פשוט ספרו לנו מה קרה, ואנחנו נכין לכם כתב תביעה מושלם - מוכן להגשה תוך דקות
                </motion.p>

                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 mb-8 justify-center md:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Link
                    href="/chat"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-gradient-to-l from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all font-semibold text-base shadow-lg shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:scale-[1.02]"
                  >
                    התחילו עכשיו - חינם
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  </Link>
                  
                  <Link
                    href="#how-it-works"
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white text-neutral-800 rounded-xl hover:bg-neutral-50 transition-all font-medium border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    איך זה עובד?
                  </Link>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-4 text-sm text-neutral-600 justify-center md:justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                    <span>מאובטח 100%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>משלמים רק בסוף</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Left Side - Chat Preview with floating effect */}
            <motion.div 
              className="flex justify-center md:justify-start order-2 md:order-2"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
            >
              <div className="relative">
                {/* Glow effect behind */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-emerald-400/20 rounded-3xl blur-2xl transform scale-110" />
                
                {/* Chat Preview Card */}
                <motion.div 
                  className="relative z-10 bg-white rounded-2xl shadow-2xl shadow-blue-900/15 overflow-hidden border border-neutral-200/50"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChatPreview />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-10 px-6 bg-white border-b">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600">73%</div>
              <div className="text-sm text-neutral-600 mt-1">מהתביעות הקטנות מצליחות</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600">5 דק׳</div>
              <div className="text-sm text-neutral-600 mt-1">וכתב התביעה מוכן</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600">₪{PRICES.claims}</div>
              <div className="text-sm text-neutral-600 mt-1">בלבד. בלי הפתעות</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-16 px-6 bg-neutral-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">פשוט כמו לשלוח הודעה</h2>
            <p className="text-lg text-neutral-600">תהליך קל שכל אחד יכול לעשות</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "1", title: "ספרו לנו מה קרה", desc: "כמו לספר לחבר טוב. בלי מילים משפטיות, בלי טפסים מסובכים" },
              { num: "2", title: "אנחנו עושים את העבודה", desc: "המערכת הופכת את הסיפור שלכם לכתב תביעה משפטי מדויק" },
              { num: "3", title: "מגישים ומנצחים", desc: "מורידים PDF, מגישים לבית המשפט, ותובעים את מה שמגיע לכם" }
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
          
          <div className="text-center mt-8">
            <Link
              href="/how-it-works"
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
            >
              לפרטים נוספים על התהליך
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 px-6 bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              חיסכון של אלפי שקלים
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">מחיר אחד. בלי הפתעות.</h2>
            <p className="text-lg text-neutral-600 max-w-xl mx-auto">
              עורך דין גובה אלפי שקלים על אותו הדבר בדיוק
            </p>
          </div>
          
          <div className="max-w-lg mx-auto">
            {/* Main Card */}
            <div className="relative">
              {/* Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <span className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                  הכי משתלם
                </span>
              </div>
              
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl shadow-blue-900/10 border border-neutral-200/80 relative overflow-hidden">
                {/* Subtle gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-blue-600 to-emerald-500" />
                
                {/* Price */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-6xl md:text-7xl font-bold text-neutral-900">79</span>
                    <span className="text-2xl font-bold text-neutral-900">₪</span>
                  </div>
                  <p className="text-neutral-500 mt-2">תשלום חד פעמי בלבד</p>
                </div>
                
                {/* Features */}
                <div className="space-y-4 mb-8">
                  {[
                    { text: "כתב תביעה מקצועי מותאם אישית", icon: "📄" },
                    { text: "קובץ PDF מוכן להגשה", icon: "✅" },
                    { text: "הנחיות מפורטות להגשה עצמית", icon: "📋" },
                    { text: "תמיכה אם יש שאלות", icon: "💬" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-neutral-50 rounded-xl">
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-neutral-700 font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
                
                {/* CTA Button */}
                <Link
                  href="/chat"
                  className="block w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/25 text-center"
                >
                  התחילו עכשיו
                </Link>
                
                {/* Trust note */}
                <div className="flex items-center justify-center gap-2 mt-5 text-sm text-neutral-500">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span>משלמים רק אחרי שרואים את התוצאה</span>
                </div>
              </div>
            </div>
            
            {/* Comparison */}
            <div className="mt-10 grid grid-cols-2 gap-4 text-center">
              <div className="bg-neutral-100 rounded-2xl p-5">
                <p className="text-sm text-neutral-500 mb-1">עורך דין</p>
                <p className="text-2xl font-bold text-neutral-400 line-through">₪2,000+</p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-5 border-2 border-blue-200">
                <p className="text-sm text-blue-600 mb-1">תבעתי</p>
                <p className="text-2xl font-bold text-blue-600">₪{PRICES.claims}</p>
              </div>
            </div>
            
            <p className="text-center text-sm text-neutral-500 mt-4">
              אותה תוצאה. 96% פחות.
            </p>
          </div>
        </div>
      </section>

      {/* Customer Testimonials / Trust */}
      <TestimonialsCarousel />

      {/* Use Cases */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">על מה אפשר לתבוע?</h2>
            <p className="text-lg text-neutral-600">כמעט על כל דבר עד ₪38,900</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "✈️ טיסות ותיירות", desc: "טיסה בוטלה? מזוודה נעלמה?" },
              { name: "🏠 שכירות", desc: "לא מחזירים לך פיקדון?" },
              { name: "📱 ספאם", desc: "מציקים לך בהודעות?" },
              { name: "🛒 קניות", desc: "מוצר לא עובד? לא מחזירים כסף?" },
              { name: "🚗 רכב", desc: "המוסך גבה יותר מדי?" },
              { name: "🔧 שירות", desc: "קבלן לא סיים את העבודה?" },
            ].map((type) => (
              <div
                key={type.name}
                className="bg-neutral-50 rounded-xl p-5 border border-neutral-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
              >
                <h3 className="font-semibold text-neutral-900 mb-1">{type.name}</h3>
                <p className="text-sm text-neutral-600">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section - Server Component */}
      {blogSection}

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-6 bg-neutral-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">עוד שאלות?</h2>
          </div>
          
          <div className="space-y-4">
            {[
              { q: "זה באמת עובד?", a: "בהחלט. 73% מהתביעות הקטנות בישראל מסתיימות בהצלחה. המערכת שלנו מכינה כתבי תביעה כמו עורך דין אמיתי." },
              { q: "כמה זמן זה לוקח?", a: "5 דקות בערך. אתם עונים על כמה שאלות ומקבלים כתב תביעה מוכן." },
              { q: "אני צריך עורך דין?", a: "לא! בית משפט לתביעות קטנות נבנה בדיוק בשביל שתוכלו לייצג את עצמכם. אנחנו מכינים לכם את כל מה שצריך." },
              { q: "מתי משלמים?", a: "רק אחרי שרואים את כתב התביעה ומרוצים. אין סיכון." },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-lg border-b border-neutral-100 p-4">
                <h3 className="font-semibold text-neutral-900 mb-2">{item.q}</h3>
                <p className="text-neutral-700">{item.a}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link
              href="/faq"
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
            >
              לכל השאלות הנפוצות
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 bg-gradient-to-br from-blue-600 to-blue-700" aria-labelledby="cta-title">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 id="cta-title" className="text-3xl md:text-4xl font-bold mb-4">
            מגיע לכם יותר 💪
          </h2>
          <p className="text-lg mb-8 text-blue-100">
            בואו נכין לכם תביעה שתביא תוצאות
          </p>
          
          <Link
            href="/chat"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-colors text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 shadow-lg"
          >
            יאללה, מתחילים
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      </main>

      <Footer />
    </div>
  );
}
