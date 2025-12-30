import type { Metadata } from "next";
import ContractorPageClient from "./ContractorPageClient";

export const metadata: Metadata = {
  title: "תביעה נגד קבלן או בעל מקצוע | עבודה גרועה, עיכובים, נזקים | תבעתי",
  description: "קבלן עשה עבודה גרועה? עיכובים בלתי נגמרים? נזקים לרכוש? מדריך מלא להגשת תביעה קטנה נגד בעלי מקצוע.",
  keywords: ["תביעה נגד קבלן", "קבלן שיפוצים תביעה", "עבודה לקויה תביעה", "בעל מקצוע גרוע"],
  openGraph: {
    title: "תביעה נגד קבלן | תבעתי",
    description: "איך לתבוע קבלן או בעל מקצוע שעשה עבודה גרועה",
  },
};

export default function ContractorPage() {
  return <ContractorPageClient />;
}
