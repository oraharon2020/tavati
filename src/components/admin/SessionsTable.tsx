"use client";

import { useState } from "react";
import { Search, Download } from "lucide-react";

interface Session {
  id: string;
  phone: string;
  status: string;
  currentStep: number;
  createdAt: string;
  updatedAt: string;
  topic: string;
}

interface SessionsTableProps {
  sessions: Session[];
}

export default function SessionsTable({ sessions }: SessionsTableProps) {
  const [search, setSearch] = useState("");

  const filteredSessions = sessions.filter(
    (s) =>
      s.phone.includes(search) ||
      s.topic.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; text: string; label: string }> = {
      active: { bg: "bg-blue-50", text: "text-blue-700", label: "פעיל" },
      completed: { bg: "bg-green-50", text: "text-green-700", label: "הושלם" },
      paid: { bg: "bg-purple-50", text: "text-purple-700", label: "שולם" },
    };
    const c = config[status] || { bg: "bg-gray-50", text: "text-gray-700", label: status };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
        {c.label}
      </span>
    );
  };

  const exportCSV = () => {
    const headers = ["טלפון", "נושא", "סטטוס", "שלב", "נוצר", "עודכן"];
    const rows = filteredSessions.map((s) => [
      s.phone,
      s.topic,
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
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="חיפוש לפי טלפון או נושא..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-neutral-900"
          />
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
              <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase">טלפון</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase">נושא</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase">סטטוס</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase">שלב</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase">נוצר</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredSessions.map((session) => (
              <tr key={session.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3 font-mono text-sm text-neutral-900">{session.phone}</td>
                <td className="px-4 py-3 text-sm text-neutral-700">{session.topic}</td>
                <td className="px-4 py-3">{getStatusBadge(session.status)}</td>
                <td className="px-4 py-3 text-sm text-neutral-500">{session.currentStep}/8</td>
                <td className="px-4 py-3 text-sm text-neutral-500">{formatDate(session.createdAt)}</td>
              </tr>
            ))}
            {filteredSessions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                  {search ? "לא נמצאו תוצאות" : "אין תביעות עדיין"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-neutral-100 text-sm text-neutral-500">
        מציג {filteredSessions.length} מתוך {sessions.length} תביעות
      </div>
    </div>
  );
}
