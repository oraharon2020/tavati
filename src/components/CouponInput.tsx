"use client";

import { useState } from "react";
import { Ticket, Check, X, Loader2 } from "lucide-react";

interface CouponData {
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountAmount: number;
  originalPrice: number;
  finalPrice: number;
}

interface CouponInputProps {
  onApply: (coupon: CouponData | null) => void;
  appliedCoupon: CouponData | null;
}

export default function CouponInput({ onApply, appliedCoupon }: CouponInputProps) {
  const [code, setCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");
  const [showInput, setShowInput] = useState(false);

  const validateCoupon = async () => {
    if (!code.trim()) {
      setError("הכנס קוד קופון");
      return;
    }

    setIsValidating(true);
    setError("");

    try {
      const res = await fetch("/api/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();

      if (data.valid) {
        onApply(data.coupon);
        setShowInput(false);
      } else {
        setError(data.error || "קוד לא תקף");
      }
    } catch {
      setError("שגיאה בבדיקת הקופון");
    } finally {
      setIsValidating(false);
    }
  };

  const removeCoupon = () => {
    onApply(null);
    setCode("");
    setError("");
  };

  // Show applied coupon
  if (appliedCoupon) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-800">
                קופון {appliedCoupon.code} הופעל!
              </p>
              <p className="text-sm text-green-600">
                {appliedCoupon.discountType === "percentage" 
                  ? `הנחה של ${appliedCoupon.discountValue}%`
                  : `הנחה של ₪${appliedCoupon.discountValue}`
                }
                {" - "}
                חסכת ₪{appliedCoupon.discountAmount}
              </p>
            </div>
          </div>
          <button
            onClick={removeCoupon}
            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
            aria-label="הסר קופון"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Show input toggle
  if (!showInput) {
    return (
      <button
        onClick={() => setShowInput(true)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
      >
        <Ticket className="w-4 h-4" />
        יש לך קוד קופון?
      </button>
    );
  }

  // Show input field
  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError("");
            }}
            placeholder="הכנס קוד קופון"
            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-mono uppercase"
            disabled={isValidating}
            onKeyDown={(e) => e.key === "Enter" && validateCoupon()}
          />
          {error && (
            <p className="text-red-500 text-sm mt-1 text-center">{error}</p>
          )}
        </div>
        <button
          onClick={validateCoupon}
          disabled={isValidating || !code.trim()}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isValidating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "החל"
          )}
        </button>
        <button
          onClick={() => {
            setShowInput(false);
            setCode("");
            setError("");
          }}
          className="p-2.5 text-neutral-500 hover:bg-neutral-200 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
