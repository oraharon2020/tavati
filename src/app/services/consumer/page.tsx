import type { Metadata } from "next";
import ConsumerPageClient from "./ConsumerPageClient";

export const metadata: Metadata = {
  title: "תביעות צרכניות | מוצר פגום, החזרות, אחריות | תבעתי",
  description: "קניתם מוצר פגום ולא מחזירים? אחריות שלא מכבדים? מדריך להגשת תביעה צרכנית בתביעות קטנות.",
  keywords: ["תביעה צרכנית", "מוצר פגום תביעה", "אחריות לא מכובדת", "החזרת מוצר"],
  openGraph: {
    title: "תביעות צרכניות | תבעתי",
    description: "איך לתבוע חנות או יצרן על מוצר פגום",
  },
};

export default function ConsumerPage() {
  return <ConsumerPageClient />;
}
