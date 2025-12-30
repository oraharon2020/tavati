import type { Metadata } from "next";
import TelecomPageClient from "./TelecomPageClient";

export const metadata: Metadata = {
  title: "תביעה נגד חברת סלולר או אינטרנט | חיובים לא מוצדקים | תבעתי",
  description: "חויבת על שירותים שלא הזמנת? הבטיחו מחיר אחד וגבו יותר? מדריך להגשת תביעה נגד חברות תקשורת - פלאפון, סלקום, פרטנר, הוט.",
  keywords: ["תביעה נגד סלקום", "תביעה נגד פרטנר", "חיוב לא מוצדק סלולר", "תביעה נגד הוט"],
  openGraph: {
    title: "תביעה נגד חברת סלולר/אינטרנט | תבעתי",
    description: "איך לתבוע חברות תקשורת על חיובים לא מוצדקים",
  },
};

export default function TelecomPage() {
  return <TelecomPageClient />;
}
