import { Metadata } from "next";
import WarningLetterPageClient from "./WarningLetterPageClient";

export const metadata: Metadata = {
  title: "מכתב התראה לפני תביעה | תבעתי",
  description: "תבנית חינמית למכתב התראה לפני הגשת תביעה קטנה. למדו מתי ואיך לשלוח מכתב התראה שיגביר את הסיכוי לפתרון מחוץ לבית המשפט.",
  keywords: ["מכתב התראה", "תביעות קטנות", "לפני תביעה", "דרישת תשלום", "התראה משפטית"],
  openGraph: {
    title: "מכתב התראה לפני תביעה | תבעתי",
    description: "תבנית חינמית למכתב התראה לפני הגשת תביעה קטנה",
    type: "website",
  },
};

export default function WarningLetterPage() {
  return <WarningLetterPageClient />;
}
