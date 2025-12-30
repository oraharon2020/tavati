import type { Metadata } from "next";
import EmployerPageClient from "./EmployerPageClient";

export const metadata: Metadata = {
  title: "תביעות עבודה קטנות | שכר, פיטורים, תנאים | תבעתי",
  description: "לא קיבלת משכורת? פוטרת בלי פיצויים? תנאים לא חוקיים? מדריך לתביעות עבודה בבית דין לעבודה.",
  keywords: ["תביעת שכר", "פיצויי פיטורים", "תביעה נגד מעסיק", "בית דין לעבודה"],
  openGraph: {
    title: "תביעות עבודה | תבעתי",
    description: "איך לתבוע מעסיק על שכר או תנאים",
  },
};

export default function EmployerPage() {
  return <EmployerPageClient />;
}
