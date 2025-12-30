import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ToastProvider } from "@/components/Toast";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  metadataBase: new URL("https://tavati.co.il"),
  title: "תבעתי - תביעות קטנות בקלות | כתב תביעה תוך דקות",
  description: "צרו כתב תביעה מקצועי לבית משפט לתביעות קטנות תוך דקות. המערכת החכמה שמנחה אתכם צעד אחר צעד. ללא צורך בעורך דין. רק ₪79.",
  keywords: [
    "תביעות קטנות", 
    "בית משפט", 
    "כתב תביעה", 
    "תביעה קטנה", 
    "הגשת תביעה", 
    "טופס תביעה",
    "איך מגישים תביעה קטנה",
    "דוגמא לכתב תביעה",
    "דוגמת כתב תביעה",
    "תביעה קטנה לבד",
    "להגיש תביעה בעצמי",
    "עד כמה אפשר לתבוע",
    "כמה זמן לוקח תביעה קטנה",
    "מכתב התראה לפני תביעה",
    "תביעה על פיקדון",
    "תביעה על עוגמת נפש",
    "איך להתכונן לדיון",
    "אגרת בית משפט"
  ],
  authors: [{ name: "תבעתי" }],
  creator: "תבעתי",
  publisher: "תבעתי",
  robots: "index, follow",
  applicationName: "תבעתי",
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: "https://tavati.co.il",
    siteName: "תבעתי",
    title: "תבעתי - תביעות קטנות בקלות",
    description: "צרו כתב תביעה מקצועי לבית משפט לתביעות קטנות תוך דקות. ללא צורך בעורך דין.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "תבעתי - תביעות קטנות בקלות",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "תבעתי - תביעות קטנות בקלות",
    description: "צרו כתב תביעה מקצועי לבית משפט לתביעות קטנות תוך דקות.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://tavati.co.il",
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org JSON-LD for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://tavati.co.il/#website",
        "url": "https://tavati.co.il",
        "name": "תבעתי",
        "description": "תביעות קטנות בקלות - כתב תביעה מקצועי תוך דקות",
        "inLanguage": "he-IL"
      },
      {
        "@type": "Organization",
        "@id": "https://tavati.co.il/#organization",
        "name": "תבעתי",
        "url": "https://tavati.co.il",
        "logo": {
          "@type": "ImageObject",
          "url": "https://tavati.co.il/logo.png"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "availableLanguage": "Hebrew"
        }
      },
      {
        "@type": "SoftwareApplication",
        "name": "תבעתי - מחולל תביעות קטנות",
        "applicationCategory": "LegalService",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "79",
          "priceCurrency": "ILS"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "127"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "כמה עולה להגיש תביעה קטנה?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "הכנת כתב תביעה במערכת תבעתי עולה ₪79 חד פעמי. בנוסף יש אגרת בית משפט של כ-1% מסכום התביעה."
            }
          },
          {
            "@type": "Question",
            "name": "כמה זמן לוקח להכין תביעה?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "בממוצע 5 דקות מהתחלה ועד כתב תביעה מוכן להגשה."
            }
          },
          {
            "@type": "Question",
            "name": "האם צריך עורך דין לתביעות קטנות?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "לא. בית משפט לתביעות קטנות תוכנן להגשה עצמית ללא ייצוג. המערכת שלנו מכינה את כל המסמכים הנדרשים."
            }
          }
        ]
      }
    ]
  };

  return (
    <html lang="he" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <ToastProvider>
            {children}
            <WhatsAppButton />
          </ToastProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
