"use client";

import { useState, useEffect } from "react";
import { Settings, Save, RefreshCw } from "lucide-react";

interface PriceSettings {
  claims_price: number;
  parking_price: number;
}

export default function SettingsManager() {
  const [settings, setSettings] = useState<PriceSettings>({
    claims_price: 79,
    parking_price: 39,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "ההגדרות נשמרו בהצלחה!" });
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "שגיאה בשמירה" });
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage({ type: "error", text: "שגיאה בשמירה" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-neutral-900">הגדרות מחירים</h2>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Price Settings */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-6">
        <h3 className="font-semibold text-neutral-800 mb-4">מחירי שירותים</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Claims Price */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700">
              תביעות קטנות (₪)
            </label>
            <div className="relative">
              <input
                type="number"
                value={settings.claims_price}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    claims_price: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-neutral-900"
                min="0"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">₪</span>
            </div>
            <p className="text-xs text-neutral-500">מחיר להפקת כתב תביעה</p>
          </div>

          {/* Parking Price */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700">
              ערעור חניה (₪)
            </label>
            <div className="relative">
              <input
                type="number"
                value={settings.parking_price}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    parking_price: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-neutral-900"
                min="0"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">₪</span>
            </div>
            <p className="text-xs text-neutral-500">מחיר להפקת מכתב ערעור</p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-neutral-100">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "שומר..." : "שמור שינויים"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <strong>שים לב:</strong> שינוי המחירים ישפיע על כל התשלומים החדשים. תשלומים שכבר בוצעו לא יושפעו.
      </div>
    </div>
  );
}
