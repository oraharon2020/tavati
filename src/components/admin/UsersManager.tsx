"use client";

import { useState, useEffect } from "react";
import { Users, UserX, Phone, RefreshCw, Search, Calendar, Ban, UserCheck, Clock, Activity } from "lucide-react";

interface OptedOutUser {
  id: string;
  phone: string;
  reason: string | null;
  opted_out_at: string;
}

interface UserInfo {
  phone: string;
  firstSeen: string;
  lastSeen: string;
  sessionCount: number;
  services: string[];
}

interface UsersStats {
  totalUniqueUsers: number;
  optedOutCount: number;
  activeUsersCount: number;
  optedOutUsers: OptedOutUser[];
  allUsers: UserInfo[];
}

interface UsersManagerProps {
  onRefresh?: () => void;
}

export default function UsersManager({ onRefresh }: UsersManagerProps) {
  const [stats, setStats] = useState<UsersStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "optedOut">("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRemoveOptOut = async (phone: string) => {
    if (!confirm(`להחזיר את ${phone} לרשימת התפוצה?`)) return;
    
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      
      if (res.ok) {
        fetchData();
        onRefresh?.();
      }
    } catch (error) {
      console.error("Error removing opt-out:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPhone = (phone: string) => {
    // Format as 05X-XXX-XXXX
    const clean = phone.replace(/\D/g, "");
    if (clean.startsWith("972")) {
      const local = "0" + clean.slice(3);
      return local.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    }
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  };

  const filteredOptedOut = stats?.optedOutUsers.filter(user => 
    user.phone.includes(searchTerm) || 
    formatPhone(user.phone).includes(searchTerm)
  ) || [];

  const filteredAllUsers = stats?.allUsers.filter(user =>
    user.phone.includes(searchTerm) ||
    formatPhone(user.phone).includes(searchTerm)
  ) || [];

  const optedOutPhones = new Set(stats?.optedOutUsers.map(u => u.phone.replace(/\D/g, "")) || []);

  const serviceLabels: Record<string, string> = {
    claims: "תביעה",
    parking: "חניה",
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center gap-2 text-blue-600 text-sm mb-1">
            <Users className="w-4 h-4" />
            משתמשים ייחודיים
          </div>
          <div className="text-3xl font-bold text-blue-700">
            {loading ? "..." : stats?.totalUniqueUsers || 0}
          </div>
          <p className="text-xs text-blue-500 mt-1">מספרי טלפון ייחודיים</p>
        </div>
        
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
            <UserCheck className="w-4 h-4" />
            פעילים בתפוצה
          </div>
          <div className="text-3xl font-bold text-green-700">
            {loading ? "..." : stats?.activeUsersCount || 0}
          </div>
          <p className="text-xs text-green-500 mt-1">יכולים לקבל SMS</p>
        </div>
        
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center gap-2 text-red-600 text-sm mb-1">
            <UserX className="w-4 h-4" />
            יצאו מרשימת תפוצה
          </div>
          <div className="text-3xl font-bold text-red-700">
            {loading ? "..." : stats?.optedOutCount || 0}
          </div>
          <p className="text-xs text-red-500 mt-1">ביקשו הסרה מ-SMS</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "all"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-neutral-500 hover:text-neutral-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            כל המשתמשים ({stats?.totalUniqueUsers || 0})
          </div>
        </button>
        <button
          onClick={() => setActiveTab("optedOut")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "optedOut"
              ? "border-red-600 text-red-600"
              : "border-transparent text-neutral-500 hover:text-neutral-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <UserX className="w-4 h-4" />
            יצאו מתפוצה ({stats?.optedOutCount || 0})
          </div>
        </button>
      </div>

      {/* All Users Table */}
      {activeTab === "all" && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
            <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              כל המשתמשים
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="חפש טלפון..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-9 pl-3 py-1.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={fetchData}
                className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
                title="רענן"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-neutral-500">טוען...</div>
          ) : filteredAllUsers.length === 0 ? (
            <div className="p-8 text-center text-neutral-500">
              {searchTerm ? "לא נמצאו תוצאות" : "אין משתמשים עדיין"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        טלפון
                      </div>
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        שירותים
                      </div>
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      סשנים
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        פעילות אחרונה
                      </div>
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      סטטוס
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredAllUsers.map((user) => (
                    <tr key={user.phone} className="hover:bg-neutral-50">
                      <td className="px-4 py-3 font-mono text-sm text-neutral-900">
                        {formatPhone(user.phone)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-1">
                          {user.services.map(s => (
                            <span key={s} className={`px-2 py-0.5 rounded text-xs ${
                              s === "claims" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                            }`}>
                              {serviceLabels[s] || s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">
                        {user.sessionCount}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500">
                        {formatDate(user.lastSeen)}
                      </td>
                      <td className="px-4 py-3">
                        {optedOutPhones.has(user.phone.replace(/\D/g, "")) ? (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                            יצא מתפוצה
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                            פעיל
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Opted Out Users Table */}
      {activeTab === "optedOut" && (
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
            <Ban className="w-5 h-5 text-red-500" />
            משתמשים שיצאו מרשימת התפוצה
          </h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="חפש טלפון..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-9 pl-3 py-1.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={fetchData}
              className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
              title="רענן"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-neutral-500">טוען...</div>
        ) : filteredOptedOut.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            {searchTerm ? "לא נמצאו תוצאות" : "אין משתמשים שיצאו מרשימת התפוצה 🎉"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      טלפון
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      תאריך הסרה
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    סיבה
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    פעולות
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredOptedOut.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-mono text-sm text-neutral-900">
                      {formatPhone(user.phone)}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-500">
                      {formatDate(user.opted_out_at)}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-500">
                      {user.reason || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleRemoveOptOut(user.phone)}
                        className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                        title="החזר לרשימת תפוצה"
                      >
                        החזר לתפוצה
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}

      {/* Info */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4">
        <h3 className="font-semibold text-neutral-900 mb-3">ℹ️ מידע על רשימת תפוצה</h3>
        <div className="text-sm text-neutral-600 space-y-2">
          <p>• משתמשים יכולים להסיר את עצמם מרשימת התפוצה דרך הלינק בכל SMS.</p>
          <p>• ברגע שמשתמש יוצא - הוא לא יקבל יותר תזכורות SMS.</p>
          <p>• אפשר להחזיר משתמש לתפוצה ידנית (למשל אם ביקש בטלפון).</p>
          <p>• על פי חוק הספאם הישראלי, חובה לכלול אופציית הסרה בכל הודעה פרסומית.</p>
        </div>
      </div>
    </div>
  );
}
