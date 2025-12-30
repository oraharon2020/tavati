import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "סוגי תביעות קטנות | תבעתי",
  description: "מדריכים מקיפים להגשת תביעות קטנות לפי סוג - ביטוח, קבלנים, שכירות, תקשורת ועוד. כל מה שצריך לדעת לפני שתובעים.",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
