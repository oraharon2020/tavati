"use client";

import { Users, TrendingUp, DollarSign } from "lucide-react";

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

interface ReferralsManagerProps {
  referralCodes: ReferralCode[];
  referralUsage: ReferralUsage[];
}

export default function ReferralsManager({
  referralCodes,
  referralUsage,
}: ReferralsManagerProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("he-IL");
  };

  const formatPhone = (phone: string) => {
    // מסתיר חלק מהמספר לפרטיות
    if (phone.length > 6) {
      return phone.slice(0, 3) + "****" + phone.slice(-3);
    }
    return phone;
  };

  const totalReferrals = referralCodes.reduce((sum, r) => sum + r.referral_count, 0);
  const totalEarnings = referralCodes.reduce((sum, r) => sum + Number(r.total_earnings), 0);
  const activeReferrers = referralCodes.filter((r) => r.referral_count > 0).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
            הושלם
          </span>
        );
      case "pending":
        return (
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
            ממתין
          </span>
        );
      case "cancelled":
        return (
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
            בוטל
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center gap-2 text-neutral-500 text-sm mb-1">
            <Users className="w-4 h-4" />
            ממליצים פעילים
          </div>
          <div className="text-2xl font-bold text-neutral-900">{activeReferrers}</div>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center gap-2 text-neutral-500 text-sm mb-1">
            <TrendingUp className="w-4 h-4" />
            סה״כ הפניות
          </div>
          <div className="text-2xl font-bold text-neutral-900">{totalReferrals}</div>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center gap-2 text-neutral-500 text-sm mb-1">
            <DollarSign className="w-4 h-4" />
            סה״כ קרדיטים
          </div>
          <div className="text-2xl font-bold text-green-600">₪{totalEarnings}</div>
        </div>
      </div>

      {/* Referral Codes Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <h2 className="font-semibold text-neutral-900 flex items-center gap-2">
            <Users className="w-5 h-5" />
            קודי הפניה
          </h2>
        </div>
        {referralCodes.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">אין קודי הפניה עדיין</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-neutral-600">
                <tr>
                  <th className="text-right py-3 px-4 font-medium">טלפון</th>
                  <th className="text-right py-3 px-4 font-medium">קוד</th>
                  <th className="text-right py-3 px-4 font-medium">הפניות</th>
                  <th className="text-right py-3 px-4 font-medium">קרדיטים</th>
                  <th className="text-right py-3 px-4 font-medium">נוצר</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {referralCodes.map((ref) => (
                  <tr key={ref.id} className="hover:bg-neutral-50">
                    <td className="py-3 px-4 font-mono text-neutral-600">
                      {formatPhone(ref.phone)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {ref.code}
                      </span>
                    </td>
                    <td className="py-3 px-4">{ref.referral_count}</td>
                    <td className="py-3 px-4 text-green-600 font-semibold">
                      ₪{ref.total_earnings}
                    </td>
                    <td className="py-3 px-4 text-neutral-500">
                      {formatDate(ref.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Referral Usage */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <h2 className="font-semibold text-neutral-900">היסטוריית הפניות אחרונות</h2>
        </div>
        {referralUsage.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">אין הפניות עדיין</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-neutral-600">
                <tr>
                  <th className="text-right py-3 px-4 font-medium">קוד</th>
                  <th className="text-right py-3 px-4 font-medium">ממליץ</th>
                  <th className="text-right py-3 px-4 font-medium">מופנה</th>
                  <th className="text-right py-3 px-4 font-medium">סטטוס</th>
                  <th className="text-right py-3 px-4 font-medium">תאריך</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {referralUsage.map((usage) => (
                  <tr key={usage.id} className="hover:bg-neutral-50">
                    <td className="py-3 px-4">
                      <span className="font-mono text-blue-600">{usage.referral_code}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-600">
                      {formatPhone(usage.referrer_phone)}
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-600">
                      {formatPhone(usage.referred_phone)}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(usage.status)}</td>
                    <td className="py-3 px-4 text-neutral-500">
                      {formatDate(usage.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
