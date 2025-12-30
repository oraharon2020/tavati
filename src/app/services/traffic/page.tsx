import type { Metadata } from "next";
import TrafficPageClient from "./TrafficPageClient";

export const metadata: Metadata = {
  title: "תביעה על תאונת דרכים קלה | נזקי רכוש ופחחות | תבעתי",
  description: "הייתה לך תאונה קלה והצד השני לא משלם? ביטוח מתחמק? מדריך להגשת תביעה קטנה על נזקי רכב.",
  keywords: ["תביעה תאונת דרכים", "נזקי רכב תביעה קטנה", "פחחות תביעה", "תאונה קלה"],
  openGraph: {
    title: "תביעה על תאונת דרכים | תבעתי",
    description: "איך לתבוע על נזקי רכב בתאונת דרכים קלה",
  },
};

export default function TrafficPage() {
  return <TrafficPageClient />;
}
