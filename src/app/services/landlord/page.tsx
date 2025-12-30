import type { Metadata } from "next";
import LandlordPageClient from "./LandlordPageClient";

export const metadata: Metadata = {
  title: "תביעה נגד משכיר או שוכר | פיקדון, נזקים, הפרת חוזה | תבעתי",
  description: "פיקדון שלא חזר? שוכר שהשאיר נזקים? משכיר שלא מתקן? מדריך מלא לתביעות שכירות בתביעות קטנות.",
  keywords: ["תביעה נגד משכיר", "החזרת פיקדון", "תביעה נגד שוכר", "נזקים לדירה תביעה"],
  openGraph: {
    title: "תביעה על שכירות | תבעתי",
    description: "מדריך להגשת תביעה בנושאי שכירות דירה",
  },
};

export default function LandlordPage() {
  return <LandlordPageClient />;
}
