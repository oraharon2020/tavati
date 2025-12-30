import type { Metadata } from "next";
import MedicalPageClient from "./MedicalPageClient";

export const metadata: Metadata = {
  title: "תביעות שירותי בריאות | קופות חולים, רופאים, שיניים | תבעתי",
  description: "קופת חולים דחתה טיפול? רופא שיניים עשה עבודה גרועה? מדריך לתביעות בנושאי בריאות בתביעות קטנות.",
  keywords: ["תביעה נגד קופת חולים", "תביעה רופא שיניים", "רשלנות רפואית", "תביעת בריאות"],
  openGraph: {
    title: "תביעות בריאות | תבעתי",
    description: "איך לתבוע על שירותי בריאות לקויים",
  },
};

export default function MedicalPage() {
  return <MedicalPageClient />;
}
