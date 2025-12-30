import type { Metadata } from "next";
import InsurancePageClient from "./InsurancePageClient";

export const metadata: Metadata = {
  title: "תביעה נגד חברת ביטוח | איך לתבוע ולנצח | תבעתי",
  description: "חברת הביטוח דחתה תביעה או שילמה פחות ממה שמגיע? מדריך מלא להגשת תביעה קטנה נגד ביטוח - עם טיפים שעובדים באמת.",
  keywords: ["תביעה נגד ביטוח", "חברת ביטוח דחתה תביעה", "ביטוח רכב תביעה קטנה", "ביטוח בריאות תביעה"],
  openGraph: {
    title: "תביעה נגד חברת ביטוח | תבעתי",
    description: "המדריך המלא לתביעות נגד חברות ביטוח בתביעות קטנות",
  },
};

export default function InsurancePage() {
  return <InsurancePageClient />;
}
