"use client";

import { useState, useCallback, useEffect } from "react";
import { ClaimData, generateClaimPDF } from "@/lib/pdfGenerator";
import { BASE_PRICE } from "../constants";
import { AppliedCoupon } from "../types";

interface UsePaymentProps {
  claimData: ClaimData | null;
  currentSessionId: string | null;
  setHasPaid: React.Dispatch<React.SetStateAction<boolean>>;
  setShowNextSteps: React.Dispatch<React.SetStateAction<boolean>>;
  setPdfDownloaded: React.Dispatch<React.SetStateAction<boolean>>;
  hasPaid: boolean;
}

interface UsePaymentReturn {
  showPaymentModal: boolean;
  setShowPaymentModal: React.Dispatch<React.SetStateAction<boolean>>;
  showPreview: boolean;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
  isProcessingPayment: boolean;
  agreedToTerms: boolean;
  setAgreedToTerms: React.Dispatch<React.SetStateAction<boolean>>;
  couponCode: string;
  setCouponCode: React.Dispatch<React.SetStateAction<string>>;
  couponLoading: boolean;
  couponError: string;
  appliedCoupon: AppliedCoupon | null;
  setAppliedCoupon: React.Dispatch<React.SetStateAction<AppliedCoupon | null>>;
  validateCoupon: () => Promise<void>;
  removeCoupon: () => void;
  calculateFinalPrice: () => number;
  handlePaymentAndDownload: () => void;
  processPayment: () => Promise<string | null>;
  handleGeneratePDF: () => Promise<void>;
  handlePaymentSuccess: () => void;
}

export function usePayment({
  claimData,
  currentSessionId,
  setHasPaid,
  setShowNextSteps,
  setPdfDownloaded,
  hasPaid,
}: UsePaymentProps): UsePaymentReturn {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  // Handle payment success - called when payment is completed
  const handlePaymentSuccess = useCallback(() => {
    console.log('handlePaymentSuccess called - setting hasPaid=true, showNextSteps=true');
    setHasPaid(true);
    setShowPaymentModal(false);
    setShowNextSteps(true);
    
    // If we have claim data, generate PDF
    if (claimData) {
      console.log('Generating PDF...');
      generateClaimPDF(claimData).then(() => {
        console.log('PDF generated successfully');
        setPdfDownloaded(true);
      }).catch(console.error);
    }
  }, [claimData, setHasPaid, setShowNextSteps, setPdfDownloaded, setShowPaymentModal]);

  // Check for payment success when returning from payment page (URL params)
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get("payment");
    
    if (paymentStatus === "success") {
      // Clean up URL (remove query params)
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, "", cleanUrl);
      
      // Handle success
      handlePaymentSuccess();
    } else if (paymentStatus === "cancelled") {
      // Payment was cancelled - just clean up URL
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, "", cleanUrl);
    }
  }, [handlePaymentSuccess]);

  // Listen for messages from iframe (for payment success/failure)
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const handleMessage = (event: MessageEvent) => {
      // Check if message is from Meshulam
      if (event.data?.type === "payment_success" || event.data?.status === "success") {
        handlePaymentSuccess();
      }
    };
    
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handlePaymentSuccess]);


  // בדיקת קופון
  const validateCoupon = useCallback(async () => {
    if (!couponCode.trim()) return;
    
    setCouponLoading(true);
    setCouponError("");
    
    try {
      const res = await fetch("/api/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim().toUpperCase() }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.valid) {
        setAppliedCoupon({
          code: data.coupon.code,
          discount_type: data.coupon.discount_type,
          discount_value: data.coupon.discount_value,
        });
        setCouponError("");
      } else {
        setCouponError(data.error || "קופון לא תקף");
        setAppliedCoupon(null);
      }
    } catch {
      setCouponError("שגיאה בבדיקת הקופון");
    } finally {
      setCouponLoading(false);
    }
  }, [couponCode]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  }, []);

  // חישוב מחיר סופי
  const calculateFinalPrice = useCallback(() => {
    if (!appliedCoupon) return BASE_PRICE;
    
    if (appliedCoupon.discount_type === "percentage") {
      return Math.round(BASE_PRICE * (1 - appliedCoupon.discount_value / 100));
    } else {
      return Math.max(0, BASE_PRICE - appliedCoupon.discount_value);
    }
  }, [appliedCoupon]);

  // תשלום והורדה
  const handlePaymentAndDownload = useCallback(() => {
    if (!claimData) return;
    setShowPaymentModal(true);
  }, [claimData]);

  // תשלום דרך Grow/משולם - מחזיר URL לתשלום (להצגה ב-iframe)
  const processPayment = useCallback(async (): Promise<string | null> => {
    if (!claimData || !currentSessionId) {
      alert("שגיאה: חסרים נתונים. אנא נסה שוב.");
      return null;
    }
    
    setIsProcessingPayment(true);
    
    try {
      // יצירת דף תשלום ב-Grow/משולם
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: currentSessionId,
          amount: calculateFinalPrice(),
          description: "כתב תביעה - תבעתי",
          customerName: claimData.plaintiff.fullName,
          customerPhone: claimData.plaintiff.phone,
          customerEmail: claimData.plaintiff.email || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.details || "שגיאה ביצירת דף תשלום");
      }

      // החזר אובייקט עם כל הנתונים לתשלום
      if (data.authCode || data.paymentUrl) {
        setIsProcessingPayment(false);
        return JSON.stringify({
          authCode: data.authCode,
          paymentUrl: data.paymentUrl,
          processId: data.processId,
          processToken: data.processToken,
        });
      } else {
        throw new Error("לא התקבל קישור לדף תשלום");
      }
      
    } catch (error) {
      console.error("Payment failed:", error);
      alert(error instanceof Error ? error.message : "שגיאה בתשלום. אנא נסה שוב.");
      setIsProcessingPayment(false);
      return null;
    }
  }, [claimData, currentSessionId, calculateFinalPrice]);

  const handleGeneratePDF = useCallback(async () => {
    if (!claimData) return;
    
    // אם כבר שילם, אפשר להוריד שוב
    if (hasPaid) {
      try {
        await generateClaimPDF(claimData);
        setPdfDownloaded(true);
      } catch (error) {
        console.error("Failed to generate PDF:", error);
        alert("שגיאה ביצירת ה-PDF. אנא נסה שוב.");
      }
    } else {
      // אם לא שילם, פתח מסך תשלום
      handlePaymentAndDownload();
    }
  }, [claimData, hasPaid, handlePaymentAndDownload, setPdfDownloaded]);

  return {
    showPaymentModal,
    setShowPaymentModal,
    showPreview,
    setShowPreview,
    isProcessingPayment,
    agreedToTerms,
    setAgreedToTerms,
    couponCode,
    setCouponCode,
    couponLoading,
    couponError,
    appliedCoupon,
    setAppliedCoupon,
    validateCoupon,
    removeCoupon,
    calculateFinalPrice,
    handlePaymentAndDownload,
    processPayment,
    handleGeneratePDF,
    handlePaymentSuccess,
  };
}
