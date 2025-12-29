"use client";

import { useState } from "react";
import { Scale, ArrowLeft, FolderOpen, Menu, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, phone } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-sm" role="banner">
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:outline-none"
      >
        דלג לתוכן הראשי
      </a>
      
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="תבעתי - עמוד הבית">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0066ff] to-[#00a0ff] flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-shadow">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-xl text-neutral-900">תבעתי</span>
              <span className="text-xs text-blue-600 font-semibold block -mt-0.5">תביעות קטנות בקלות</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="ניווט ראשי">
            <Link href="/" className="px-4 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-blue-50 rounded-lg transition-colors">
              בית
            </Link>
            <Link href="/#how-it-works" className="px-4 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-blue-50 rounded-lg transition-colors">
              איך זה עובד
            </Link>
            <Link href="/#pricing" className="px-4 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-blue-50 rounded-lg transition-colors">
              מחירים
            </Link>
            <Link href="/#faq" className="px-4 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-blue-50 rounded-lg transition-colors">
              שאלות נפוצות
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* My Area Button */}
            <Link 
              href="/my-area"
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors font-semibold text-sm"
            >
              <FolderOpen className="w-4 h-4" />
              <span>האזור שלי</span>
            </Link>

            {/* CTA Button */}
            <Link 
              href="/chat"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#0066ff] to-[#0088ff] text-white rounded-xl hover:from-[#0052cc] hover:to-[#0066ff] transition-all text-sm font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              <span>התחל תביעה</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "סגור תפריט" : "פתח תפריט"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden mt-4 pt-4 border-t border-neutral-100">
            <nav className="flex flex-col gap-2" aria-label="תפריט נייד">
              <Link href="/" className="px-4 py-3 text-neutral-900 font-semibold hover:bg-blue-50 rounded-lg transition-colors">
                בית
              </Link>
              <Link href="/#how-it-works" className="px-4 py-3 text-neutral-600 hover:text-neutral-900 hover:bg-blue-50 rounded-lg transition-colors">
                איך זה עובד
              </Link>
              <Link href="/#pricing" className="px-4 py-3 text-neutral-600 hover:text-neutral-900 hover:bg-blue-50 rounded-lg transition-colors">
                מחירים
              </Link>
              <Link href="/#faq" className="px-4 py-3 text-neutral-600 hover:text-neutral-900 hover:bg-blue-50 rounded-lg transition-colors">
                שאלות נפוצות
              </Link>
              <div className="border-t border-neutral-100 mt-2 pt-2">
                <Link href="/my-area" className="flex items-center gap-2 px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-semibold">
                  <FolderOpen className="w-5 h-5" />
                  <span>האזור שלי</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
