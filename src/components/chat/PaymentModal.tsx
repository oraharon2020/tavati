"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, CheckCircle2, Shield, Loader2, Tag, X } from "lucide-react";
import { AppliedCoupon } from "./types";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayment: () => Promise<string | null>;
  onPaymentSuccess: () => void;
  isProcessing: boolean;
  agreedToTerms: boolean;
  setAgreedToTerms: (value: boolean) => void;
  couponCode: string;
  setCouponCode: (value: string) => void;
  couponLoading: boolean;
  couponError: string;
  appliedCoupon: AppliedCoupon | null;
  onValidateCoupon: () => void;
  onRemoveCoupon: () => void;
  calculateFinalPrice: () => number;
  basePrice: number;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onPayment,
  onPaymentSuccess,
  isProcessing,
  agreedToTerms,
  setAgreedToTerms,
  couponCode,
  setCouponCode,
  couponLoading,
  couponError,
  appliedCoupon,
  onValidateCoupon,
  onRemoveCoupon,
  calculateFinalPrice,
  basePrice,
}: PaymentModalProps) {
  const [paymentLoading, setPaymentLoading] = useState(false);

  const handlePaymentClick = async () => {
    setPaymentLoading(true);
    const result = await onPayment();
    setPaymentLoading(false);
    
    if (result) {
      // Handle free transaction (100% discount)
      if (result === "FREE_TRANSACTION") {
        onPaymentSuccess();
        return;
      }
      
      try {
        let processInfo;
        try {
          processInfo = typeof result === 'string' ? JSON.parse(result) : result;
        } catch {
          processInfo = { paymentUrl: result };
        }
        
        const { authCode, paymentUrl } = processInfo;
        
        // Try to use Meshulam SDK if available and authCode exists
        if (authCode && typeof window !== 'undefined' && window.growPayment && window.meshulam_sdk_ready) {
          // Listen for success event BEFORE opening wallet
          const handleSuccess = (e: Event) => {
            console.log('Payment success event received:', (e as CustomEvent).detail);
            window.removeEventListener('meshulam-success', handleSuccess);
            onPaymentSuccess();
            // Don't call onClose() - let onPaymentSuccess handle navigation
          };
          window.addEventListener('meshulam-success', handleSuccess);
          
          console.log('Opening Meshulam wallet with authCode:', authCode);
          // Open the payment wallet
          window.growPayment.renderPaymentOptions(authCode);
        } else if (paymentUrl) {
          // Fallback: open payment URL in new window
          // Note: In this case we can't know when payment succeeded
          // The webhook will update the DB but user needs to refresh
          window.open(paymentUrl, '_blank');
          onClose();
        }
      } catch (err) {
        console.error('Payment error:', err);
      }
    }
  };

  const handleClose = () => {
    if (typeof window !== 'undefined' && window.growPayment && typeof window.growPayment.close === 'function') {
      window.growPayment.close();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => !isProcessing && handleClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close X button */}
            {!isProcessing && !paymentLoading && (
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-4 left-4 p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="סגור"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900">השלמת התשלום</h2>
              <p className="text-neutral-500 mt-1">הורדת כתב התביעה המוכן</p>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl p-4 mb-4 text-center border border-blue-100">
              {appliedCoupon ? (
                <>
                  <div className="text-lg text-neutral-400 line-through">₪{basePrice}</div>
                  <div className="text-3xl font-bold text-emerald-600">₪{calculateFinalPrice()}</div>
                  <div className="text-sm text-emerald-600 flex items-center justify-center gap-1 mt-1">
                    <Tag className="w-3 h-3" />
                    {appliedCoupon.discount_type === "percentage" 
                      ? `${appliedCoupon.discount_value}% הנחה` 
                      : `₪${appliedCoupon.discount_value} הנחה`}
                    <span className="font-mono text-xs">({appliedCoupon.code})</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-3xl font-bold text-blue-600">₪{basePrice}</div>
                  <div className="text-sm text-neutral-500">תשלום חד פעמי</div>
                </>
              )}
            </div>

            {/* Coupon Input */}
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="קוד קופון"
                  disabled={!!appliedCoupon}
                  className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-900 bg-white disabled:bg-neutral-100 text-right"
                  dir="rtl"
                />
                {appliedCoupon ? (
                  <button
                    onClick={onRemoveCoupon}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
                  >
                    הסר
                  </button>
                ) : (
                  <button
                    onClick={onValidateCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg text-sm hover:bg-neutral-200 disabled:opacity-50"
                  >
                    {couponLoading ? "..." : "החל"}
                  </button>
                )}
              </div>
              {couponError && (
                <p className="text-xs text-red-500 mt-1">{couponError}</p>
              )}
            </div>

            {/* What you get */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>כתב תביעה מקצועי ומותאם אישית</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>קובץ PDF להורדה מיידית</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>הנחיות מפורטות להגשה</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>אפשרות להורדה חוזרת</span>
              </div>
            </div>

            {/* Terms Agreement */}
            <label className="flex items-start gap-3 mb-4 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-neutral-500 leading-relaxed">
                קראתי ואני מסכים/ה ל
                <a href="/terms" target="_blank" className="text-blue-600 hover:underline mx-1">תנאי השימוש</a>
                ול
                <a href="/privacy" target="_blank" className="text-blue-600 hover:underline mx-1">מדיניות הפרטיות</a>
                ול
                <a href="/refund" target="_blank" className="text-blue-600 hover:underline mx-1">מדיניות הביטול</a>.
                אני מבין/ה שהשירות אינו מהווה ייעוץ משפטי.
              </span>
            </label>

            {/* Payment Button */}
            <button
              onClick={handlePaymentClick}
              disabled={isProcessing || paymentLoading || !agreedToTerms}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {(isProcessing || paymentLoading) ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  מעבד תשלום...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  שלם ₪{calculateFinalPrice()} והורד
                </>
              )}
            </button>

            {/* Cancel */}
            {!isProcessing && !paymentLoading && (
              <button
                onClick={handleClose}
                className="w-full mt-3 py-2 text-neutral-500 hover:text-neutral-700 text-sm"
                type="button"
              >
                ביטול
              </button>
            )}

            {/* Security note */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-400">
              <Shield className="w-3 h-3" />
              <span>תשלום מאובטח באמצעות SSL</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
