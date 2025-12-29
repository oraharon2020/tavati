"use client";

import { useState, useEffect } from "react";
import { FileText, Clock, CheckCircle, AlertCircle, Plus, Download, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PhoneAuth from "@/components/PhoneAuth";
import { useAuth } from "@/contexts/AuthContext";

interface Claim {
  id: string;
  title: string;
  defendant: string;
  amount: number;
  status: "draft" | "pending_payment" | "completed";
  createdAt: string;
  updatedAt: string;
}

export default function MyAreaPage() {
  const { isAuthenticated, phone, login } = useAuth();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAuthenticated = (phoneNumber: string) => {
    login(phoneNumber);
  };

  // Load claims when authenticated
  useEffect(() => {
    if (isAuthenticated && phone) {
      loadClaims(phone);
    }
  }, [isAuthenticated, phone]);

  const loadClaims = async (phoneNumber: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sessions?phone=${encodeURIComponent(phoneNumber)}`);
      const data = await res.json();
      if (data.sessions) {
        // Transform sessions to claims format
        const claimsList: Claim[] = data.sessions.map((session: { id: string; claim_data?: { defendant?: { name?: string }; claim?: { amount?: number; type?: string } }; status?: string; created_at?: string; updated_at?: string }) => ({
          id: session.id,
          title: session.claim_data?.claim?.type ? getClaimTypeTitle(session.claim_data.claim.type) : "תביעה חדשה",
          defendant: session.claim_data?.defendant?.name || "לא צוין",
          amount: session.claim_data?.claim?.amount || 0,
          status: session.status || "draft",
          createdAt: session.created_at,
          updatedAt: session.updated_at,
        }));
        setClaims(claimsList);
      }
    } catch (error) {
      console.error("Error loading claims:", error);
    } finally {
      setLoading(false);
    }
  };

  const getClaimTypeTitle = (type: string): string => {
    const types: Record<string, string> = {
      consumer: "תביעה צרכנית",
      contract: "הפרת חוזה",
      rental: "שכירות",
      damage: "נזקים",
      service: "שירות לקוי",
      spam: "ספאם/הטרדות",
      other: "תביעה כללית",
    };
    return types[type] || "תביעה";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            הושלם
          </span>
        );
      case "pending_payment":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
            <AlertCircle className="w-4 h-4" />
            ממתין לתשלום
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4" />
            טיוטה
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("he-IL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Show phone auth if not authenticated
  if (!isAuthenticated) {
    return <PhoneAuth onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">האזור שלי</h1>
            <p className="text-neutral-500 mt-1">צפייה וניהול התביעות שלך</p>
          </div>
          
          <Link
            href="/chat"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            תביעה חדשה
          </Link>
        </div>

        {/* Claims List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : claims.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">אין תביעות עדיין</h3>
            <p className="text-neutral-500 mb-6">התחילו תביעה חדשה ותראו אותה כאן</p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
            >
              <Plus className="w-5 h-5" />
              התחילו תביעה
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {claims.map((claim) => (
              <div
                key={claim.id}
                className="bg-white rounded-2xl border border-neutral-200 p-6 hover:border-blue-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-neutral-900">{claim.title}</h3>
                      {getStatusBadge(claim.status)}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                      <span>נגד: {claim.defendant}</span>
                      {claim.amount > 0 && (
                        <>
                          <span>•</span>
                          <span>₪{claim.amount.toLocaleString()}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{formatDate(claim.updatedAt || claim.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {claim.status === "completed" && (
                      <button className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium">
                        <Download className="w-4 h-4" />
                        הורדה
                      </button>
                    )}
                    
                    {claim.status !== "completed" && (
                      <Link
                        href={`/chat?session=${claim.id}`}
                        className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium"
                      >
                        המשך
                        <ArrowLeft className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
