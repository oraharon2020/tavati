"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// בעתיד אפשר לטעון מהדאטאבייס
export interface Testimonial {
  id: number;
  name: string;
  location: string;
  text: string;
  amount?: string;
  category: string;
  date: string;
  rating: number;
  verified?: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "יוסי כ.",
    location: "פתח תקווה",
    text: "הזמנתי ארון מרשת רהיטים ידועה, הגיע שבור לגמרי. חודשיים התרוצצתי מולם בטלפון, כלום. עשיתי פה תביעה, שלחתי להם העתק, תוך שבוע התקשרו להציע פשרה. קיבלתי החזר מלא + פיצוי.",
    amount: "4,200",
    category: "צרכנות",
    date: "נובמבר 2024",
    rating: 5,
    verified: true,
  },
  {
    id: 2,
    name: "רונית ש.",
    location: "רמת גן",
    text: "הטיסה שלי לפריז בוטלה ברגע האחרון. חברת התעופה הציעה רק שובר. ידעתי שמגיע לי יותר אבל לא ידעתי איך. התביעה הייתה מוכנה תוך דקות, הגשתי אונליין, ואחרי חודשיים קיבלתי פיצוי מלא.",
    amount: "2,800",
    category: "טיסות",
    date: "אוקטובר 2024",
    rating: 5,
    verified: true,
  },
  {
    id: 3,
    name: "אבי מ.",
    location: "באר שבע",
    text: "המשכיר החליט להשאיר 6,000 ש\"ח מהפיקדון על 'נזקים' מומצאים. צילמתי הכל לפני שיצאתי אז ידעתי שאני צודק. הבעיה שלא היה לי כוח לעו\"ד. פה זה היה פשוט, והשופט פסק לטובתי.",
    amount: "6,000",
    category: "שכירות",
    date: "ספטמבר 2024",
    rating: 5,
    verified: true,
  },
  {
    id: 4,
    name: "נועה ל.",
    location: "הרצליה",
    text: "חברת הסלולר גבתה ממני שנה שלמה על שירות שביקשתי לבטל. כל פעם 'טיפלנו בזה'. בסוף עשיתי תביעה דרככם, ופתאום מצאו את כל הבקשות שלי לביטול. קיבלתי החזר מלא.",
    amount: "1,400",
    category: "צרכנות",
    date: "דצמבר 2024",
    rating: 5,
    verified: true,
  },
  {
    id: 5,
    name: "מיכאל ד.",
    location: "תל אביב",
    text: "קניתי אופניים חשמליים יד שניה שהתבררו כגנובים. המשטרה לקחה אותם והמוכר נעלם. הצלחתי לאתר אותו ולתבוע. לקח זמן אבל בסוף קיבלתי את הכסף בחזרה. המערכת פה עזרה מאוד.",
    amount: "3,500",
    category: "קניות פרטיות",
    date: "אוגוסט 2024",
    rating: 5,
    verified: true,
  },
  {
    id: 6,
    name: "ליאת ב.",
    location: "נתניה",
    text: "קבלן שיפוצים לקח מקדמה ונעלם באמצע העבודה. חשבתי שהכסף הלך. עשיתי תביעה, הוא קיבל את ההזמנה והבין שאני רצינית. שילם לפני הדיון כי לא רצה להתעסק.",
    amount: "8,500",
    category: "שירותים",
    date: "נובמבר 2024",
    rating: 5,
    verified: true,
  },
];

