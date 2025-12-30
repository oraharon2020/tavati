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
    attachments: session.attachments,
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
            payment.handleGeneratePDF(true); // true = include attachments
          }}
        />
      );
    }

    return (
      <NextStepsScreen
        claimData={session.claimData}
        attachments={session.attachments}
        onGeneratePDF={() => payment.handleGeneratePDF(false)} // false = without attachments
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
        <div className="hidden sm:block px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-6">
            {/* Left: Logo + Home */}
            <div className="flex items-center gap-3 flex-shrink-0">
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
              <span className="font-bold text-lg text-gray-900">תבעתי</span>
            </div>

            {/* Center: Steps Progress - Clean with numbers and text */}
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center gap-0">
                {STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                          chat.currentStep > step.id
                            ? "bg-emerald-500 text-white"
                            : chat.currentStep === step.id
                            ? "bg-blue-600 text-white"
                            : "bg-neutral-200 text-neutral-500"
                        )}
                      >
                        {chat.currentStep > step.id ? "✓" : step.id}
                      </div>
                      <span className={cn(
                        "text-[11px] mt-1 font-medium whitespace-nowrap",
                        chat.currentStep > step.id
                          ? "text-emerald-600"
                          : chat.currentStep === step.id
                          ? "text-blue-600"
                          : "text-neutral-400"
                      )}>
                        {step.name}
                      </span>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className={cn(
                        "w-10 h-[2px] mx-1.5 mt-[-14px]",
                        chat.currentStep > step.id ? "bg-emerald-500" : "bg-neutral-200"
                      )} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {session.hasPaid && (
                <div className="flex items-center gap-1.5 text-sm bg-green-100 rounded-full px-3 py-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-700">שולם</span>
                </div>
              )}
              <button
                onClick={session.resetChat}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                title="התחל מחדש"
                aria-label="התחל שיחה חדשה"
              >
                <RotateCcw className="w-5 h-5 text-neutral-400" aria-hidden="true" />
              </button>
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
          onSendMessage={chat.handleSendMessage}
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
