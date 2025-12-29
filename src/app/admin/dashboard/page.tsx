"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, RefreshCw } from "lucide-react";
import StatsCards from "@/components/admin/StatsCards";
import SessionsTable from "@/components/admin/SessionsTable";
import ContactsTable from "@/components/admin/ContactsTable";
import PostsManager from "@/components/admin/PostsManager";
import CouponsManager from "@/components/admin/CouponsManager";
import ReferralsManager from "@/components/admin/ReferralsManager";
import RemindersManager from "@/components/admin/RemindersManager";

interface Stats {
  totalSessions: number;
  completedSessions: number;
  paidSessions: number;
  totalRevenue: number;
  last7Days: number;
  todaySessions: number;
  byStatus: {
    active: number;
    completed: number;
    paid: number;
  };
}

interface Session {
  id: string;
  phone: string;
  status: string;
  currentStep: number;
  createdAt: string;
  updatedAt: string;
  topic: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  active: boolean;
  created_at: string;
}

interface ReferralCode {
  id: string;
  phone: string;
  code: string;
  referral_count: number;
  total_earnings: number;
  created_at: string;
}

interface ReferralUsage {
  id: string;
  referral_code: string;
  referrer_phone: string;
  referred_phone: string;
  status: "pending" | "completed" | "cancelled";
  completed_at: string | null;
  created_at: string;
}

type Tab = "sessions" | "contacts" | "posts" | "coupons" | "referrals" | "reminders";

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([]);
  const [referralUsage, setReferralUsage] = useState<ReferralUsage[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("sessions");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch stats and sessions
      const res = await fetch("/api/admin/stats");
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      setStats(data.stats);
      setSessions(data.recentSessions || []);

      // Fetch contacts
      const contactsRes = await fetch("/api/admin/stats", { method: "POST" });
      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        setContacts(contactsData.messages || []);
      }

      // Fetch posts
      const postsRes = await fetch("/api/admin/posts");
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData.posts || []);
      }

      // Fetch coupons
      const couponsRes = await fetch("/api/admin/coupons");
      if (couponsRes.ok) {
        const couponsData = await couponsRes.json();
        setCoupons(couponsData.coupons || []);
      }

      // Fetch referrals
      const referralsRes = await fetch("/api/admin/referrals");
      if (referralsRes.ok) {
        const referralsData = await referralsRes.json();
        setReferralCodes(referralsData.referralCodes || []);
        setReferralUsage(referralsData.referralUsage || []);
      }
    } catch {
      setError("שגיאה בטעינת הנתונים");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  // Posts handlers
  const handleSavePost = async (post: Partial<Post>) => {
    const method = post.id ? "PUT" : "POST";
    const res = await fetch("/api/admin/posts", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    if (res.ok) {
      fetchData();
    }
  };

  const handleDeletePost = async (id: string) => {
    const res = await fetch(`/api/admin/posts?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchData();
    }
  };

  const handleTogglePublish = async (id: string, published: boolean) => {
    const post = posts.find((p) => p.id === id);
    if (post) {
      await handleSavePost({ ...post, published });
    }
  };

  // Coupons handlers
  const handleSaveCoupon = async (coupon: Partial<Coupon>) => {
    const method = coupon.id ? "PUT" : "POST";
    const body = coupon.id
      ? {
          id: coupon.id,
          active: coupon.active,
          description: coupon.description,
          maxUses: coupon.max_uses,
          expiresAt: coupon.expires_at,
        }
      : {
          code: coupon.code,
          description: coupon.description,
          discountType: coupon.discount_type,
          discountValue: coupon.discount_value,
          maxUses: coupon.max_uses,
          expiresAt: coupon.expires_at,
        };
    const res = await fetch("/api/admin/coupons", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      fetchData();
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    const res = await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchData();
    }
  };

  const handleToggleCouponActive = async (id: string, active: boolean) => {
    await handleSaveCoupon({ id, active });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-neutral-500">טוען...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "sessions", label: "תביעות", count: sessions.length },
    { id: "contacts", label: "פניות", count: contacts.length },
    { id: "posts", label: "בלוג", count: posts.length },
    { id: "coupons", label: "קופונים", count: coupons.length },
    { id: "referrals", label: "הפניות", count: referralCodes.length },
    { id: "reminders", label: "תזכורות", count: 0 },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-bold text-neutral-900">🎛️ תבעתי - ניהול</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              title="רענן"
            >
              <RefreshCw className="w-4 h-4 text-neutral-600" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              התנתק
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <StatsCards stats={stats} />

        {/* Tabs */}
        <div className="flex gap-2 border-b border-neutral-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {tab.label}
              <span className="mr-1 text-xs bg-neutral-100 px-1.5 py-0.5 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "sessions" && <SessionsTable sessions={sessions} />}
        {activeTab === "contacts" && <ContactsTable contacts={contacts} />}
        {activeTab === "posts" && (
          <PostsManager
            posts={posts}
            onSave={handleSavePost}
            onDelete={handleDeletePost}
            onTogglePublish={handleTogglePublish}
          />
        )}
        {activeTab === "coupons" && (
          <CouponsManager
            coupons={coupons}
            onSave={handleSaveCoupon}
            onDelete={handleDeleteCoupon}
            onToggleActive={handleToggleCouponActive}
          />
        )}
        {activeTab === "referrals" && (
          <ReferralsManager
            referralCodes={referralCodes}
            referralUsage={referralUsage}
          />
        )}
        {activeTab === "reminders" && (
          <RemindersManager onRefresh={fetchData} />
        )}
      </main>
    </div>
  );
}
