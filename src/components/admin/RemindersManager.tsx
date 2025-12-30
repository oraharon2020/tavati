"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, Clock, CheckCircle, XCircle, RefreshCw, Bell, RotateCcw } from "lucide-react";

interface ReminderLog {
  id: string;
  type: string;
  sent_count: number;
  failed_count: number;
  details: {
    sent?: number;
    failed?: number;
    errors?: string[];
    isSecondReminder?: boolean;
  };
  created_at: string;
}

interface RemindersManagerProps {
  onRefresh?: () => void;
}

export default function RemindersManager({ onRefresh }: RemindersManagerProps) {
  const [pendingReminders, setPendingReminders] = useState(0);
  const [pendingSecondReminders, setPendingSecondReminders] = useState(0);
  const [recentLogs, setRecentLogs] = useState<ReminderLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendingSecond, setSendingSecond] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reminders");
      if (res.ok) {
        const data = await res.json();
        setPendingReminders(data.pendingReminders || 0);
        setPendingSecondReminders(data.pendingSecondReminders || 0);
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

  const handleSendReminders = async (isSecondReminder = false) => {
    const count = isSecondReminder ? pendingSecondReminders : pendingReminders;
    const reminderType = isSecondReminder ? "תזכורות שניות" : "תזכורות ראשונות";
    
    if (!confirm(`לשלוח ${reminderType} ל-${count} משתמשים?`)) return;
    
    if (isSecondReminder) {
      setSendingSecond(true);
    } else {
      setSending(true);
    }
    setMessage(null);
    
    try {
      const res = await fetch("/api/admin/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sendSecondReminder: isSecondReminder }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage({
          type: "success",
          text: `נשלחו ${data.sent} ${reminderType} בהצלחה${data.failed > 0 ? `, ${data.failed} נכשלו` : ""}`,
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
      setSendingSecond(false);
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
        return "תזכורת ראשונה";
      case "second_reminder":
        return "תזכורת שנייה";
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

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-600 text-sm mb-1">
              <Clock className="w-4 h-4" />
              תזכורת ראשונה
            </div>
            <div className="text-3xl font-bold text-blue-700">{pendingReminders}</div>
            <p className="text-xs text-blue-500 mt-1">24+ שעות, לא קיבלו תזכורת</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-amber-600 text-sm mb-1">
              <RotateCcw className="w-4 h-4" />
              תזכורת שנייה
            </div>
            <div className="text-3xl font-bold text-amber-700">{pendingSecondReminders}</div>
            <p className="text-xs text-amber-500 mt-1">72+ שעות, קיבלו תזכורת אחת</p>
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
            <p className="text-xs text-green-500 mt-1">סה"כ תזכורות היום</p>
          </div>
        </div>

        {/* Send Buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleSendReminders(false)}
            disabled={sending || sendingSecond || pendingReminders === 0}
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
                שלח תזכורות ראשונות ({pendingReminders})
              </>
            )}
          </button>
          <button
            onClick={() => handleSendReminders(true)}
            disabled={sending || sendingSecond || pendingSecondReminders === 0}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sendingSecond ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                שולח...
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4" />
                שלח תזכורות שניות ({pendingSecondReminders})
              </>
            )}
          </button>
        </div>
        
        {message && (
          <p
            className={`mt-3 text-sm ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </p>
        )}

        {/* Cron Info */}
        <div className="mt-4 p-3 bg-neutral-50 rounded-lg text-sm text-neutral-600">
          <p className="font-medium">⏰ תזכורות אוטומטיות</p>
          <p className="mt-1">
            המערכת שולחת תזכורות ראשונות אוטומטית כל יום בשעה 10:00 (שעון ישראל).
            <br />
            תזכורות שניות נשלחות ידנית מכאן - לפי בחירתך.
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
