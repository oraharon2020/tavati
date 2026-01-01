"use client";

import { useState, useEffect } from "react";
import { 
  FileText, Clock, CheckCircle, AlertCircle, Plus, Download, 
  ArrowLeft, Loader2, Scale, User, CreditCard, Calendar,
  Building2, Banknote, Eye, Trash2, RefreshCw, Briefcase
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PhoneAuth from "@/components/PhoneAuth";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ClaimData {
  plaintiff?: {
    fullName?: string;
    idNumber?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
  };
  defendant?: {
    name?: string;
    type?: string;
    idOrCompanyNumber?: string;
    address?: string;
    city?: string;
  };
  claim?: {
    type?: string;
    amount?: number;
    description?: string;
    date?: string;
  };
}

interface Claim {
  id: string;
  title: string;
  defendant: string;
  defendantType: string;
  plaintiff: string;
  amount: number;
  status: "draft" | "pending_payment" | "paid" | "completed";
  currentStep: number;
  createdAt: string;
  updatedAt: string;
  claimType: string;
  claimData: ClaimData;
  serviceType: "claims" | "parking";
}

export default function MyAreaPage() {
  const { isAuthenticated, phone, login } = useAuth();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

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
        const claimsList: Claim[] = data.sessions.map((session: {
          id: string;
          claim_data?: ClaimData;
          status?: string;
          current_step?: number;
          created_at?: string;
          updated_at?: string;
          service_type?: string;
        }) => {
          const serviceType = (session.service_type || 'claims') as "claims" | "parking";
          const isParking = serviceType === 'parking';
          
          return {
            id: session.id,
            title: isParking 
              ? "ערעור על דוח חניה"
              : (session.claim_data?.claim?.type ? getClaimTypeTitle(session.claim_data.claim.type) : "תביעה חדשה"),
            defendant: isParking 
              ? (session.claim_data as Record<string, string>)?.authority || "לא צוין"
              : session.claim_data?.defendant?.name || "לא צוין",
            defendantType: session.claim_data?.defendant?.type || "unknown",
            plaintiff: session.claim_data?.plaintiff?.fullName || "לא צוין",
            amount: session.claim_data?.claim?.amount || 0,
            status: session.status || "draft",
            currentStep: session.current_step || 1,
            createdAt: session.created_at || new Date().toISOString(),
            updatedAt: session.updated_at || new Date().toISOString(),
            claimType: session.claim_data?.claim?.type || "other",
            claimData: session.claim_data || {},
            serviceType,
          };
        });
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
      flight: "טיסה/חברת תעופה",
      other: "תביעה כללית",
    };
    return types[type] || "תביעה";
  };

  const getDefendantTypeLabel = (type: string): string => {
    const types: Record<string, string> = {
      individual: "אדם פרטי",
      business: "עוסק מורשה",
      company: "חברה בע״מ",
    };
    return types[type] || "לא צוין";
  };

  const getStatusInfo = (status: string, currentStep: number) => {
    switch (status) {
      case "paid":
      case "completed":
        return {
          label: "הושלם ושולם",
          color: "bg-emerald-100 text-emerald-700 border-emerald-200",
          icon: CheckCircle,
          iconColor: "text-emerald-600",
        };
      case "pending_payment":
        return {
          label: "ממתין לתשלום",
          color: "bg-amber-100 text-amber-700 border-amber-200",
          icon: CreditCard,
          iconColor: "text-amber-600",
        };
      default:
        return {
          label: `טיוטה - שלב ${currentStep}/8`,
          color: "bg-blue-100 text-blue-700 border-blue-200",
          icon: Clock,
          iconColor: "text-blue-600",
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("he-IL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("he-IL", {
      day: "numeric",
      month: "short",
    });
  };

  const handleDownload = async (claimId: string) => {
    setDownloadingId(claimId);
    // TODO: Implement actual download
    await new Promise(resolve => setTimeout(resolve, 1000));
    setDownloadingId(null);
    // Navigate to chat with download trigger
    window.location.href = `/chat?session=${claimId}&action=download`;
  };

  const handleDelete = async (claimId: string) => {
    if (!phone) return;
    setDeletingId(claimId);
    try {
      const res = await fetch(`/api/sessions?id=${claimId}&phone=${encodeURIComponent(phone)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setClaims(prev => prev.filter(c => c.id !== claimId));
      }
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(null);
    }
  };

  // Show phone auth if not authenticated
  if (!isAuthenticated) {
    return <PhoneAuth onAuthenticated={handleAuthenticated} />;
  }

  const completedClaims = claims.filter(c => c.status === "paid" || c.status === "completed");
  const pendingClaims = claims.filter(c => c.status === "pending_payment");
  const draftClaims = claims.filter(c => c.status === "draft");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">האזור האישי</h1>
            <p className="text-neutral-500 mt-1">ניהול וצפייה בתביעות שלך</p>
          </div>
          
          <Link
            href="/chat"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/25 font-semibold"
          >
            <Plus className="w-5 h-5" />
            תביעה חדשה
          </Link>
        </div>

        {/* Stats Cards */}
        {claims.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
            <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900">{completedClaims.length}</p>
                  <p className="text-xs text-neutral-500">הושלמו</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900">{pendingClaims.length}</p>
                  <p className="text-xs text-neutral-500">ממתינים לתשלום</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900">{draftClaims.length}</p>
                  <p className="text-xs text-neutral-500">טיוטות</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Claims List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
            <p className="text-neutral-500">טוען את התביעות שלך...</p>
          </div>
        ) : claims.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-2xl flex items-center justify-center">
              <Scale className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">אין תביעות עדיין</h3>
            <p className="text-neutral-500 mb-8 max-w-sm mx-auto">
              התחל את התביעה הראשונה שלך בקלות ובמהירות
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/25 font-semibold text-lg"
            >
              <Plus className="w-5 h-5" />
              התחל תביעה חדשה
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {claims.map((claim) => {
              const statusInfo = getStatusInfo(claim.status, claim.currentStep);
              const StatusIcon = statusInfo.icon;
              const isExpanded = expandedCard === claim.id;
              const isPaid = claim.status === "paid" || claim.status === "completed";
              
              return (
                <motion.div
                  key={claim.id}
                  layout
                  className={cn(
                    "bg-white rounded-2xl border transition-all overflow-hidden",
                    isPaid ? "border-emerald-200" : "border-neutral-200",
                    "hover:shadow-lg"
                  )}
                >
                  {/* Main Card Content */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Title & Status */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {/* Service Type Badge */}
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide",
                            claim.serviceType === 'parking' 
                              ? "bg-teal-100 text-teal-700" 
                              : "bg-blue-100 text-blue-700"
                          )}>
                            {claim.serviceType === 'parking' ? '🅿️ חניה' : '⚖️ תביעה'}
                          </span>
                          <h3 className="font-bold text-lg text-neutral-900">{claim.title}</h3>
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
                            statusInfo.color
                          )}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusInfo.label}
                          </span>
                        </div>
                        
                        {/* Details Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            {claim.defendantType === "company" ? (
                              <Building2 className="w-4 h-4 text-neutral-400" />
                            ) : claim.defendantType === "business" ? (
                              <Briefcase className="w-4 h-4 text-neutral-400" />
                            ) : (
                              <User className="w-4 h-4 text-neutral-400" />
                            )}
                            <div className="min-w-0">
                              <p className="text-neutral-500 text-xs">נתבע ({getDefendantTypeLabel(claim.defendantType)})</p>
                              <p className="font-medium text-neutral-900 truncate">{claim.defendant}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Banknote className="w-4 h-4 text-neutral-400" />
                            <div>
                              <p className="text-neutral-500 text-xs">סכום</p>
                              <p className="font-bold text-neutral-900">{claim.amount > 0 ? `₪${claim.amount.toLocaleString()}` : "לא צוין"}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-neutral-400" />
                            <div className="min-w-0">
                              <p className="text-neutral-500 text-xs">שלב</p>
                              <p className="font-medium text-neutral-900 truncate">{claim.currentStep}/8</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-neutral-400" />
                            <div>
                              <p className="text-neutral-500 text-xs">עודכן</p>
                              <p className="font-medium text-neutral-900">{formatShortDate(claim.updatedAt)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                        {isPaid ? (
                          <button
                            onClick={() => handleDownload(claim.id)}
                            disabled={downloadingId === claim.id}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md shadow-emerald-500/20 text-sm font-semibold disabled:opacity-50"
                          >
                            {downloadingId === claim.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                            הורד מסמך
                          </button>
                        ) : claim.status === "pending_payment" ? (
                          <Link
                            href={`/chat?session=${claim.id}&service=${claim.serviceType}`}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-md shadow-amber-500/20 text-sm font-semibold"
                          >
                            <CreditCard className="w-4 h-4" />
                            שלם והורד
                          </Link>
                        ) : (
                          <Link
                            href={`/chat?session=${claim.id}&service=${claim.serviceType}`}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md shadow-blue-500/20 text-sm font-semibold"
                          >
                            המשך
                            <ArrowLeft className="w-4 h-4" />
                          </Link>
                        )}
                        
                        <button
                          onClick={() => setExpandedCard(isExpanded ? null : claim.id)}
                          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                          title="פרטים נוספים"
                        >
                          <Eye className="w-5 h-5 text-neutral-400" />
                        </button>
                        
                        {/* Delete Button */}
                        {showDeleteConfirm === claim.id ? (
                          <div className="flex items-center gap-1 bg-red-50 rounded-lg p-1">
                            <button
                              onClick={() => handleDelete(claim.id)}
                              disabled={deletingId === claim.id}
                              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              {deletingId === claim.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "מחק"}
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100 rounded transition-colors"
                            >
                              ביטול
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowDeleteConfirm(claim.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                            title="מחק תביעה"
                          >
                            <Trash2 className="w-5 h-5 text-neutral-300 group-hover:text-red-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-2 border-t border-neutral-100">
                          <div className="grid sm:grid-cols-2 gap-6">
                            {/* Plaintiff Info */}
                            {claim.claimData.plaintiff && (
                              <div className="bg-neutral-50 rounded-xl p-4">
                                <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                                  <User className="w-4 h-4 text-blue-600" />
                                  פרטי התובע
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-neutral-500">שם:</span>
                                    <span className="font-medium">{claim.claimData.plaintiff.fullName || "לא צוין"}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-neutral-500">ת.ז.:</span>
                                    <span className="font-medium">{claim.claimData.plaintiff.idNumber || "לא צוין"}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-neutral-500">טלפון:</span>
                                    <span className="font-medium">{claim.claimData.plaintiff.phone || "לא צוין"}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-neutral-500">עיר:</span>
                                    <span className="font-medium">{claim.claimData.plaintiff.city || "לא צוין"}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Defendant Info */}
                            {claim.claimData.defendant && (
                              <div className="bg-neutral-50 rounded-xl p-4">
                                <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                                  <Building2 className="w-4 h-4 text-blue-600" />
                                  פרטי הנתבע
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-neutral-500">שם:</span>
                                    <span className="font-medium">{claim.claimData.defendant.name || "לא צוין"}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-neutral-500">סוג:</span>
                                    <span className="font-medium">{getDefendantTypeLabel(claim.claimData.defendant.type || "")}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-neutral-500">מספר זיהוי:</span>
                                    <span className="font-medium">{claim.claimData.defendant.idOrCompanyNumber || "לא צוין"}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-neutral-500">עיר:</span>
                                    <span className="font-medium">{claim.claimData.defendant.city || "לא צוין"}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Claim Description */}
                          {claim.claimData.claim?.description && (
                            <div className="mt-4 bg-neutral-50 rounded-xl p-4">
                              <h4 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-600" />
                                תיאור התביעה
                              </h4>
                              <p className="text-sm text-neutral-600 whitespace-pre-wrap">
                                {claim.claimData.claim.description}
                              </p>
                            </div>
                          )}
                          
                          {/* Dates */}
                          <div className="mt-4 flex flex-wrap gap-4 text-xs text-neutral-500">
                            <span>נוצר: {formatDate(claim.createdAt)}</span>
                            <span>עודכן: {formatDate(claim.updatedAt)}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Refresh Button */}
        {claims.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => phone && loadClaims(phone)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors text-sm"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              רענן רשימה
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