// Testimonial Card Component
function TestimonialCard({ testimonial, compact = false }: { testimonial: Testimonial; compact?: boolean }) {
  return (
    <div className={`bg-white rounded-2xl ${compact ? 'p-5' : 'p-6 sm:p-8'} shadow-xl shadow-blue-900/5 border border-neutral-100 relative h-full flex flex-col`}>
      {/* Category tag */}
      <div className="absolute top-4 left-4">
        <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
          {testimonial.category}
        </span>
      </div>
      
      {/* Quote Icon */}
      <Quote className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} text-blue-100 mb-3`} />
      
      {/* Rating */}
      <div className="flex items-center gap-0.5 mb-3">
        {[...Array(testimonial.rating)].map((_, i) => (
          <svg key={i} className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-amber-400`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      
      {/* Text */}
      <p className={`${compact ? 'text-sm' : 'text-base'} text-neutral-700 leading-relaxed mb-4 flex-grow`}>
        &ldquo;{compact ? testimonial.text.slice(0, 120) + '...' : testimonial.text}&rdquo;
      </p>
      
      {/* Footer */}
      <div className={`${compact ? 'flex-col gap-3' : 'flex-row justify-between'} flex flex-wrap gap-3 mt-auto`}>
        <div className="flex items-center gap-2.5">
          {/* Avatar */}
          <div className={`${compact ? 'w-9 h-9 text-sm' : 'w-10 h-10 text-base'} rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold`}>
            {testimonial.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`font-semibold text-neutral-900 ${compact ? 'text-sm' : 'text-sm'}`}>
                {testimonial.name}
              </span>
              {testimonial.verified && (
                <span className="inline-flex items-center text-emerald-600">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
            <span className="text-xs text-neutral-500">
              {testimonial.location}
            </span>
          </div>
        </div>
        
        {testimonial.amount && (
          <div className="bg-emerald-50 px-3 py-1.5 rounded-lg self-start">
            <span className="text-xs text-emerald-600">זכה ב-</span>
            <span className={`${compact ? 'text-sm' : 'text-base'} font-bold text-emerald-700 mr-1`}>
              ₪{testimonial.amount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Show 3 on desktop, 1 on mobile
  const getVisibleCount = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768 ? 3 : 1;
    }
    return 1;
  };

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Get visible testimonials (3 for desktop, 1 for mobile)
  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push(testimonials[index]);
    }
    return visible;
  };

  const visibleTestimonials = getVisibleTestimonials();

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      position: "absolute" as const,
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative" as const,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      position: "absolute" as const,
    }),
  };

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-white to-blue-50/50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
            סיפורי הצלחה אמיתיים
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
            הם תבעו. הם ניצחו.
          </h2>
          <p className="text-neutral-600">
            אנשים רגילים שהחליטו לא לוותר
          </p>
        </div>

        {/* Carousel */}
        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Cards Container */}
          <div className="relative overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
              >
                {/* Mobile: Show only first testimonial */}
                <div className="md:hidden">
                  <TestimonialCard testimonial={visibleTestimonials[0]} />
                </div>
                
                {/* Desktop: Show all 3 testimonials */}
                {visibleTestimonials.map((testimonial, idx) => (
                  <div key={testimonial.id} className="hidden md:block">
                    <TestimonialCard testimonial={testimonial} compact />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-12 h-12 bg-white rounded-full shadow-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-blue-600 hover:border-blue-300 transition-all z-10"
            aria-label="הקודם"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-12 h-12 bg-white rounded-full shadow-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-blue-600 hover:border-blue-300 transition-all z-10"
            aria-label="הבא"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Dots - show fewer on desktop since we show 3 at a time */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "w-8 h-2 bg-blue-600"
                  : "w-2 h-2 bg-neutral-300 hover:bg-neutral-400"
              }`}
              aria-label={`עבור לביקורת ${index + 1}`}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto px-2">
          <div className="text-center p-2 sm:p-4">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">73%</div>
            <div className="text-xs sm:text-sm text-neutral-500 mt-1">שיעור הצלחה</div>
          </div>
          <div className="text-center p-2 sm:p-4 border-x border-neutral-200">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">₪5,800</div>
            <div className="text-xs sm:text-sm text-neutral-500 mt-1">זכייה ממוצעת</div>
          </div>
          <div className="text-center p-2 sm:p-4">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">5 דק׳</div>
            <div className="text-xs sm:text-sm text-neutral-500 mt-1">זמן הכנה</div>
          </div>
        </div>
      </div>
    </section>
  );
}
