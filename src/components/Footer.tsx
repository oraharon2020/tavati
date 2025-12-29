import { Scale } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 px-6 bg-neutral-900 text-white" role="contentinfo">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <Link href="/" className="flex items-center gap-2" aria-label="תבעתי - עמוד הבית">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">תבעתי</span>
          </Link>
          
          <nav className="flex items-center gap-6 text-sm text-neutral-400" aria-label="ניווט תחתון">
            <Link href="/#how-it-works" className="hover:text-white transition-colors">איך זה עובד</Link>
            <Link href="/blog" className="hover:text-white transition-colors">בלוג</Link>
            <Link href="/faq" className="hover:text-white transition-colors">שאלות נפוצות</Link>
            <Link href="/contact" className="hover:text-white transition-colors">צור קשר</Link>
            <Link href="/terms" className="hover:text-white transition-colors">תנאי שימוש</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">פרטיות</Link>
          </nav>
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
