"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, X, Check, Tag } from "lucide-react";

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

interface CouponsManagerProps {
  coupons: Coupon[];
  onSave: (coupon: Partial<Coupon>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onToggleActive: (id: string, active: boolean) => Promise<void>;
}

export default function CouponsManager({
  coupons,
  onSave,
  onDelete,
  onToggleActive,
}: CouponsManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: "",
    description: "",
    discount_type: "percentage",
    discount_value: 10,
    max_uses: null,
    expires_at: null,
    active: true,
  });

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discount_type: "percentage",
      discount_value: 10,
      max_uses: null,
      expires_at: null,
      active: true,
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleEdit = (coupon: Coupon) => {
    setFormData({
      id: coupon.id,
      code: coupon.code,
      description: coupon.description,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      max_uses: coupon.max_uses,
      expires_at: coupon.expires_at ? coupon.expires_at.split("T")[0] : null,
      active: coupon.active,
    });
    setEditingId(coupon.id);
    setIsCreating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
    resetForm();
  };

  const formatDiscount = (coupon: Coupon) => {
    return coupon.discount_type === "percentage"
      ? `${coupon.discount_value}%`
      : `₪${coupon.discount_value}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("he-IL");
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
        <h2 className="font-semibold text-neutral-900 flex items-center gap-2">
          <Tag className="w-5 h-5" />
          ניהול קופונים
        </h2>
        {!isCreating && !editingId && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            קופון חדש
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <form onSubmit={handleSubmit} className="p-4 bg-blue-50 border-b border-blue-100">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                קוד קופון
              </label>
              <input
                type="text"
                value={formData.code || ""}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
                placeholder="SAVE20"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-900 bg-white"
                required
                disabled={!!editingId}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                תיאור
              </label>
              <input
                type="text"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="הנחה מיוחדת"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                סוג הנחה
              </label>
              <select
                value={formData.discount_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discount_type: e.target.value as "percentage" | "fixed",
                  })
                }
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-900 bg-white"
              >
                <option value="percentage">אחוזים (%)</option>
                <option value="fixed">סכום קבוע (₪)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                ערך ההנחה
              </label>
              <input
                type="number"
                value={formData.discount_value || ""}
                onChange={(e) =>
                  setFormData({ ...formData, discount_value: Number(e.target.value) })
                }
                min="1"
                max={formData.discount_type === "percentage" ? 100 : 1000}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-900 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                מקסימום שימושים
              </label>
              <input
                type="number"
                value={formData.max_uses || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    max_uses: e.target.value ? Number(e.target.value) : null,
                  })
                }
                placeholder="ללא הגבלה"
                min="1"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                תוקף עד
              </label>
              <input
                type="date"
                value={formData.expires_at || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expires_at: e.target.value || null,
                  })
                }
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-900 bg-white"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingId ? "עדכן" : "צור קופון"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-neutral-200 text-neutral-700 text-sm rounded-lg hover:bg-neutral-300 transition-colors"
            >
              ביטול
            </button>
          </div>
        </form>
      )}

      {/* Coupons List */}
      <div className="divide-y divide-neutral-100">
        {coupons.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">אין קופונים עדיין</div>
        ) : (
          coupons.map((coupon) => (
            <div
              key={coupon.id}
              className={`p-4 flex items-center justify-between ${
                !coupon.active ? "bg-neutral-50 opacity-60" : ""
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {coupon.code}
                  </span>
                  <span className="text-lg font-semibold text-green-600">
                    {formatDiscount(coupon)}
                  </span>
                  {!coupon.active && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                      לא פעיל
                    </span>
                  )}
                </div>
                {coupon.description && (
                  <p className="text-sm text-neutral-600 mt-1">{coupon.description}</p>
                )}
                <div className="flex gap-4 mt-1 text-xs text-neutral-500">
                  <span>
                    שימושים: {coupon.used_count}
                    {coupon.max_uses && `/${coupon.max_uses}`}
                  </span>
                  {coupon.expires_at && (
                    <span>תוקף עד: {formatDate(coupon.expires_at)}</span>
                  )}
                  <span>נוצר: {formatDate(coupon.created_at)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleActive(coupon.id, !coupon.active)}
                  className={`p-2 rounded-lg transition-colors ${
                    coupon.active
                      ? "text-green-600 hover:bg-green-50"
                      : "text-neutral-400 hover:bg-neutral-100"
                  }`}
                  title={coupon.active ? "השבת" : "הפעל"}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(coupon)}
                  className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
                  title="ערוך"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm("למחוק את הקופון?")) {
                      onDelete(coupon.id);
                    }
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="מחק"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
