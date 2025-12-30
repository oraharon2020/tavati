import { Metadata } from "next";
import ExamplesPageClient from "./ExamplesPageClient";

export const metadata: Metadata = {
  title: "דוגמאות לכתבי תביעה | תבעתי - תביעות קטנות",
  description: "דוגמאות אמיתיות לכתבי תביעה בתביעות קטנות. ראו איך נראה כתב תביעה מקצועי על פיקדון, חברת ביטוח, קבלן, ועוד.",
  keywords: ["דוגמא לכתב תביעה", "דוגמת כתב תביעה", "כתב תביעה לדוגמה", "טופס תביעה קטנה", "איך כותבים כתב תביעה"],
};

export default function ExamplesPage() {
  return <ExamplesPageClient />;
}
