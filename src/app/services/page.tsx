"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Shield, 
  Home, 
  Wrench, 
  Smartphone, 
  Car, 
  ShoppingBag,
  Briefcase,
  Heart,
  ArrowLeft
} from "lucide-react";

const services = [
  {
    slug: "insurance",
    title: "תביעות נגד חברות ביטוח",
    description: "דחו לך תביעה? שילמו פחות ממה שמגיע? זה המדריך בשבילך.",
    icon: Shield,
    color: "from-blue-500 to-blue-600",
  },
  {
    slug: "landlord",
    title: "תביעות שכירות ומשכירים",
    description: "פיקדון שלא חזר, נזקים בדירה, או שוכר בעייתי? יש מה לעשות.",
    icon: Home,
    color: "from-green-500 to-green-600",
  },
  {
    slug: "contractor",
    title: "תביעות נגד קבלנים ובעלי מקצוע",
    description: "עבודה גרועה, עיכובים, או נזקים? לא חייבים לבלוע את זה.",
    icon: Wrench,
    color: "from-orange-500 to-orange-600",
  },
  {
    slug: "telecom",
    title: "תביעות נגד חברות סלולר ואינטרנט",
    description: "חיובים מופרכים, שירות גרוע, הבטחות שלא קוימו.",
    icon: Smartphone,
    color: "from-purple-500 to-purple-600",
  },
  {
    slug: "traffic",
    title: "תביעות תאונות דרכים קלות",
    description: "פחחות ורכב, נזק לרכוש, ויכוחים עם הצד השני.",
    icon: Car,
    color: "from-red-500 to-red-600",
  },
  {
    slug: "consumer",
    title: "תביעות צרכניות",
    description: "מוצר פגום, החזרות, אחריות שלא מכבדים.",
    icon: ShoppingBag,
    color: "from-pink-500 to-pink-600",
  },
  {
    slug: "employer",
    title: "תביעות עבודה קטנות",
    description: "שכר שלא שולם, תנאים לא חוקיים, פיטורים בעייתיים.",
    icon: Briefcase,
    color: "from-indigo-500 to-indigo-600",
  },
  {
    slug: "medical",
    title: "תביעות שירותי בריאות",
    description: "קופות חולים, רופאים פרטיים, טיפולי שיניים.",
    icon: Heart,
    color: "from-teal-500 to-teal-600",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <Header />
      <main className="flex-1">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            מדריכים לפי סוג תביעה
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            לא משנה מה הבעיה - יש דרך לטפל בה. בחרו את סוג התביעה שמתאים לכם 
            ותקבלו מדריך מפורט עם כל מה שצריך לדעת.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-slate-200 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h2>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  {service.description}
                </p>
                <span className="inline-flex items-center text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                  למדריך המלא
                  <ArrowLeft className="w-4 h-4 mr-1" />
                </span>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="inline-block bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-slate-800 mb-3">
              לא מצאתם את מה שחיפשתם?
            </h3>
            <p className="text-slate-600 mb-6">
              המערכת שלנו יודעת לטפל בכל סוג של תביעה קטנה. פשוט התחילו ותספרו לנו מה קרה.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              התחילו עכשיו - בחינם
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
