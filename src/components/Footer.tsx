import { Scale } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 px-6 bg-neutral-900 text-white" role="contentinfo">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="תבעתי - עמוד הבית">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">תבעתי</span>
            </Link>
            <p className="text-neutral-400 text-sm">
              הכנת תביעות קטנות בקלות ובמהירות. בלי עורך דין, בלי סיבוכים.
            </p>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="font-bold mb-4 text-white">סוגי תביעות</h3>
            <nav className="flex flex-col gap-2 text-sm text-neutral-400" aria-label="סוגי תביעות">
              <Link href="/services/insurance" className="hover:text-white transition-colors">תביעות ביטוח</Link>
              <Link href="/services/landlord" className="hover:text-white transition-colors">תביעות שכירות</Link>
              <Link href="/services/contractor" className="hover:text-white transition-colors">תביעות קבלנים</Link>
              <Link href="/services/telecom" className="hover:text-white transition-colors">תביעות סלולר</Link>
              <Link href="/services/consumer" className="hover:text-white transition-colors">תביעות צרכניות</Link>
              <Link href="/services" className="hover:text-white transition-colors text-blue-400">כל סוגי התביעות →</Link>
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold mb-4 text-white">מידע שימושי</h3>
            <nav className="flex flex-col gap-2 text-sm text-neutral-400" aria-label="מידע שימושי">
              <Link href="/examples" className="hover:text-white transition-colors">דוגמאות לכתבי תביעה</Link>
              <Link href="/warning-letter" className="hover:text-white transition-colors">מכתב התראה</Link>
              <Link href="/blog" className="hover:text-white transition-colors">מדריכים וטיפים</Link>
              <Link href="/faq" className="hover:text-white transition-colors">שאלות נפוצות</Link>
              <Link href="/contact" className="hover:text-white transition-colors">צור קשר</Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold mb-4 text-white">מידע משפטי</h3>
            <nav className="flex flex-col gap-2 text-sm text-neutral-400" aria-label="מידע משפטי">
              <Link href="/terms" className="hover:text-white transition-colors">תנאי שימוש</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">מדיניות פרטיות</Link>
              <Link href="/refund" className="hover:text-white transition-colors">מדיניות ביטולים</Link>
            </nav>
          </div>
        </div>
        
        <div className="pt-6 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
            <p>© {new Date().getFullYear()} תבעתי. כל הזכויות שמורות.</p>
            <p className="text-xs text-center md:text-right max-w-md">
              אינו מהווה ייעוץ משפטי. המידע לצרכי מידע כללי בלבד.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
