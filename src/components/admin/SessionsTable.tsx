"use client";

import { useState } from "react";
import { Search, Download, Eye, ExternalLink } from "lucide-react";

interface Session {
  id: string;
  phone: string;
  status: string;
  currentStep: number;
  createdAt: string;
  updatedAt: string;
  topic: string;
  defendant?: string;
  amount?: number;
  plaintiff?: string;
  serviceType?: "claims" | "parking";
}

interface SessionsTableProps {
  sessions: Session[];
}

export default function SessionsTable({ sessions }: SessionsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch = 
      s.phone.includes(search) ||
      s.topic.toLowerCase().includes(search.toLowerCase()) ||
      (s.defendant && s.defendant.toLowerCase().includes(search.toLowerCase())) ||
      (s.plaintiff && s.plaintiff.toLowerCase().includes(search.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTopicLabel = (topic: string): string => {
    const labels: Record<string, string> = {
      consumer: "צרכנית",
      contract: "הפרת חוזה",
      rental: "שכירות",
      damage: "נזקים",
      service: "שירות לקוי",
      flight: "טיסה",
      spam: "ספאם",
      other: "אחר",
    };
    return labels[topic] || topic || "לא צוין";
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; text: string; label: string }> = {
      in_progress: { bg: "bg-blue-50", text: "text-blue-700", label: "בתהליך" },
      pending_payment: { bg: "bg-amber-50", text: "text-amber-700", label: "ממתין לתשלום" },
      completed: { bg: "bg-green-50", text: "text-green-700", label: "הושלם" },
      paid: { bg: "bg-purple-50", text: "text-purple-700", label: "שולם ✓" },
    };
    const c = config[status] || { bg: "bg-gray-50", text: "text-gray-700", label: status };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
        {c.label}
      </span>
    );
  };

  const exportCSV = () => {
    const headers = ["טלפון", "תובע", "נתבע", "סוג", "סכום", "סטטוס", "שלב", "נוצר", "עודכן"];
    const rows = filteredSessions.map((s) => [
      s.phone,
      s.plaintiff || "",
      s.defendant || "",
      getTopicLabel(s.topic),
      s.amount || 0,
      s.status,
      `${s.currentStep}/8`,
      formatDate(s.createdAt),
      formatDate(s.updatedAt),
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `תביעות_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-neutral-100 flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="חיפוש לפי טלפון, נתבע, תובע..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-neutral-900"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 text-neutral-900 bg-white"
          >
            <option value="all">כל הסטטוסים</option>
            <option value="in_progress">בתהליך</option>
            <option value="pending_payment">ממתין לתשלום</option>
            <option value="paid">שולם</option>
            <option value="completed">הושלם</option>
          </select>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm font-medium transition-colors text-neutral-700"
        >
          <Download className="w-4 h-4" />
          CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase">שירות</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase">טלפון</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase">תובע</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase">נתבע</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase">סוג</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase">סכום</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase">סטטוס</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase">שלב</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase">נוצר</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredSessions.map((session) => (
              <tr key={session.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                    session.serviceType === 'parking' 
                      ? 'bg-teal-100 text-teal-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {session.serviceType === 'parking' ? '🅿️ חניה' : '⚖️ תביעה'}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-sm text-neutral-900">{session.phone}</td>
                <td className="px-4 py-3 text-sm text-neutral-700">{session.plaintiff || "-"}</td>
                <td className="px-4 py-3 text-sm text-neutral-700 max-w-[150px] truncate" title={session.defendant}>{session.defendant || "-"}</td>
                <td className="px-4 py-3 text-sm text-neutral-500">{getTopicLabel(session.topic)}</td>
                <td className="px-4 py-3 text-sm font-medium text-neutral-900">
                  {session.amount ? `₪${session.amount.toLocaleString()}` : "-"}
                </td>
                <td className="px-4 py-3">{getStatusBadge(session.status)}</td>
                <td className="px-4 py-3 text-sm text-neutral-500">{session.currentStep}/{session.serviceType === 'parking' ? 5 : 8}</td>
                <td className="px-4 py-3 text-sm text-neutral-500">{formatDate(session.createdAt)}</td>
                <td className="px-4 py-3">
                  <a 
                    href={`/chat?session=${session.id}${session.serviceType === 'parking' ? '&service=parking' : ''}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    צפה
                  </a>
                </td>
              </tr>
            ))}
            {filteredSessions.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-neutral-500">
                  {search || statusFilter !== "all" ? "לא נמצאו תוצאות" : "אין תביעות עדיין"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-neutral-100 text-sm text-neutral-500 flex justify-between items-center">
        <span>מציג {filteredSessions.length} מתוך {sessions.length} תביעות</span>
        <div className="flex gap-4 text-xs">
          <span className="text-purple-600 font-medium">
            שולמו: {sessions.filter(s => s.status === "paid").length}
          </span>
          <span className="text-blue-600 font-medium">
            בתהליך: {sessions.filter(s => s.status === "in_progress").length}
          </span>
        </div>
      </div>
    </div>
  );
}
