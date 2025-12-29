"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ChatInterface from "@/components/ChatInterface";
import PhoneAuth from "@/components/PhoneAuth";
import { useAuth } from "@/contexts/AuthContext";

function ChatContent() {
  const { isAuthenticated, phone, login } = useAuth();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");

  const handleAuthenticated = (phoneNumber: string) => {
    login(phoneNumber);
  };

  if (!isAuthenticated) {
    return <PhoneAuth onAuthenticated={handleAuthenticated} />;
  }

  return <ChatInterface sessionId={sessionId} phone={phone} />;
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}

