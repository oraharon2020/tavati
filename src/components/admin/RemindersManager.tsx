"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, Clock, CheckCircle, XCircle, RefreshCw, Bell } from "lucide-react";

interface ReminderLog {
  id: string;
  type: string;
  sent_count: number;
  failed_count: number;
  details: {
    sent?: number;
    failed?: number;
    errors?: string[];
  };
  created_at: string;
}

interface RemindersManagerProps {
  onRefresh?: () => void;
}

export default function RemindersManager({ onRefresh }: RemindersManagerProps) {
  const [pendingReminders, setPendingReminders] = useState(0);
  const [recentLogs, setRecentLogs] = useState<ReminderLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reminders");
      if (res.ok) {
        const data = await res.json();
        setPendingReminders(data.pendingReminders || 0);
        setRecentLogs(data.recentLogs || []);
      }
    } catch (error) {
      console.error("Error fetching reminders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendReminders = async () => {
    if (!confirm(`לשלוח תזכורות ל-${pendingReminders} משתמשים?`)) return;
    
    setSending(true);
    setMessage(null);
    
    try {
      const res = await fetch("/api/admin/reminders", {
        method: "POST",
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage({
          type: "success",
          text: `נשלחו ${data.sent} תזכורות בהצלחה${data.failed > 0 ? `, ${data.failed} נכשלו` : ""}`,
        });
        fetchData();
        onRefresh?.();
      } else {
        setMessage({ type: "error", text: data.error || "שגיאה בשליחה" });
      }
    } catch {
      setMessage({ type: "error", text: "שגיאה בשליחת תזכורות" });
    } finally {
      setSending(false);
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "incomplete_claim":
        return "תביעות לא גמורות";
      case "payment_reminder":
        return "תזכורת תשלום";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              תזכורות SMS
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              שליחת SMS אוטומטית למשתמשים שלא סיימו את התביעה
            </p>
          </div>
          <button
            onClick={fetchData}
            className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
            title="רענן"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-600 text-sm mb-1">
              <Clock className="w-4 h-4" />
              ממתינים לתזכורת
            </div>
            <div className="text-3xl font-bold text-blue-700">{pendingReminders}</div>
            <p className="text-xs text-blue-500 mt-1">משתמשים שהתחילו תביעה לפני 24+ שעות</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
              <CheckCircle className="w-4 h-4" />
              נשלחו היום
            </div>
            <div className="text-3xl font-bold text-green-700">
              {recentLogs.filter(
                (log) =>
                  new Date(log.created_at).toDateString() === new Date().toDateString()
              ).reduce((sum, log) => sum + log.sent_count, 0)}
            </div>
            <p className="text-xs text-green-500 mt-1">תזכורות שנשלחו היום</p>
          </div>
        </div>

        {/* Send Button */}
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleSendReminders}
            disabled={sending || pendingReminders === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                שולח...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                שלח תזכורות עכשיו
              </>
            )}
          </button>
          {message && (
            <p
              className={`text-sm ${
                message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message.text}
            </p>
          )}
        </div>

        {/* Cron Info */}
        <div className="mt-4 p-3 bg-neutral-50 rounded-lg text-sm text-neutral-600">
          <p className="font-medium">⏰ תזכורות אוטומטיות</p>
          <p className="mt-1">
            המערכת שולחת תזכורות אוטומטיות כל יום בשעה 07:00 (מוגדר ב-Vercel Cron).
            <br />
            התזכורות נשלחות רק למשתמשים שהתחילו תביעה לפני 24 שעות ולא סיימו.
          </p>
        </div>
      </div>

      {/* Recent Logs */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            היסטוריית שליחות
          </h3>
        </div>
        {recentLogs.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">אין היסטוריית שליחות עדיין</div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {recentLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-neutral-900">{getTypeLabel(log.type)}</div>
                  <div className="text-sm text-neutral-500">{formatDate(log.created_at)}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">{log.sent_count}</span>
                  </div>
                  {log.failed_count > 0 && (
                    <div className="flex items-center gap-1 text-red-500">
                      <XCircle className="w-4 h-4" />
                      <span className="font-medium">{log.failed_count}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SMS Provider Info */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4">
        <h3 className="font-semibold text-neutral-900 mb-3">⚙️ ספק SMS מוגדר</h3>
        <div className="text-sm text-neutral-600 space-y-2">
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <span className="text-green-600">✓</span>
            <span className="font-medium text-green-700">TextMe (sms4free.co.il)</span>
          </div>
          <p className="text-neutral-500 mt-2">
            SMS נשלחים דרך TextMe. כל הודעה כוללת קישור להסרה מרשימת התפוצה בהתאם לחוק הספאם.
          </p>
        </div>
      </div>
    </div>
  );
}
