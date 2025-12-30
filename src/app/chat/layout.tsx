import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "צור תביעה | תבעתי - מחולל תביעות קטנות",
  description: "התחל להכין את כתב התביעה שלך עכשיו. מערכת חכמה שמנחה אותך צעד אחר צעד ומייצרת כתב תביעה מקצועי תוך דקות.",
  openGraph: {
    title: "צור תביעה | תבעתי",
    description: "התחל להכין את כתב התביעה שלך עכשיו. מערכת חכמה שמנחה אותך צעד אחר צעד.",
    url: "https://tavati.co.il/chat",
  },
  alternates: {
    canonical: "https://tavati.co.il/chat",
  },
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
