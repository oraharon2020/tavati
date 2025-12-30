"use client";

import { useState, useEffect, useRef } from "react";
import { Scale, RotateCcw, FileText, Home, ChevronDown, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  PaymentModal,
  PreviewModal,
  ChatMessages,
  ChatInput,
  ChatWelcome,
  NextStepsScreen,
  AttachmentsScreen,
  STEPS,
  useSession,
  useChat,
  usePayment,
  useFileUpload,
} from "./chat";

interface ChatInterfaceProps {
  sessionId?: string | null;
  phone?: string | null;
}

export default function ChatInterface({ sessionId, phone }: ChatInterfaceProps = {}) {
  const [showMobileSteps, setShowMobileSteps] = useState(false);
  const [showAttachmentsScreen, setShowAttachmentsScreen] = useState(false);

  // Session hook - manages all session state
  const session = useSession({ sessionId, phone });

  // Chat hook - manages messages and input
  const chat = useChat({
    messages: session.messages,
    setMessages: session.setMessages,
    setShowWelcome: session.setShowWelcome,
    saveToSession: session.saveToSession,
    uploadedFiles: session.uploadedFiles,
    setUploadedFiles: session.setUploadedFiles,
    claimData: session.claimData,
  });

  // Payment hook - manages payment flow
  const payment = usePayment({
    claimData: session.claimData,
    currentSessionId: session.currentSessionId,
    setHasPaid: session.setHasPaid,
    setShowNextSteps: session.setShowNextSteps,
    setPdfDownloaded: session.setPdfDownloaded,
    hasPaid: session.hasPaid,
  });

  // File upload hook
  const fileUpload = useFileUpload({
    currentSessionId: session.currentSessionId,
    setUploadedFiles: session.setUploadedFiles,
    setAttachments: session.setAttachments,
    setInput: chat.setInput,
  });

  // Extract claim data from messages
  useEffect(() => {
    const lastAssistantMessage = [...session.messages].reverse().find(m => m.role === "assistant");
    if (lastAssistantMessage) {
      const data = chat.extractClaimData(lastAssistantMessage.content);
      if (data) {
        session.setClaimData(data);
      }
    }
  }, [session.messages, chat.extractClaimData, session.setClaimData]);

  // Show "Next Steps" screen after payment (hasPaid OR showNextSteps)
  if ((session.hasPaid || session.showNextSteps) && session.claimData) {
    if (showAttachmentsScreen) {
      return (
        <AttachmentsScreen
          attachments={session.attachments}
          setAttachments={session.setAttachments}
          isUploading={fileUpload.isUploading}
          attachmentInputRef={fileUpload.attachmentInputRef}
          onUpload={fileUpload.handleAttachmentUpload}
          onBack={() => setShowAttachmentsScreen(false)}
          onDownloadWithAttachments={() => {
            setShowAttachmentsScreen(false);
            payment.handleGeneratePDF();
          }}
        />
      );
    }

    return (
      <NextStepsScreen
        claimData={session.claimData}
        attachments={session.attachments}
        onGeneratePDF={payment.handleGeneratePDF}
        onShowAttachments={() => setShowAttachmentsScreen(true)}
        onReset={session.resetChat}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        {/* Mobile: Clean single row */}
        <div className="sm:hidden px-3 py-2.5">
          <div className="grid grid-cols-3 items-center">
            {/* Left: Logo + Name */}
            <Link href="/" className="flex items-center gap-2 justify-self-start">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">תבעתי</span>
            </Link>

            {/* Center: Progress indicator or Paid badge */}
            {session.hasPaid ? (
              <div className="flex items-center justify-center gap-1.5 text-sm bg-green-100 rounded-full px-3 py-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-700">שולם</span>
              </div>
            ) : (
              <button
                onClick={() => setShowMobileSteps(!showMobileSteps)}
                className="flex items-center justify-center gap-1.5 text-sm bg-neutral-50 hover:bg-neutral-100 rounded-full px-3 py-1.5 transition-colors"
              >
                <span className="font-semibold text-neutral-800">{STEPS[chat.currentStep - 1]?.name}</span>
                <span className="text-neutral-500 font-medium">{chat.currentStep}/{STEPS.length}</span>
                <ChevronDown className={cn("w-3.5 h-3.5 text-neutral-400 transition-transform", showMobileSteps && "rotate-180")} />
              </button>
            )}

            {/* Right: Reset */}
            <button
              onClick={session.resetChat}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors justify-self-end"
              title="התחל מחדש"
              aria-label="התחל שיחה חדשה"
            >
              <RotateCcw className="w-4 h-4 text-neutral-400" aria-hidden="true" />
            </button>
          </div>

          {/* Mobile Steps Dropdown */}
          <AnimatePresence>
            {showMobileSteps && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-3 bg-neutral-50 rounded-xl p-3 space-y-2">
                  {STEPS.map((step) => (
                    <div
                      key={step.id}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-lg transition-colors",
                        chat.currentStep === step.id && "bg-white shadow-sm",
                        chat.currentStep > step.id && "opacity-60"
                      )}
                    >
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0",
                        chat.currentStep > step.id
                          ? "bg-emerald-500 text-white"
                          : chat.currentStep === step.id
                          ? "bg-blue-500 text-white"
                          : "bg-neutral-200 text-neutral-500"
                      )}>
                        {chat.currentStep > step.id ? "✓" : step.icon}
                      </div>
                      <span className={cn(
                        "font-medium text-sm",
                        chat.currentStep === step.id ? "text-blue-600" : 
                        chat.currentStep > step.id ? "text-emerald-600" : "text-neutral-500"
                      )}>
                        {step.name}
                      </span>
                      {chat.currentStep === step.id && (
                        <span className="mr-auto text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                          כאן אתה
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop: Full header */}
        <div className="hidden sm:block px-4 py-3">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                title="חזרה לדף הבית"
              >
                <Home className="w-5 h-5 text-neutral-500" />
              </Link>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900">תבעתי</h1>
                <p className="text-xs text-gray-500">מערכת הגשת תביעות</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {session.hasPaid && (
                <div className="flex items-center gap-1.5 text-sm bg-green-100 rounded-full px-3 py-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-700">שולם</span>
                </div>
              )}
              <button
                onClick={session.resetChat}
                className="p-2.5 rounded-lg hover:bg-[var(--secondary)] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                title="התחל מחדש"
                aria-label="התחל שיחה חדשה"
              >
                <RotateCcw className="w-5 h-5 text-[var(--muted)]" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Desktop: Steps Progress */}
          <div className="max-w-3xl mx-auto mt-3 px-2">
            {/* Progress Bar */}
            <div className="relative h-2 bg-neutral-100 rounded-full overflow-hidden mb-3">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((chat.currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            
            {/* Step Labels */}
            <div className="flex items-center justify-between">
              {STEPS.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <motion.div
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center text-base transition-all shadow-sm",
                      chat.currentStep > step.id
                        ? "bg-emerald-500 text-white shadow-emerald-200"
                        : chat.currentStep === step.id
                        ? "bg-blue-500 text-white shadow-blue-200 ring-4 ring-blue-100"
                        : "bg-white text-neutral-400 border-2 border-neutral-200"
                    )}
                    initial={false}
                    animate={{
                      scale: chat.currentStep === step.id ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {chat.currentStep > step.id ? "✓" : step.icon}
                  </motion.div>
                  <span className={cn(
                    "text-[10px] mt-1.5 font-medium transition-colors",
                    chat.currentStep === step.id ? "text-blue-600" : 
                    chat.currentStep > step.id ? "text-emerald-600" : "text-neutral-400"
                  )}>
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={payment.showPaymentModal}
        onClose={() => payment.setShowPaymentModal(false)}
        onPayment={payment.processPayment}
        onPaymentSuccess={payment.handlePaymentSuccess}
        isProcessing={payment.isProcessingPayment}
        agreedToTerms={payment.agreedToTerms}
        setAgreedToTerms={payment.setAgreedToTerms}
        couponCode={payment.couponCode}
        setCouponCode={payment.setCouponCode}
        couponLoading={payment.couponLoading}
        couponError={payment.couponError}
        appliedCoupon={payment.appliedCoupon}
        onValidateCoupon={payment.validateCoupon}
        onRemoveCoupon={payment.removeCoupon}
        calculateFinalPrice={payment.calculateFinalPrice}
      />

      {/* Preview Modal */}
      <PreviewModal
        isOpen={payment.showPreview}
        claimData={session.claimData}
        onClose={() => payment.setShowPreview(false)}
        onPayment={() => {
          payment.setShowPreview(false);
          payment.setShowPaymentModal(true);
        }}
      />

      {/* Step 7 - Request Claim Generation */}
      {chat.currentStep >= 7 && !session.claimData && !chat.isLoading && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-3">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-700">סיימנו לאסוף את כל הפרטים!</span>
            </div>
            <button
              onClick={chat.requestClaimGeneration}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              צור כתב תביעה 📄
            </button>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <main 
        className="flex-1 overflow-y-auto px-4 py-6"
        onClick={() => showMobileSteps && setShowMobileSteps(false)}
      >
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileUpload.fileInputRef}
          onChange={fileUpload.handleFileUpload}
          accept=".txt,.pdf,.jpg,.jpeg,.png,.doc,.docx"
          className="hidden"
        />

        <ChatMessages
          messages={session.messages}
          isLoading={chat.isLoading}
          claimData={session.claimData}
          hasPaid={session.hasPaid}
          showNextSteps={session.showNextSteps}
          onShowPreview={() => payment.setShowPreview(true)}
          onPaymentAndDownload={payment.handlePaymentAndDownload}
        />
      </main>

      {/* Quick Actions (only on welcome) */}
      {session.showWelcome && session.messages.length === 1 && (
        <ChatWelcome onQuickAction={chat.handleQuickAction} />
      )}

      {/* Input Area */}
      <ChatInput
        input={chat.input}
        setInput={chat.setInput}
        isLoading={chat.isLoading}
        uploadedFiles={session.uploadedFiles}
        setUploadedFiles={session.setUploadedFiles}
        isUploading={fileUpload.isUploading}
        fileInputRef={fileUpload.fileInputRef}
        onSubmit={chat.handleSubmit}
        onKeyDown={chat.handleKeyDown}
        onCloseMobileSteps={() => showMobileSteps && setShowMobileSteps(false)}
      />
    </div>
  );
}
