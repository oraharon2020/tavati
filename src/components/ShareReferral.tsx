"use client";

import { useState, useEffect } from "react";
import { Share2, Copy, Check, Gift, Users, Loader2 } from "lucide-react";

interface ShareReferralProps {
  phone: string | null;
}

export default function ShareReferral({ phone }: ShareReferralProps) {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (phone && showModal && !referralCode) {
      fetchReferralCode();
    }
  }, [phone, showModal]);

  const fetchReferralCode = async () => {
    if (!phone) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/referral?phone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      
      if (data.referralCode) {
        setReferralCode(data.referralCode);
        setReferralCount(data.referralCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch referral code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const shareUrl = referralCode 
    ? `https://tavati.co.il/?ref=${referralCode}` 
    : "https://tavati.co.il";

  const shareText = `השתמשתי בתבעתי להגשת תביעה קטנה - ממליץ בחום! 🎯\nעם הקישור שלי תקבלו 10% הנחה:\n${shareUrl}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareViaWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "תבעתי - תביעות קטנות בקלות",
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback to copy
      copyToClipboard();
    }
  };

  if (!phone) return null;

  return (
    <>
      {/* Share Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all text-sm font-medium shadow-lg shadow-purple-500/25"
      >
        <Gift className="w-4 h-4" />
        הזמן חבר וקבל הנחה
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                הזמן חברים וקבל הנחות!
              </h2>
              <p className="text-neutral-600">
                שתף את הקישור שלך - החברים שלך יקבלו 10% הנחה, 
                ואתה תקבל ₪10 זיכוי על כל חבר שמשלם!
              </p>
            </div>

            {/* Stats */}
            {referralCount > 0 && (
              <div className="bg-purple-50 rounded-xl p-4 mb-4 text-center">
                <div className="flex items-center justify-center gap-2 text-purple-600">
                  <Users className="w-5 h-5" />
                  <span className="font-bold">{referralCount} חברים הצטרפו דרכך!</span>
                </div>
              </div>
            )}

            {/* Referral Code */}
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              </div>
            ) : referralCode ? (
              <div className="space-y-4">
                {/* Code Display */}
                <div className="bg-neutral-100 rounded-xl p-4">
                  <p className="text-sm text-neutral-500 mb-1 text-center">הקוד שלך:</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl font-bold font-mono text-neutral-900">
                      {referralCode}
                    </span>
                    <button
                      onClick={copyToClipboard}
                      className="p-2 hover:bg-neutral-200 rounded-lg transition-colors"
                      aria-label="העתק קוד"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 text-neutral-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={shareViaWhatsApp}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white rounded-xl hover:bg-[#20BD5A] transition-colors font-medium"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </button>
                  
                  <button
                    onClick={shareNative}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Share2 className="w-5 h-5" />
                    שתף
                  </button>
                </div>

                {/* Link Display */}
                <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200">
                  <p className="text-xs text-neutral-500 text-center truncate">
                    {shareUrl}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-center text-neutral-500 py-4">
                לא הצלחנו ליצור קוד הפניה
              </p>
            )}

            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-4 py-3 border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-50 transition-colors font-medium"
            >
              סגור
            </button>
          </div>
        </div>
      )}
    </>
  );
}
